import { IonButton, IonIcon } from "@ionic/react";
import { locationOutline, peopleOutline, timeOutline } from "ionicons/icons";
import { StatusBadge } from "@/shared/components/StatusBadge";
import {
  formatDistance,
  formatPlanWhen,
  getPlanStatus,
} from "@/shared/helpers/plan.helper";
import type { PlanDoc } from "@/shared/types/plan.types";

interface Props {
  plan: PlanDoc;
  //? Cupos ocupados, en vivo desde Realtime Database
  count: number;
  distanceKm: number;
  onViewPlan: () => void;
}

//? Versión compacta de PlanCard para el mapa: sin barra de progreso ni avatar
export const PlanMapCard = ({ plan, count, distanceKm, onViewPlan }: Props) => {
  const status = getPlanStatus(plan, count);
  const when = status === "en_curso" ? "Ahora" : formatPlanWhen(plan.startAt);

  return (
    <div className="rounded-card border-line flex flex-col gap-2 border bg-white p-4 shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-body-lg text-ink truncate font-semibold">
          {plan.title}
        </h3>
        <StatusBadge status={status} />
      </div>

      <p className="text-body text-muted flex items-center gap-1.5">
        <IonIcon icon={timeOutline} className="shrink-0" />
        <span className="truncate">{when}</span>
      </p>

      <p className="text-body text-muted flex items-center gap-1.5">
        <IonIcon icon={locationOutline} className="shrink-0" />
        <span className="truncate">
          {plan.location.label} · {formatDistance(distanceKm)}
        </span>
      </p>

      <div className="flex items-center justify-between gap-3">
        <span className="text-body text-ink flex items-center gap-1.5">
          <IonIcon icon={peopleOutline} className="shrink-0" />
          {count}/{plan.capacity} cupos
        </span>
        <IonButton size="small" className="m-0" onClick={onViewPlan}>
          Ver plan
        </IonButton>
      </div>
    </div>
  );
};
