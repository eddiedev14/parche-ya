import { IonItem, IonLabel, IonList, IonProgressBar } from "@ionic/react";
import { Avatar } from "@/shared/components/Avatar";
import type { PlanParticipant } from "@/shared/types/plan.types";

interface Props {
  count: number;
  capacity: number;
  isFull: boolean;
  creatorId: string;
  participants: PlanParticipant[];
}

export const PlanParticipants = ({
  count,
  capacity,
  isFull,
  creatorId,
  participants,
}: Props) => (
  <section className="flex flex-col gap-2">
    <h2 className="font-heading text-h4 text-ink">
      Cupos {count}/{capacity}
    </h2>
    {/* Mismo estilo que la barra de PlanCard */}
    <IonProgressBar
      value={Math.min(count / capacity, 1)}
      color={isFull ? "secondary" : "primary"}
      className="h-1.5 rounded-full"
    />

    <IonList className="rounded-card mt-2 overflow-hidden py-0">
      {participants.map((participant) => (
        <IonItem key={participant.id} lines="none">
          <div slot="start">
            <Avatar
              url={participant.photoURL}
              name={participant.name}
              size={32}
            />
          </div>
          <IonLabel className="text-body text-ink">{participant.name}</IonLabel>
          {participant.id === creatorId && (
            <span slot="end" className="text-caption text-muted">
              Organizador
            </span>
          )}
        </IonItem>
      ))}
    </IonList>
  </section>
);
