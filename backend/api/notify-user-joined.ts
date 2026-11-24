import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getMessaging } from "firebase-admin/messaging";
import { setCorsHeaders } from "../lib/cors.js";
import { auth, db, rtdb } from "../lib/firebaseAdmin.js";

//? Solo ids de Firestore: evita que un planId con "/" apunte a otro nodo de la RTDB
const PLAN_ID_REGEX = /^[\w-]+$/;

//? Un mismo usuario dispara como máximo un aviso de "se unió" cada 5 min por plan (frena el spam y los bucles unirse/salir)
const THROTTLE_MS = 5 * 60_000;

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
  setCorsHeaders(req, res, "POST");

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

    // 6. Límite por usuario y plan
    //? Las funciones serverless no recuerdan nada entre llamadas, por eso la marca vive en la RTDB.
    //? La transacción evita que dos llamadas casi simultáneas pasen las dos
    const now = Date.now();
    const throttle = await rtdb
      .ref(`notifyJoinThrottle/${planId}/${uid}`)
      .transaction((last: number | null) =>
        last && now - last < THROTTLE_MS ? undefined : now,
      );

    if (!throttle.committed) {
      return res.status(200).json({ sent: false });
    }

    // 7. Token del organizador
    const creatorRef = db.collection("users").doc(plan.creatorId);
    const fcmToken = (await creatorRef.get()).data()?.fcmToken;

    if (!fcmToken) {
      return res.status(200).json({ sent: false });
    }

    // 8. Enviar la notificación
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
