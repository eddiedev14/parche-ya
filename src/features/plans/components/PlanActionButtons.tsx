import { IonButton, IonSpinner } from "@ionic/react";
import type { PlanStatus } from "@/shared/helpers/constants";

interface Props {
  status: PlanStatus;
  isJoined: boolean;
  isCreator: boolean;
  loading: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onChat: () => void;
}

const BUTTON_CLASS = "m-0 min-h-11";

//? Botones del pie del detalle según el estado (tabla 8.2 del DESIGN.md)
export const PlanActionButtons = ({
  status,
  isJoined,
  isCreator,
  loading,
  onJoin,
  onLeave,
  onChat,
}: Props) => {
  //* Terminado o cancelado: botón deshabilitado y, si estaba unido, acceso al chat
  if (status === "terminado" || status === "cancelado") {
    return (
      <div className="flex flex-col gap-2">
        {(isJoined || isCreator) && (
          <IonButton expand="block" className={BUTTON_CLASS} onClick={onChat}>
            Ver chat
          </IonButton>
        )}
        <IonButton
          expand="block"
          color="medium"
          fill="outline"
          className={BUTTON_CLASS}
          disabled
        >
          {status === "terminado" ? "Plan terminado" : "Plan cancelado"}
        </IonButton>
      </div>
    );
  }

  if (isCreator) {
    return (
      <IonButton expand="block" className={BUTTON_CLASS} onClick={onChat}>
        Ir al chat
      </IonButton>
    );
  }

  if (isJoined) {
    return (
      <div className="flex flex-col gap-2">
        <IonButton expand="block" className={BUTTON_CLASS} onClick={onChat}>
          Ir al chat
        </IonButton>
        <IonButton
          expand="block"
          fill="outline"
          color="danger"
          className={BUTTON_CLASS}
          disabled={loading}
          onClick={onLeave}
        >
          {loading ? <IonSpinner name="crescent" /> : "Salir del plan"}
        </IonButton>
      </div>
    );
  }

  if (status === "lleno") {
    return (
      <IonButton expand="block" className={BUTTON_CLASS} disabled>
        Plan lleno
      </IonButton>
    );
  }

  return (
    <IonButton
      expand="block"
      className={BUTTON_CLASS}
      disabled={loading}
      onClick={onJoin}
    >
      {loading ? <IonSpinner name="crescent" /> : "Unirme al plan"}
    </IonButton>
  );
};
