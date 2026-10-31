import type { CategoryId } from "@/shared/helpers/constants";
import type { FormErrors } from "@/shared/hooks/useForm";
import {
  CAPACITY,
  DESCRIPTION_MAX,
  LOCATION_NAME_LIMITS,
  TITLE_LIMITS,
} from "@/features/plans/constants";

export interface NewPlanValues {
  title: string;
  category: CategoryId | "";
  description: string;
  startInMinutes: number;
  durationHours: number;
  capacity: number;
  //? Nombre escrito del lugar. Las coordenadas del mapa se agregan aparte
  locationName: string;
}

export type NewPlanErrors = FormErrors<NewPlanValues>;

export const EMPTY_NEW_PLAN: NewPlanValues = {
  title: "",
  category: "",
  description: "",
  startInMinutes: 30,
  durationHours: 1,
  capacity: CAPACITY.initial,
  locationName: "",
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

//? Inicio, duración y cupos no se validan: los segmentos y los botones − / + no permiten salir de sus opciones
export const validateNewPlan = (values: NewPlanValues): NewPlanErrors => ({
  title: validateTitle(values.title),
  category: values.category ? undefined : "Elige una categoría",
  description:
    values.description.trim().length > DESCRIPTION_MAX
      ? `Máximo ${DESCRIPTION_MAX} caracteres`
      : undefined,
  locationName: validateLocationName(values.locationName),
});
