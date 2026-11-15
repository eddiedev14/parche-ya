import type { CategoryId } from "@/shared/helpers/constants";
import type { PlanDoc } from "@/shared/types/plan.types";

//? "todos" es la opción del chip "Todos", no una categoría de plan
export type CategoryFilter = "todos" | CategoryId;

//? null = "Sin límite"
export type RadiusKm = 1 | 3 | 5 | 10 | null;

export interface PlanFilters {
  category: CategoryFilter;
  radiusKm: RadiusKm;
}

//? null cuando no tenemos la ubicación del usuario
export type PlanWithDistance = PlanDoc & { distanceKm: number | null };
