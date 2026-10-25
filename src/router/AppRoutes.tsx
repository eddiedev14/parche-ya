import { useEffect, type ReactElement } from "react";
import { Navigate, Route, useLocation, useNavigate } from "react-router-dom";
import { IonRouterOutlet } from "@ionic/react";

import { useAuth } from "../features/auth";
import { LoadingScreen } from "../shared/components/LoadingScreen";
import { AuthPage, ExplorePage, WelcomePage } from "../pages";
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

  //? El <IonRouterOutlet> debe permanecer siempre montado: si se reemplaza por
  //? un loader mientras se redirige, al volver a montarlo Ionic no completa la
  //? transición y la página entrante queda invisible (pantalla en blanco).
  //? Por eso el loader se renderiza dentro de cada ruta, no en lugar del outlet.
  const pending = userLoading || isRedirecting;
  const publicPage = (page: ReactElement) =>
    pending ? <LoadingScreen /> : page;
  const privatePage = (page: ReactElement) =>
    pending || !user ? <LoadingScreen /> : page;

  return (
    <IonRouterOutlet>
      {/* Public Routes (sin sesión) */}
      <Route path={ROUTES.welcome} element={publicPage(<WelcomePage />)} />
      <Route path={ROUTES.login} element={publicPage(<AuthPage />)} />
      <Route
        path={ROUTES.register}
        element={publicPage(<AuthPage isSignup />)}
      />

      {/* User Routes (rol user) */}
      <Route path={ROUTES.explore} element={privatePage(<ExplorePage />)} />

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
  );
};

export default AppRoutes;
