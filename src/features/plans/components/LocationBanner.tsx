import { IonButton, IonIcon } from "@ionic/react";
import { locationOutline } from "ionicons/icons";

interface Props {
  onActivate: () => void;
}

//? Solo se muestra si no tenemos permiso de ubicación. Sobre amarillo el texto va en Tinta
export const LocationBanner = ({ onActivate }: Props) => (
  <div className="bg-accent text-ink rounded-card flex items-center gap-3 p-3">
    <IonIcon icon={locationOutline} className="size-6 shrink-0" />
    <p className="text-body flex-1">
      Activa tu ubicación para ver distancias y planes cercanos
    </p>
    <IonButton
      fill="outline"
      size="small"
      className="m-0 h-11 shrink-0 [--border-color:var(--color-ink)] [--color:var(--color-ink)]"
      onClick={onActivate}
    >
      Activar
    </IonButton>
  </div>
);
