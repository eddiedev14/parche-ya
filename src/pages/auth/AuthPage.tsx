import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { useNavigate } from "react-router-dom";

import { Logo } from "@/shared/components/Logo";
import { ROUTES } from "@/router/routes";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { SignupForm } from "@/features/auth/components/SignupForm";

interface Props {
  isSignup?: boolean;
}

//? Una sola página para /register (isSignup) y /login. Cambia el título, el formulario y el pie
const AuthPage = ({ isSignup = false }: Props) => {
  const navigate = useNavigate();

  return (
    <IonPage>
      {isSignup && (
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={ROUTES.welcome} text="" />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      )}

      <IonContent fullscreen>
        <section className="flex min-h-full flex-col gap-6 px-4 pt-[max(16px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
          <header className="flex flex-col items-center gap-2 text-center">
            {!isSignup && <Logo size={64} />}
            <h1 className="font-heading text-h2 text-ink">
              {isSignup ? "Crea tu cuenta" : "Hola de nuevo"}
            </h1>
          </header>

          {isSignup ? <SignupForm /> : <LoginForm />}

          <footer className="text-body text-muted mt-auto flex items-center justify-center">
            {isSignup ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
            <IonButton
              fill="clear"
              size="small"
              color="secondary"
              className="m-0"
              onClick={() =>
                navigate(isSignup ? ROUTES.login : ROUTES.register, {
                  replace: true,
                })
              }
            >
              {isSignup ? "Inicia sesión" : "Regístrate"}
            </IonButton>
          </footer>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default AuthPage;
