import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cloudOfflineOutline, sparklesOutline } from "ionicons/icons";

import {
  CategoryFilterBar,
  LocationBanner,
  NewPlanFab,
  NewPlanModal,
  RadiusSelector,
  useExploreFeed,
  usePlans,
} from "@/features/plans";
import { DashboardLayout } from "@/shared/components/DashboardLayout";
import { EmptyState } from "@/shared/components/EmptyState";
import { PlanCard } from "@/shared/components/PlanCard";
import { PlanCardSkeleton } from "@/shared/components/PlanCardSkeleton";
import { ROUTES } from "@/router/routes";

const SKELETONS = [1, 2, 3];

const ExplorePage = () => {
  const navigate = useNavigate();
  const {
    counts,
    plansLoading,
    plansError,
    retry,
    locationDenied,
    requestLocation,
    category,
    setCategory,
    radiusKm,
    setRadiusKm,
    clearFilters,
  } = usePlans();
  const { visiblePlans, isEmpty, isEmptyByFilters } = useExploreFeed();
  //? El "Crear un plan" del estado vacío abre el mismo modal que el FAB
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);

  //* Qué se muestra debajo de los filtros
  const renderFeed = () => {
    if (plansError) {
      return (
        <EmptyState
          icon={cloudOfflineOutline}
          title="No pudimos cargar los planes"
          actionLabel="Reintentar"
          onAction={retry}
        />
      );
    }

    if (plansLoading) {
      return SKELETONS.map((key) => <PlanCardSkeleton key={key} />);
    }

    if (isEmpty) {
      return (
        <EmptyState
          icon={sparklesOutline}
          title="No hay planes por aquí"
          text="Sé el primero en armar uno"
          actionLabel="Crear un plan"
          onAction={() => setIsNewPlanOpen(true)}
        />
      );
    }

    if (isEmptyByFilters) {
      return (
        <EmptyState
          icon={sparklesOutline}
          title="Ningún plan coincide con tus filtros"
          actionLabel="Quitar filtros"
          onAction={clearFilters}
        />
      );
    }

    return visiblePlans.map((plan) => (
      <PlanCard
        key={plan.id}
        plan={plan}
        count={counts[plan.id] ?? 0}
        distanceKm={plan.distanceKm}
        onClick={() => navigate(ROUTES.plan(plan.id))}
      />
    ));
  };

  return (
    <DashboardLayout title="Explorar">
      {/* pb-24: espacio para que el FAB no tape la última tarjeta */}
      <div className="flex flex-col gap-3 px-4 pt-4 pb-24">
        <CategoryFilterBar selected={category} onChange={setCategory} />
        <RadiusSelector radiusKm={radiusKm} onChange={setRadiusKm} />
        {locationDenied && <LocationBanner onActivate={requestLocation} />}
        {renderFeed()}
      </div>

      <NewPlanFab />
      <NewPlanModal
        isOpen={isNewPlanOpen}
        onClose={() => setIsNewPlanOpen(false)}
      />
    </DashboardLayout>
  );
};

export default ExplorePage;
