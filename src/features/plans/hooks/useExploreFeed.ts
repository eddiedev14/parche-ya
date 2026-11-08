import { useMemo } from "react";
import { CATEGORY_ALL } from "@/shared/helpers/constants";
import { usePlans } from "./usePlans";

//? Aplica los filtros de Explorar sobre los planes vigentes del context
export const useExploreFeed = () => {
  const { activePlans, category, radiusKm } = usePlans();

  const visiblePlans = useMemo(
    () =>
      activePlans.filter((plan) => {
        const matchesCategory =
          category === CATEGORY_ALL.id || plan.category === category;
        //? Sin ubicación no sabemos la distancia, así que el radio no se aplica
        const insideRadius =
          radiusKm === null ||
          plan.distanceKm === null ||
          plan.distanceKm <= radiusKm;
        return matchesCategory && insideRadius;
      }),
    [activePlans, category, radiusKm],
  );

  return {
    visiblePlans,
    //? Vacío de verdad: no hay ningún plan activo, sin contar filtros
    isEmpty: activePlans.length === 0,
    isEmptyByFilters: activePlans.length > 0 && visiblePlans.length === 0,
  };
};
