import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IonProgressBar } from "@ionic/react";

import { PlanMapCard } from "@/features/plans/components/PlanMapCard";
import { PlansMap } from "@/features/plans/components/PlansMap";
import {
  DEFAULT_MAP_CENTER,
  NEARBY_RADIUS_KM,
} from "@/features/plans/constants";
import { usePlans } from "@/features/plans/hooks/usePlans";
import { CategoryChip } from "@/shared/components/CategoryChip";
import { DashboardLayout } from "@/shared/components/DashboardLayout";
import { CATEGORIES, CATEGORY_ALL } from "@/shared/helpers/constants";
import { distanceKm, getPlanStatus } from "@/shared/helpers/plan.helper";
import { useCurrentLocation } from "@/shared/hooks/useCurrentLocation";
import { useNow } from "@/shared/hooks/useNow";
import type { Coordinates } from "@/shared/types/plan.types";
import { ROUTES } from "@/router/routes";

const FILTER_CHIPS = [CATEGORY_ALL, ...CATEGORIES];

//? Sin permiso de ubicación se mide el radio desde el centro por defecto (UAO)
const DEFAULT_ORIGIN: Coordinates = {
  lat: DEFAULT_MAP_CENTER[0],
  lng: DEFAULT_MAP_CENTER[1],
};

const MapPage = () => {
  const navigate = useNavigate();
  //? category vive en el context para que Explorar y Mapa compartan el mismo filtro
  const { plans, counts, category, setCategory } = usePlans();
  const { getCurrentLocation } = useCurrentLocation();
  const now = useNow();

  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  //? El centro de Leaflet no es reactivo: el mapa se monta cuando ya se sabe si hay ubicación
  const [locating, setLocating] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation()
      .then(setUserLocation)
      .finally(() => setLocating(false));
  }, [getCurrentLocation]);

  const origin = userLocation ?? DEFAULT_ORIGIN;

  //? Planes vigentes, de la categoría elegida y a máximo NEARBY_RADIUS_KM del origen
  const visiblePlans = useMemo(
    () =>
      plans
        .map((plan) => ({ plan, km: distanceKm(origin, plan.location) }))
        .filter(({ plan, km }) => {
          const status = getPlanStatus(plan, counts[plan.id] ?? 0, now);
          return (
            status !== "terminado" &&
            status !== "cancelado" &&
            (category === CATEGORY_ALL.id || plan.category === category) &&
            km <= NEARBY_RADIUS_KM
          );
        }),
    [plans, counts, now, category, origin],
  );

  //? Si el plan seleccionado deja de ser visible (terminó, se canceló o cambió el filtro), la tarjeta se cierra sola
  const selected = visiblePlans.find(({ plan }) => plan.id === selectedId);

  return (
    <DashboardLayout title="Mapa" scrollY={false}>
      <div className="relative h-full">
        {locating ? (
          <IonProgressBar type="indeterminate" />
        ) : (
          <PlansMap
            center={
              userLocation
                ? [userLocation.lat, userLocation.lng]
                : DEFAULT_MAP_CENTER
            }
            zoom={userLocation ? 15 : 13}
            userLocation={userLocation}
            plans={visiblePlans.map(({ plan }) => plan)}
            selectedId={selected?.plan.id ?? null}
            onSelect={setSelectedId}
          />
        )}

        {/* Flotan sobre el mapa. El mapa lleva `isolate`, así que z-10 queda por encima */}
        <div className="absolute inset-x-0 top-0 z-10 flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
          {FILTER_CHIPS.map((chip) => (
            <CategoryChip
              key={chip.id}
              category={chip}
              selected={category === chip.id}
              onClick={() => setCategory(chip.id)}
            />
          ))}
        </div>

        {selected && (
          <div className="absolute inset-x-4 bottom-4 z-10">
            <PlanMapCard
              plan={selected.plan}
              count={counts[selected.plan.id] ?? 0}
              distanceKm={selected.km}
              onViewPlan={() => navigate(ROUTES.plan(selected.plan.id))}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MapPage;
