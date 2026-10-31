//* Opciones y límites del formulario de Nuevo plan

//? Valor = minutos desde ahora hasta que empieza el plan
export const START_OPTIONS = [
  { label: "Ahora", value: 0 },
  { label: "En 30 min", value: 30 },
  { label: "En 1 h", value: 60 },
  { label: "En 2 h", value: 120 },
];

//? Valor = horas que dura el plan
export const DURATION_OPTIONS = [
  { label: "1 h", value: 1 },
  { label: "2 h", value: 2 },
  { label: "3 h", value: 3 },
];

//? Límites (en minutos) de la duración escrita a mano
export const DURATION_LIMITS = { min: 15, max: 480 };

//? Incluye al organizador
export const CAPACITY = { min: 2, max: 20, initial: 4 };

export const TITLE_LIMITS = { min: 5, max: 60 };
export const LOCATION_NAME_LIMITS = { min: 3, max: 80 };
export const DESCRIPTION_MAX = 280;

// Ubicacion de la UAO
export const DEFAULT_MAP_CENTER: [number, number] = [3.3536526, -76.5229863];
