import { useState } from "react";
import { ref, remove, runTransaction, set } from "firebase/database";
import { useAuth } from "@/features/auth";
import { Toast } from "@/shared/classes/Toast.class";
import { rtdb } from "@/shared/firebase/config";
import type { PlanStatus } from "@/shared/helpers/constants";
import type { PlanParticipant, PlanRoom } from "@/shared/types/plan.types";

interface Params {
  planId: string;
  status: PlanStatus | null;
  isJoined: boolean;
  isCreator: boolean;
}

const JOIN_ERROR = "No pudimos unirte al plan. Inténtalo de nuevo.";
const LEAVE_ERROR = "No pudimos sacarte del plan. Inténtalo de nuevo.";

//? Unirse y salir de un plan. Se usa runTransaction porque lee y escribe la sala de una sola vez:
//? si dos personas tocan "Unirme" por el último cupo, Firebase repite la transacción de la segunda
//? con el valor nuevo y ahí ya ve que está lleno. Con un update normal las dos entrarían
export const usePlanMembership = ({
  planId,
  status,
  isJoined,
  isCreator,
}: Params) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const roomRef = ref(rtdb, `planRooms/${planId}`);

  const joinPlan = async () => {
    const canJoin = status === "por_empezar" || status === "en_curso";
    if (!user || !canJoin || isJoined) return;

    setLoading(true);
    //? Para saber si la transacción se abortó por falta de cupo o por otra cosa
    let isFull = false;

    try {
      const result = await runTransaction(roomRef, (room: PlanRoom | null) => {
        //? La pantalla ya escucha esta sala, así que si llega null es porque no existe
        if (!room) return;

        const participants = Object.values(room.participants ?? {});
        if (participants.some((participant) => participant.id === user.id)) {
          return room;
        }

        isFull = room.count >= room.capacity;
        if (isFull) return;

        //? RTDB rechaza undefined, por eso photoURL solo va si existe
        const me: PlanParticipant = {
          id: user.id,
          name: user.displayName,
          ...(user.photoUrl && { photoURL: user.photoUrl }),
        };

        return {
          ...room,
          count: room.count + 1,
          participants: [...participants, me],
        };
      });

      if (!result.committed) {
        Toast.error(
          isFull
            ? "El plan se llenó justo antes de que te unieras"
            : JOIN_ERROR,
        );
        return;
      }

      await set(ref(rtdb, `userPlans/${user.id}/${planId}`), true);
    } catch {
      Toast.error(JOIN_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const leavePlan = async () => {
    //? El organizador no sale de su plan, lo cancela
    if (!user || isCreator || !isJoined) return;

    setLoading(true);

    try {
      const result = await runTransaction(roomRef, (room: PlanRoom | null) => {
        if (!room) return;

        const participants = Object.values(room.participants ?? {});
        const rest = participants.filter(
          (participant) => participant.id !== user.id,
        );
        //? Si ya no estaba, no se toca nada (así count no baja dos veces)
        if (rest.length === participants.length) return room;

        return {
          ...room,
          count: Math.max(0, room.count - 1),
          participants: rest,
        };
      });

      if (!result.committed) {
        Toast.error(LEAVE_ERROR);
        return;
      }

      await remove(ref(rtdb, `userPlans/${user.id}/${planId}`));
    } catch {
      Toast.error(LEAVE_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return { loading, joinPlan, leavePlan };
};
