import { IonCard, IonIcon, IonProgressBar } from "@ionic/react";
import { locationOutline, timeOutline } from "ionicons/icons";

import { getCategory } from "../helpers/constants";
import {
  formatDistance,
  formatPlanWhen,
  getPlanStatus,
} from "../helpers/plan.helper";
import type { PlanDoc } from "../types/plan.types";
import { Avatar } from "./Avatar";
import { StatusBadge } from "./StatusBadge";

interface Props {
  plan: PlanDoc;
  //? Cupos ocupados, en vivo desde Realtime Database (planRooms/{planId}/count)
  count: number;
  distanceKm?: number | null;
  onClick?: () => void;
}

//? A partir de cuántos cupos libres se avisa "Quedan N"
const FEW_SPOTS_LEFT = 2;

export const PlanCard = ({ plan, count, distanceKm, onClick }: Props) => {
  const category = getCategory(plan.category);
  const status = getPlanStatus(plan, count);
  const isOver = status === "terminado" || status === "cancelado";
  const spotsLeft = plan.capacity - count;
  const showFewSpots = !isOver && spotsLeft > 0 && spotsLeft <= FEW_SPOTS_LEFT;

  const when = status === "en_curso" ? "Ahora" : formatPlanWhen(plan.startAt);
  const place =
    distanceKm != null
      ? `${plan.location.label} · ${formatDistance(distanceKm)}`
      : plan.location.label;

  return (
    <IonCard
      button
      onClick={onClick}
      className="rounded-card border-line m-0 border shadow-sm"
    >
      <div className="flex gap-3 p-4 text-left">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${category.color}1F` }}
        >
          <IonIcon
            icon={category.icon}
            className="size-6"
            style={{ color: category.color }}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
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
            <span className="truncate">{place}</span>
          </p>

          <div className="mt-1 flex items-center gap-3">
            <span className="text-caption text-ink">
              {count}/{plan.capacity}
            </span>
            <IonProgressBar
              value={Math.min(count / plan.capacity, 1)}
              color={status === "lleno" ? "secondary" : "primary"}
              className="h-1.5 flex-1 rounded-full"
            />
            {showFewSpots && (
              <span className="text-caption bg-accent text-ink rounded-full px-2 py-0.5 whitespace-nowrap">
                Quedan {spotsLeft}
              </span>
            )}
            <Avatar
              url={plan.creatorPhotoUrl}
              name={plan.creatorName ?? "?"}
              size={24}
            />
          </div>
        </div>
      </div>
    </IonCard>
  );
};
