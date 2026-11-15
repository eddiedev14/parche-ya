import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IonActionSheet,
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import {
  alertCircleOutline,
  arrowBackOutline,
  ellipsisVerticalOutline,
} from "ionicons/icons";

import {
  PlanActionButtons,
  PlanDetailHeader,
  PlanDetailSkeleton,
  PlanInfoRows,
  PlanMiniMap,
  PlanParticipants,
  usePlanDetail,
  usePlanMembership,
} from "@/features/plans";
import { Avatar } from "@/shared/components/Avatar";
import { EmptyState } from "@/shared/components/EmptyState";
import { ROUTES } from "@/router/routes";

const PlanDetailPage = () => {
  const { planId = "" } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  const {
    plan,
    loading,
    notFound,
    participants,
    count,
    isCreator,
    isJoined,
    status,
    distanceKm,
    now,
    cancelPlan,
  } = usePlanDetail(planId);
  const membership = usePlanMembership({
    planId,
    status,
    isJoined,
    isCreator,
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isOver = status === "terminado" || status === "cancelado";
  //? Ya no tiene sentido cancelar un plan que terminó o que ya se canceló
  const showMenu = isCreator && !isOver;

  const renderContent = () => {
    if (loading) return <PlanDetailSkeleton />;

    if (notFound || !plan || !status) {
      return (
        <EmptyState
          icon={alertCircleOutline}
          title="Este plan ya no existe"
          actionLabel="Volver a explorar"
          onAction={() => navigate(ROUTES.explore)}
        />
      );
    }

    return (
      <div className="flex flex-col gap-5">
        {status === "cancelado" && (
          <p
            role="alert"
            className="bg-danger/12 text-danger rounded-card text-body p-3 font-semibold"
          >
            Este plan fue cancelado
          </p>
        )}

        <PlanDetailHeader category={plan.category} status={status} />

        <h1 className="font-heading text-h1 text-ink">{plan.title}</h1>

        <div className="flex items-center gap-3">
          <Avatar
            url={plan.creatorPhotoUrl}
            name={plan.creatorName ?? ""}
            size={40}
          />
          <span className="text-body-lg text-ink">
            Organiza {plan.creatorName}
          </span>
        </div>

        <PlanInfoRows
          plan={plan}
          status={status}
          distanceKm={distanceKm}
          now={now}
        />

        {plan.description && (
          <p className="text-body-lg text-ink whitespace-pre-line">
            {plan.description}
          </p>
        )}

        <PlanMiniMap location={plan.location} category={plan.category} />

        <PlanParticipants
          count={count}
          capacity={plan.capacity}
          isFull={status === "lleno"}
          creatorId={plan.creatorId}
          participants={participants}
        />
      </div>
    );
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="[--background:transparent]">
          <IonButtons slot="start">
            <IonBackButton
              icon={arrowBackOutline}
              text=""
              defaultHref={ROUTES.explore}
            />
          </IonButtons>
          {showMenu && (
            <IonButtons slot="end">
              <IonButton
                aria-label="Opciones del plan"
                onClick={() => setMenuOpen(true)}
              >
                <IonIcon slot="icon-only" icon={ellipsisVerticalOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="px-4 pt-2 pb-6">{renderContent()}</div>
      </IonContent>

      {plan && status && !loading && (
        <IonFooter className="ion-no-border">
          <IonToolbar className="px-4 pt-2 pb-[max(16px,var(--ion-safe-area-bottom))]">
            <PlanActionButtons
              status={status}
              isJoined={isJoined}
              isCreator={isCreator}
              loading={membership.loading}
              onJoin={membership.joinPlan}
              onLeave={membership.leavePlan}
              onChat={() => navigate(ROUTES.planChat(planId))}
            />
          </IonToolbar>
        </IonFooter>
      )}

      <IonActionSheet
        isOpen={menuOpen}
        onDidDismiss={() => setMenuOpen(false)}
        buttons={[
          {
            text: "Cancelar plan",
            role: "destructive",
            handler: () => setConfirmOpen(true),
          },
          { text: "Cerrar", role: "cancel" },
        ]}
      />

      <IonAlert
        isOpen={confirmOpen}
        onDidDismiss={() => setConfirmOpen(false)}
        header="¿Seguro que quieres cancelar este plan?"
        buttons={[
          { text: "Cancelar", role: "cancel" },
          { text: "Cancelar plan", role: "destructive", handler: cancelPlan },
        ]}
      />
    </IonPage>
  );
};

export default PlanDetailPage;
