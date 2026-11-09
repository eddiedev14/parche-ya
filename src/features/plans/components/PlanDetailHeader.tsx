import { IonIcon } from "@ionic/react";
import { StatusBadge } from "@/shared/components/StatusBadge";
import {
  getCategory,
  type CategoryId,
  type PlanStatus,
} from "@/shared/helpers/constants";

interface Props {
  category: CategoryId;
  status: PlanStatus;
}

//? Bloque de color de la categoría al 12 % (1F en hex) con su ícono grande
export const PlanDetailHeader = ({ category, status }: Props) => {
  const { color, icon, name } = getCategory(category);

  return (
    <div
      className="rounded-card relative flex h-36 items-center justify-center"
      style={{ backgroundColor: `${color}1F` }}
    >
      <IonIcon
        icon={icon}
        aria-label={name}
        className="size-16"
        style={{ color }}
      />
      <div className="absolute top-3 right-3">
        <StatusBadge status={status} />
      </div>
    </div>
  );
};
