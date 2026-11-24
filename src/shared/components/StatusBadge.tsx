import type { CSSProperties } from "react";
import { IonBadge } from "@ionic/react";
import { PLAN_STATUSES, type PlanStatus } from "@/shared/helpers/constants";

interface Props {
  status: PlanStatus;
}

export const StatusBadge = ({ status }: Props) => {
  const { label, color } = PLAN_STATUSES[status];

  return (
    <IonBadge
      className="text-caption rounded-full px-2 py-0.5 whitespace-nowrap"
      style={
        {
          "--background": color,
          //? Sobre ámbar el texto es Tinta; sobre el resto, blanco
          "--color": status === "por_empezar" ? "#1F1B2E" : "#FFFFFF",
        } as CSSProperties
      }
    >
      {label}
    </IonBadge>
  );
};
