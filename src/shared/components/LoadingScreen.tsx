import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import { Logo } from "./Logo";

//? Debe ser un <IonPage> real: si la vista entrante no registra una página,
//? el router no puede completar la transición.
export const LoadingScreen = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="min-h-dvh flex flex-col items-center justify-center gap-6">
          <Logo size={96} />
          <IonSpinner name="crescent" color="primary" className="size-8" />
        </div>
      </IonContent>
    </IonPage>
  );
};
