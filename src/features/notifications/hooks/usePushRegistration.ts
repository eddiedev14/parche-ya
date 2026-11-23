import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { PluginListenerHandle } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { useAuth, type User } from "@/features/auth";
import { Toast } from "@/shared/classes/Toast.class";
import { useCollection } from "@/shared/firebase/hooks/useCollection";
import { isPushSupported, registerDevice } from "../helpers/push.helper";
import type { PushData } from "../types/notifications.types";

//? Listeners de push mientras haya sesión. Se monta una sola vez, en AppRoutes
export const usePushRegistration = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const { update } = useCollection<User>("users");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  //? navigate y pathname cambian al navegar; con refs los listeners no se vuelven a crear por eso
  const navigateRef = useRef(navigate);
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    navigateRef.current = navigate;
    pathnameRef.current = pathname;
  }, [navigate, pathname]);

  useEffect(() => {
    if (!userId || !isPushSupported()) return;

    const listeners: Promise<PluginListenerHandle>[] = [
      PushNotifications.addListener("registration", ({ value }) => {
        update(userId, { fcmToken: value });
      }),

      PushNotifications.addListener("registrationError", () => {
        Toast.error(
          "No pudimos activar las notificaciones. Inténtalo más tarde",
        );
      }),

      //? Con la app abierta Android no muestra la notificación, por eso se avisa con un toast
      PushNotifications.addListener(
        "pushNotificationReceived",
        ({ title, body, data }) => {
          const { route } = data as PushData;
          //? Si ya está en esa pantalla (por ejemplo, el mismo chat) el aviso sobra
          if (route && route === pathnameRef.current) return;

          Toast.info([title, body].filter(Boolean).join(": "));
        },
      ),

      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        ({ notification }) => {
          const { route } = notification.data as PushData;
          if (route) navigateRef.current(route);
        },
      ),
    ];

    //? Si ya dio permiso antes (reabre la app o vuelve a iniciar sesión) se registra otra vez y se actualiza el token, sin alert
    PushNotifications.checkPermissions()
      .then(({ receive }) => {
        if (receive === "granted") return registerDevice();
      })
      .catch(() => {
        //? Sin token no llegan avisos, pero la app sigue funcionando
      });

    return () => {
      listeners.forEach((listener) =>
        listener.then((handle) => handle.remove()),
      );
    };
  }, [userId, update]);
};
