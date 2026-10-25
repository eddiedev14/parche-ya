import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import { Logo } from "./Logo";

const LoadingContent = () => (
  <div className="min-h-dvh flex flex-col items-center justify-center gap-6">
    <Logo size={96} />
    <IonSpinner name="crescent" color="primary" className="size-8" />
  </div>
);

//? Debe ser un <IonPage> real: si la vista entrante no registra una página,
//? el router no puede completar la transición.
export const LoadingScreen = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <LoadingContent />
      </IonContent>
    </IonPage>
  );
};

//? Cubre la app sin ser una página: se puede mostrar u ocultar sin tocar el
//? contenido de las rutas, que es lo que rompe las transiciones de Ionic.
export const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-[10000] bg-[var(--ion-background-color)]">
      <LoadingContent />
    </div>
  );
};
