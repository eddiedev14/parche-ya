import { getFirebaseToken } from "@/shared/firebase/helpers/auth.helper";
import { notificationsApi } from "../api/notifications.api";
import type {
  NotifyMessageBody,
  NotifyUserJoinedBody,
} from "../types/notifications.types";

//? La notificación es un extra: si falla, unirse o enviar el mensaje ya quedó hecho, así que no se avisa ni se lanza error
const postNotify = async (endpoint: string, body: object) => {
  try {
    const idToken = await getFirebaseToken();
    if (!idToken) return;

    await notificationsApi.post(endpoint, body, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
  } catch {
    //? Sin notificación, pero la app sigue normal
  }
};

//? Avisa al organizador que alguien se unió a su plan
const notifyUserJoined = (body: NotifyUserJoinedBody) =>
  postNotify("/notify-user-joined", body);

//? Avisa a los demás participantes que hay un mensaje nuevo en el chat
const notifyMessage = (body: NotifyMessageBody) =>
  postNotify("/notify-message", body);

export { notifyUserJoined, notifyMessage };
