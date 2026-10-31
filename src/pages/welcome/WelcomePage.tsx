import { IonButton, IonChip, IonContent, IonPage } from "@ionic/react";
import { useNavigate } from "react-router-dom";

import { Logo } from "@/shared/components/Logo";
import { ROUTES } from "@/router/routes";
import { WelcomeHero } from "./WelcomeHero";

const HIGHLIGHTS = ["1 a 3 horas", "Cupo limitado", "Se borra solo"];

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent fullscreen>
        <section className="flex min-h-dvh flex-col px-4 pt-[max(16px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
          <header className="flex items-center justify-center gap-2 py-2">
            <Logo size={40} />
            <span className="font-heading text-h4 text-ink">ParcheYa</span>
          </header>

          <div className="flex flex-1 flex-col items-center justify-center py-4">
            <WelcomeHero />

            <div className="flex flex-col items-center gap-3 text-center">
              <h1 className="font-heading text-h1 text-ink">
                Planes para ahora, con gente cerca
              </h1>
              <p className="text-body-lg text-muted">
                Únete a planes cerca de ti o crea el tuyo. Cuando termina,
                desaparece solo.
              </p>

              <div className="flex flex-wrap justify-center gap-2 [@media(max-height:720px)]:hidden">
                {HIGHLIGHTS.map((highlight) => (
                  <IonChip
                    key={highlight}
                    outline
                    className="text-caption text-muted border-line bg-surface m-0"
                  >
                    {highlight}
                  </IonChip>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <IonButton
              expand="block"
              className="m-0"
              onClick={() => navigate(ROUTES.register)}
            >
              Registrarse
            </IonButton>
            <IonButton
              expand="block"
              fill="outline"
              className="m-0"
              onClick={() => navigate(ROUTES.login)}
            >
              Iniciar sesión
            </IonButton>
          </div>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;
