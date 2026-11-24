import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

//? El backend envía con channelId "default"
const CHANNEL_ID = "default";

//? Push solo existe en el celular; en el navegador (npm run dev) no se ofrece nada
const isPushSupported = () => Capacitor.isNativePlatform();

//? Crea el canal (solo existe en Android) y pide el token, que llega en el evento "registration"
const registerDevice = async () => {
  if (Capacitor.getPlatform() === "android") {
    //? Importancia 5 (alta): la notificación aparece como banner y suena
    await PushNotifications.createChannel({
      id: CHANNEL_ID,
      name: "Avisos de ParcheYa",
      importance: 5,
    });
  }

  await PushNotifications.register();
};

export { isPushSupported, registerDevice };
