import { IonButton, IonIcon } from "@ionic/react";
import { chatbubbleOutline } from "ionicons/icons";

import { PlanCard } from "@/shared/components/PlanCard";
import type { MyPlan } from "../types/plans.types";

interface Props {
  plan: MyPlan;
  count: number;
  onOpen: () => void;
  onChat: () => void;
}

//? PlanCard + etiqueta "Organizador" + botón de chat a la derecha
export const MyPlanCard = ({ plan, count, onOpen, onChat }: Props) => (
  <div className="flex flex-col gap-1.5">
    {plan.isCreator && (
      <span className="text-caption bg-primary/12 text-primary self-start rounded-full px-2 py-0.5 whitespace-nowrap">
        Organizador
      </span>
    )}

    <div className="flex items-center gap-1">
      <div className="min-w-0 flex-1">
        <PlanCard
          plan={plan}
          count={count}
          distanceKm={plan.distanceKm}
          onClick={onOpen}
        />
      </div>

      {/* Sin chat se deja el hueco para que todas las tarjetas tengan el mismo ancho */}
      {plan.canOpenChat ? (
        <IonButton
          fill="clear"
          aria-label="Ir al chat"
          className="m-0 size-11 shrink-0 [--padding-end:0] [--padding-start:0]"
          onClick={(event) => {
            event.stopPropagation();
            onChat();
          }}
        >
          <IonIcon slot="icon-only" icon={chatbubbleOutline} />
        </IonButton>
      ) : (
        <div aria-hidden="true" className="size-11 shrink-0" />
      )}
    </div>
  </div>
);
