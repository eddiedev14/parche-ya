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

interface Participant {
  id: string;
  name: string;
}

//* Nodo planRooms/{planId} (mismo formato que escribe la app)
interface PlanRoom {
  capacity: number;
  count: number;
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

  if (typeof planId !== "string" || !PLAN_ID_REGEX.test(planId)) {
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
    const caller = participants.find((participant) => participant.id === uid);

    if (!caller) {
      return res.status(403).json({ message: "Not a participant" });
    }

    //? El organizador no se avisa a sí mismo
    if (uid === plan.creatorId) {
      return res.status(200).json({ sent: false });
    }

    // 6. Token del organizador
    const creatorRef = db.collection("users").doc(plan.creatorId);
    const fcmToken = (await creatorRef.get()).data()?.fcmToken;

    if (!fcmToken) {
      return res.status(200).json({ sent: false });
    }

    // 7. Enviar la notificación
    try {
      await getMessaging().send({
        token: fcmToken,
        notification: {
          title: `${caller.name} se unió a tu plan`,
          body: `${plan.title} · ${room.count}/${room.capacity}`,
        },
        data: { route: `/plan/${planId}` },
        android: { notification: { channelId: "default" } },
      });
    } catch (error) {
      //? El token ya no sirve (app desinstalada o datos borrados): se limpia para no volver a intentarlo
      const code = (error as { code?: string }).code;

      if (code === "messaging/registration-token-not-registered") {
        await creatorRef.update({ fcmToken: null });
        return res.status(200).json({ sent: false });
      }

      throw error;
    }

    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
}
