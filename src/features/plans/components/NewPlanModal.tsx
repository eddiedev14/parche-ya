import { IonModal } from "@ionic/react";

import { NewPlanForm } from "./NewPlanForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

//? Hoja casi a pantalla completa. El formulario solo se monta mientras está abierta, así que cada vez empieza vacío
export const NewPlanModal = ({ isOpen, onClose }: Props) => (
  <IonModal
    isOpen={isOpen}
    onDidDismiss={onClose}
    initialBreakpoint={0.95}
    breakpoints={[0, 0.95]}
  >
    <NewPlanForm onClose={onClose} />
  </IonModal>
);
