import { IonIcon } from "@ionic/react";
import { locationOutline, timeOutline } from "ionicons/icons";
import {
  formatDistance,
  formatPlanSchedule,
  formatTimeUntil,
  toMillis,
} from "@/shared/helpers/plan.helper";
import type { PlanStatus } from "@/shared/helpers/constants";
import type { PlanDoc } from "@/shared/types/plan.types";

interface Props {
  plan: PlanDoc;
  status: PlanStatus;
  distanceKm: number | null;
  now: number;
}

export const PlanInfoRows = ({ plan, status, distanceKm, now }: Props) => {
  const isOver = status === "terminado" || status === "cancelado";
  //? Se mira la hora y no el estado: un plan "Lleno" puede no haber empezado todavía
  const started = now >= toMillis(plan.startAt);
  const subtitle = isOver
    ? null
    : started
      ? "En curso"
      : formatTimeUntil(plan.startAt, now);

  const place =
    distanceKm !== null
      ? `${plan.location.label} · ${formatDistance(distanceKm)}`
      : plan.location.label;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <IonIcon icon={timeOutline} className="text-muted size-6 shrink-0" />
        <div className="flex flex-col">
          <span className="text-body-lg text-ink">
            {formatPlanSchedule(plan.startAt, plan.expiresAt, now)}
          </span>
          {subtitle && <span className="text-body text-muted">{subtitle}</span>}
        </div>
      </div>

      <div className="flex gap-3">
        <IonIcon
          icon={locationOutline}
          className="text-muted size-6 shrink-0"
        />
        <span className="text-body-lg text-ink">{place}</span>
      </div>
    </div>
  );
};
