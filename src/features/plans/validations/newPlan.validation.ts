import type { CategoryId } from "@/shared/helpers/constants";
import type { FormErrors } from "@/shared/hooks/useForm";
import { Coordinates } from "@/shared/types/plan.types";
import { minutesUntilTime } from "@/shared/helpers/plan.helper";
import {
  CAPACITY,
  DESCRIPTION_MAX,
  DURATION_LIMITS,
  LOCATION_NAME_LIMITS,
  TITLE_LIMITS,
} from "@/features/plans/constants";

export interface NewPlanValues {
  title: string;
  category: CategoryId | "";
  description: string;
  startInMinutes: number;
  //? Hora exacta "HH:MM". Vacía = se usa startInMinutes
  startTime: string;
  durationHours: number;
  //? Duración en minutos escrita a mano. Vacía = se usa durationHours
  durationMinutes: string;
  capacity: number;
  //? Nombre escrito del lugar
  locationName: string;
  location: Coordinates | null;
}

export type NewPlanErrors = FormErrors<NewPlanValues>;

export const EMPTY_NEW_PLAN: NewPlanValues = {
  title: "",
  category: "",
  description: "",
  startInMinutes: 30,
  startTime: "",
  durationHours: 1,
  durationMinutes: "",
  capacity: CAPACITY.initial,
  locationName: "",
  location: null,
};

const validateTitle = (value: string) => {
  const title = value.trim();
  if (!title) return "Escribe un título";
  if (title.length < TITLE_LIMITS.min)
    return `Mínimo ${TITLE_LIMITS.min} caracteres`;
  if (title.length > TITLE_LIMITS.max)
    return `Máximo ${TITLE_LIMITS.max} caracteres`;
};

const validateLocationName = (value: string) => {
  const name = value.trim();
  if (!name) return "Escribe el nombre del lugar";
  if (name.length < LOCATION_NAME_LIMITS.min)
    return `Mínimo ${LOCATION_NAME_LIMITS.min} caracteres`;
  if (name.length > LOCATION_NAME_LIMITS.max)
    return `Máximo ${LOCATION_NAME_LIMITS.max} caracteres`;
};

const validateStartTime = (value: string) => {
  if (value && minutesUntilTime(value) < 0) return "Esa hora ya pasó";
};

const validateDurationMinutes = (value: string) => {
  if (!value) return;
  const minutes = Number(value);
  if (
    !Number.isInteger(minutes) ||
    minutes < DURATION_LIMITS.min ||
    minutes > DURATION_LIMITS.max
  )
    return `Entre ${DURATION_LIMITS.min} y ${DURATION_LIMITS.max} minutos`;
};

//? Los segmentos y los botones − / + no permiten salir de sus opciones; solo se validan la hora y la duración escritas a mano
export const validateNewPlan = (values: NewPlanValues): NewPlanErrors => ({
  title: validateTitle(values.title),
  category: values.category ? undefined : "Elige una categoría",
  description:
    values.description.trim().length > DESCRIPTION_MAX
      ? `Máximo ${DESCRIPTION_MAX} caracteres`
      : undefined,
  startTime: validateStartTime(values.startTime),
  durationMinutes: validateDurationMinutes(values.durationMinutes),
  locationName: validateLocationName(values.locationName),
  location: values.location ? undefined : "Elige un lugar en el mapa",
});
