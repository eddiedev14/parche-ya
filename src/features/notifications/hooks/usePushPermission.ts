import { useCallback, useEffect, useState } from "react";
import type { PermissionState } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { Toast } from "@/shared/classes/Toast.class";
import { isPushSupported, registerDevice } from "../helpers/push.helper";

const DENIED_MESSAGE =
  "No pudimos activar las notificaciones. Puedes activarlas desde los ajustes del celular";

//? Estado del permiso del sistema y la acción de activarlas (alert de Explorar)
export const usePushPermission = () => {
  const isSupported = isPushSupported();
  //? null mientras se consulta
  const [permission, setPermission] = useState<PermissionState | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    PushNotifications.checkPermissions()
      .then(({ receive }) => setPermission(receive))
      .catch(() => setPermission("denied"));
  }, [isSupported]);

  const enable = useCallback(async () => {
    if (!isSupported) return;

    try {
      //? En Android 13+ es el diálogo de POST_NOTIFICATIONS. Si ya lo negó, el sistema responde "denied" sin mostrar nada
      const { receive } = await PushNotifications.requestPermissions();
      setPermission(receive);

      if (receive !== "granted") {
        Toast.error(DENIED_MESSAGE);
        return;
      }

      //? El token lo guarda el listener "registration" de usePushRegistration
      await registerDevice();
    } catch {
      Toast.error(DENIED_MESSAGE);
    }
  }, [isSupported]);

  return {
    isSupported,
    permission,
    enable,
  };
};
