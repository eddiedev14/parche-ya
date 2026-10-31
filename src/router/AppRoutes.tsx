import { useEffect } from "react";
import { Navigate, Route, useLocation, useNavigate } from "react-router-dom";
import { IonRouterOutlet } from "@ionic/react";

import { useAuth } from "../features/auth";
import {
  LoadingOverlay,
  LoadingScreen,
} from "../shared/components/LoadingScreen";
import { AuthPage, WelcomePage } from "../pages";
import TabsLayout from "./TabsLayout";
import { GUEST_HOME_ROUTE, HOME_ROUTE, PUBLIC_ROUTES, ROUTES } from "./routes";

const AppRoutes = () => {
  const { user, userLoading, registering } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  //? Durante el registro ya hay sesión pero la foto aún se está subiendo: se espera a que termine para redirigir
  const isRedirecting =
    !userLoading && !registering && (user ? isPublicRoute : !isPublicRoute);

  useEffect(() => {
    if (isRedirecting) {
      navigate(user ? HOME_ROUTE : GUEST_HOME_ROUTE, { replace: true });
    }
  }, [isRedirecting, navigate, user]);

  //? Las rutas siempre renderizan su página real. Si el contenido de una ruta
  //? cambia entre <LoadingScreen /> y la página mientras se redirige, Ionic
  //? monta un IonPage nuevo en plena transición y, cuando la vista de destino
  //? ya existía en el historial (welcome → register → explore → welcome), la
  //? transición no termina y el loader queda pegado. Por eso el loader es un
  //? overlay aparte que no toca las rutas.
  const pending = userLoading || isRedirecting;

  return (
    <>
      <IonRouterOutlet>
        {/* Public Routes (sin sesión) */}
        <Route path={ROUTES.welcome} element={<WelcomePage />} />
        <Route path={ROUTES.login} element={<AuthPage />} />
        <Route path={ROUTES.register} element={<AuthPage isSignup />} />

        {/* User Routes (rol user). Las 4 pestañas viven dentro de TabsLayout */}
        <Route path="/tabs/*" element={<TabsLayout />} />

        <Route
          path="*"
          element={
            pending ? (
              <LoadingScreen />
            ) : (
              <Navigate to={user ? HOME_ROUTE : GUEST_HOME_ROUTE} replace />
            )
          }
        />
      </IonRouterOutlet>
      {pending && <LoadingOverlay />}
    </>
  );
};

export default AppRoutes;
