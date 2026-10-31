import { IonModal } from "@ionic/react";

import { NewPlanForm } from "./NewPlanForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

//? Hoja casi a pantalla completa. El formulario solo se monta mientras está abierta, así que cada vez empieza vacío
//? Breakpoint máximo en 1: con 0.95 Ionic baja el wrapper un 5% y ese tramo (donde está el footer) queda fuera de la pantalla
export const NewPlanModal = ({ isOpen, onClose }: Props) => (
  <IonModal
    isOpen={isOpen}
    onDidDismiss={onClose}
    initialBreakpoint={1}
    breakpoints={[0, 1]}
  >
    <NewPlanForm onClose={onClose} />
  </IonModal>
);
