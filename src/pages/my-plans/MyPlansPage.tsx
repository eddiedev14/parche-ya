import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import {
  calendarOutline,
  cloudOfflineOutline,
  timeOutline,
} from "ionicons/icons";

import {
  MyPlanCard,
  NewPlanFab,
  NewPlanModal,
  useMyPlans,
} from "@/features/plans";
import { DashboardLayout } from "@/shared/components/DashboardLayout";
import { EmptyState } from "@/shared/components/EmptyState";
import { PlanCardSkeleton } from "@/shared/components/PlanCardSkeleton";
import { ROUTES } from "@/router/routes";

const SKELETONS = [1, 2, 3];

const MyPlansPage = () => {
  const navigate = useNavigate();
  const {
    segment,
    changeSegment,
    visiblePlans,
    counts,
    isEmpty,
    hasMore,
    loadMore,
    loading,
    error,
    retry,
  } = useMyPlans();
  //? El "Crear un plan" del estado vacío abre el mismo modal que el FAB
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);

  //* Qué se muestra debajo del segmento
  const renderList = () => {
    if (error) {
      return (
        <EmptyState
          icon={cloudOfflineOutline}
          title="No pudimos cargar tus planes"
          actionLabel="Reintentar"
          onAction={retry}
        />
      );
    }

    if (loading) {
      return SKELETONS.map((key) => <PlanCardSkeleton key={key} />);
    }

    if (isEmpty && segment === "active") {
      return (
        <EmptyState
          icon={calendarOutline}
          title="Aún no tienes planes"
          text="Únete a uno o arma el tuyo"
          actionLabel="Crear un plan"
          onAction={() => setIsNewPlanOpen(true)}
        />
      );
    }

    if (isEmpty) {
      return (
        <EmptyState
          icon={timeOutline}
          title="Tu historial está vacío"
          text="Aquí verás los planes que ya terminaron"
        />
      );
    }

    return visiblePlans.map((plan) => (
      <MyPlanCard
        key={plan.id}
        plan={plan}
        count={counts[plan.id] ?? 0}
        onOpen={() => navigate(ROUTES.plan(plan.id))}
        onChat={() => navigate(ROUTES.planChat(plan.id))}
      />
    ));
  };

  return (
    <DashboardLayout title="Mis planes">
      {/* pb-24: espacio para que el FAB no tape la última tarjeta */}
      <div className="flex flex-col gap-3 px-4 pt-4 pb-24">
        <IonSegment
          value={segment}
          onIonChange={({ detail }) => {
            if (detail.value === "active" || detail.value === "history") {
              changeSegment(detail.value);
            }
          }}
        >
          <IonSegmentButton value="active" className="min-h-12">
            <IonLabel>Activos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="history" className="min-h-12">
            <IonLabel>Historial</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {renderList()}
      </div>

      <IonInfiniteScroll
        disabled={!hasMore}
        onIonInfinite={(event) => {
          loadMore();
          event.target.complete();
        }}
      >
        <IonInfiniteScrollContent />
      </IonInfiniteScroll>

      <NewPlanFab />
      <NewPlanModal
        isOpen={isNewPlanOpen}
        onClose={() => setIsNewPlanOpen(false)}
      />
    </DashboardLayout>
  );
};

export default MyPlansPage;
