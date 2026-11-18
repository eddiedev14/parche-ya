import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getMessaging } from "firebase-admin/messaging";
import { auth, db, rtdb } from "./firebaseAdmin.js";

//? Orígenes que pueden llamar a este endpoint desde el navegador. Se amplían con ALLOWED_ORIGINS (separados por coma)
const ALLOWED_ORIGINS = [
  "http://localhost:8100", // ionic serve
  "https://localhost", // Capacitor Android (androidScheme por defecto desde Capacitor 6)
  "http://localhost", // Capacitor Android con androidScheme: "http"
  "capacitor://localhost", // Capacitor iOS
  "ionic://localhost",
  ...(process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) ?? []),
];

const setCorsHeaders = (req: VercelRequest, res: VercelResponse) => {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
};

//? Solo ids de Firestore: evita que un planId con "/" apunte a otro nodo de la RTDB
const PLAN_ID_REGEX = /^[\w-]+$/;

//? Un mismo remitente dispara como máximo una notificación cada 30 s por plan
const THROTTLE_MS = 30_000;
const PREVIEW_LENGTH = 80;

interface Participant {
  id: string;
  name: string;
}

//* Nodo planRooms/{planId} (mismo formato que escribe la app)
interface PlanRoom {
  participants?: Participant[] | Record<string, Participant>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);

  //? Preflight: el header Authorization hace que el navegador lo envíe antes del POST
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // 1. Obtener token del usuario
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  // 2. Verificar token con Firebase
  let uid: string;

  try {
    const decodedUser = await auth.verifyIdToken(idToken);
    uid = decodedUser.uid;
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  // 3. Validar body
  const planId = req.body?.planId;
  const text = req.body?.text;

  if (
    typeof planId !== "string" ||
    !PLAN_ID_REGEX.test(planId) ||
    typeof text !== "string" ||
    !text.trim()
  ) {
    return res.status(400).json({ message: "Parámetros inválidos" });
  }

  try {
    // 4. Leer el plan (Firestore) y su sala (RTDB)
    const [planSnapshot, roomSnapshot] = await Promise.all([
      db.collection("plans").doc(planId).get(),
      rtdb.ref(`planRooms/${planId}`).get(),
    ]);
    const plan = planSnapshot.data();
    const room = roomSnapshot.val() as PlanRoom | null;

    if (!plan || !room) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // 5. Solo un participante del plan puede avisar
    //? RTDB puede devolver el array como objeto { 0: …, 1: … }; Object.values sirve en los dos casos
    const participants = Object.values(room.participants ?? {});
    const sender = participants.find((participant) => participant.id === uid);

    if (!sender) {
      return res.status(403).json({ message: "Not a participant" });
    }

    // 6. Límite de 30 s por remitente y plan
    //? Las funciones serverless no recuerdan nada entre llamadas, por eso la marca vive en la RTDB.
    //? La transacción evita que dos mensajes casi simultáneos pasen los dos
    const now = Date.now();
    const throttle = await rtdb
      .ref(`notifyThrottle/${planId}/${uid}`)
      .transaction((last: number | null) =>
        last && now - last < THROTTLE_MS ? undefined : now,
      );

    if (!throttle.committed) {
      return res.status(200).json({ sent: 0 });
    }

    // 7. Tokens de los demás participantes (nunca el remitente)
    const userRefs = participants
      .filter((participant) => participant.id !== uid)
      .map((participant) => db.collection("users").doc(participant.id));

    if (!userRefs.length) {
      return res.status(200).json({ sent: 0 });
    }

    const recipients = (await db.getAll(...userRefs)).flatMap((snapshot) => {
      const token: string | null | undefined = snapshot.data()?.fcmToken;
      return token ? [{ ref: snapshot.ref, token }] : [];
    });

    if (!recipients.length) {
      return res.status(200).json({ sent: 0 });
    }

    // 8. Enviar la notificación
    const response = await getMessaging().sendEachForMulticast({
      tokens: recipients.map((recipient) => recipient.token),
      notification: {
        title: plan.title,
        body: `${sender.name}: ${text.trim().slice(0, PREVIEW_LENGTH)}`,
      },
      data: { route: `/plan/${planId}/chat` },
      android: { notification: { channelId: "default" } },
    });

    //? Los tokens que ya no sirven (app desinstalada o datos borrados) se limpian para no volver a intentarlo
    await Promise.all(
      response.responses.map((result, index) =>
        result.error?.code === "messaging/registration-token-not-registered"
          ? recipients[index].ref.update({ fcmToken: null })
          : null,
      ),
    );

    return res.status(200).json({ sent: response.successCount });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
}
