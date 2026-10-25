import { IonIcon } from "@ionic/react";
import { alertCircleOutline } from "ionicons/icons";

interface Props {
  id?: string;
  message?: string;
}

//? Se renderiza solo si hay mensaje. role="alert" hace que el lector de pantalla lo anuncie al aparecer
export const InputError = ({ id, message }: Props) => {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className="text-caption text-danger mt-1 flex items-center gap-1"
    >
      <IonIcon icon={alertCircleOutline} aria-hidden="true" />
      {message}
    </p>
  );
};
