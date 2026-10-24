import { IonButton, IonContent, IonPage } from "@ionic/react";
import { useNavigate } from "react-router-dom";

import { Logo } from "../../shared/components/Logo";
import { ROUTES } from "../../router/routes";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="min-h-dvh flex flex-col items-center justify-center gap-8 px-6 text-center">
          <Logo size={96} />

          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-h1 text-ink">
              Planes para ahora, con gente cerca
            </h1>
            <p className="text-body-lg text-muted">
              Únete a planes cerca de ti o crea el tuyo. Cuando termina,
              desaparece solo.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <IonButton expand="block" onClick={() => navigate(ROUTES.register)}>
              Crear cuenta
            </IonButton>
            <IonButton
              expand="block"
              fill="outline"
              onClick={() => navigate(ROUTES.login)}
            >
              Ya tengo cuenta
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;
