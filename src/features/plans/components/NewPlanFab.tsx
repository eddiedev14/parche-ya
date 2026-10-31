import { useState } from "react";
import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { addOutline } from "ionicons/icons";

import { NewPlanModal } from "./NewPlanModal";

//? Va dentro del contenido de la page (IonFab slot="fixed" debe ser hijo directo de IonContent)
export const NewPlanFab = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton
          size="small"
          aria-label="Crear plan"
          onClick={() => setIsOpen(true)}
        >
          <IonIcon icon={addOutline} />
        </IonFabButton>
      </IonFab>
      <NewPlanModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
