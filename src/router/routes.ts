//* Todas las rutas de la app (ver "Mapa de pantallas" en la documentación)
export const ROUTES = {
  welcome: "/welcome",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  explore: "/tabs/explore",
  map: "/tabs/map",
  myPlans: "/tabs/my-plans",
  plan: (planId: string) => `/plan/${planId}`,
  planChat: (planId: string) => `/plan/${planId}/chat`,
} as const;

//? Rutas accesibles sin sesión iniciada. Agregar aquí cada página pública a medida que se implemente
export const PUBLIC_ROUTES: string[] = [
  ROUTES.welcome,
  ROUTES.login,
  ROUTES.register,
];

//? A donde se envía al usuario según tenga sesión o no
export const HOME_ROUTE = ROUTES.explore;
export const GUEST_HOME_ROUTE = ROUTES.welcome;
