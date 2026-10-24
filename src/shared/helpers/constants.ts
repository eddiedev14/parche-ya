//* Categorías de plan (catálogo fijo). El ícono es un nombre de Ionicons (ver DESIGN.md)
export const CATEGORIES = [
  {
    id: "deporte",
    name: "Deporte",
    icon: "football-outline",
    color: "#22B07D",
  },
  { id: "estudio", name: "Estudio", icon: "book-outline", color: "#5B3DF5" },
  {
    id: "comida",
    name: "Comida y café",
    icon: "restaurant-outline",
    color: "#F5A524",
  },
  {
    id: "musica",
    name: "Música",
    icon: "musical-notes-outline",
    color: "#D946A8",
  },
  {
    id: "juegos",
    name: "Juegos",
    icon: "game-controller-outline",
    color: "#2E90FA",
  },
  {
    id: "aire_libre",
    name: "Aire libre",
    icon: "leaf-outline",
    color: "#14B8A6",
  },
  { id: "cine", name: "Cine y series", icon: "film-outline", color: "#475467" },
  {
    id: "otro",
    name: "Otro",
    icon: "ellipsis-horizontal-outline",
    color: "#98A2B3",
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

//* Estados de un plan (se calculan, no se guardan, excepto "cancelled")
export const PLAN_STATUSES = {
  por_empezar: { label: "Por empezar", color: "#F5A524" },
  en_curso: { label: "En curso", color: "#22B07D" },
  lleno: { label: "Lleno", color: "#5B3DF5" },
  terminado: { label: "Terminado", color: "#98A2B3" },
} as const;

export type PlanStatus = keyof typeof PLAN_STATUSES;

//* Validación de formularios
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
