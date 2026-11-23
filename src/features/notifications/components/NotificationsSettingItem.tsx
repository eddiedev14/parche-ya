import { IonButton, IonIcon, IonItem, IonLabel } from "@ionic/react";
import { notificationsOutline } from "ionicons/icons";
import { usePushPermission } from "../hooks/usePushPermission";

//? Item "Notificaciones" de la lista de Perfil: quien dijo "Ahora no" puede activarlas después
export const NotificationsSettingItem = () => {
  const { isSupported, isEnabled, enable } = usePushPermission();

  if (!isSupported) return null;

  return (
    <IonItem>
      <IonIcon icon={notificationsOutline} slot="start" aria-hidden="true" />
      <IonLabel className="text-body text-ink">Notificaciones</IonLabel>
      {isEnabled ? (
        <span slot="end" className="text-body text-muted">
          Activadas
        </span>
      ) : (
        <IonButton slot="end" fill="clear" onClick={enable}>
          Activar
        </IonButton>
      )}
    </IonItem>
  );
};
