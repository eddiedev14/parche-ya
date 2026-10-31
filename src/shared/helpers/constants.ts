import {
  appsOutline,
  bookOutline,
  ellipsisHorizontalOutline,
  filmOutline,
  footballOutline,
  gameControllerOutline,
  leafOutline,
  musicalNotesOutline,
  restaurantOutline,
} from "ionicons/icons";
//? Coloco las constantes de el sidebar aquí pero no sé si sería lo mejor, cualquier cosa me avisas o lo cambias
import { calendarOutline, compassOutline, mapOutline } from "ionicons/icons";
import { ROUTES } from "../../router/routes";

//* Items del sidebar
export const SIDEBAR_ITEMS = [
  { label: "Explorar", icon: compassOutline, route: ROUTES.explore },
  { label: "Mapa", icon: mapOutline, route: ROUTES.map },
  { label: "Mis planes", icon: calendarOutline, route: ROUTES.myPlans },
];

//* Pestañas de la barra inferior
export const TAB_ITEMS = [...SIDEBAR_ITEMS];

//* Categorías de plan (catálogo fijo).
export const CATEGORIES = [
  {
    id: "deporte",
    name: "Deporte",
    icon: footballOutline,
    color: "#22B07D",
  },
  { id: "estudio", name: "Estudio", icon: bookOutline, color: "#5B3DF5" },
  {
    id: "comida",
    name: "Comida y café",
    icon: restaurantOutline,
    color: "#F5A524",
  },
  {
    id: "musica",
    name: "Música",
    icon: musicalNotesOutline,
    color: "#D946A8",
  },
  {
    id: "juegos",
    name: "Juegos",
    icon: gameControllerOutline,
    color: "#2E90FA",
  },
  {
    id: "aire_libre",
    name: "Aire libre",
    icon: leafOutline,
    color: "#14B8A6",
  },
  { id: "cine", name: "Cine y series", icon: filmOutline, color: "#475467" },
  {
    id: "otro",
    name: "Otro",
    icon: ellipsisHorizontalOutline,
    color: "#98A2B3",
  },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type CategoryId = Category["id"];

//? Opción "Todos" de la fila de filtros de Explorar y Mapa (no es una categoría de plan)
export const CATEGORY_ALL = {
  id: "todos",
  name: "Todos",
  icon: appsOutline,
  color: "#E8481F",
} as const;

export const getCategory = (id: CategoryId): Category =>
  CATEGORIES.find((category) => category.id === id) ?? CATEGORIES[7];

//* Estados de un plan. Todos se calculan (ver getPlanStatus), excepto "cancelado" que se guarda
export const PLAN_STATUSES = {
  por_empezar: { label: "Por empezar", color: "#F5A524" },
  en_curso: { label: "En curso", color: "#22B07D" },
  lleno: { label: "Lleno", color: "#5B3DF5" },
  terminado: { label: "Terminado", color: "#98A2B3" },
  cancelado: { label: "Cancelado", color: "#98A2B3" },
} as const;

export type PlanStatus = keyof typeof PLAN_STATUSES;

//* Validación de formularios
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
