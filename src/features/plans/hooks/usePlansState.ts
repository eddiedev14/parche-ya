import { useEffect, useMemo } from "react";
import { useAuth } from "@/features/auth";
import { useCollection } from "@/shared/firebase/hooks/useCollection";
import { useRTDatabase } from "@/shared/firebase/hooks/useRTDatabase";
import { Plan, PlanRoom } from "@/shared/types/plan.types";

export const usePlansState = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const {
    results: plans,
    isPending,
    add,
    suscribe,
  } = useCollection<Plan>("/plans");
  //? Sin sesión el nodo va vacío y el hook no escucha nada (las reglas rechazarían el listener y no se reintenta al iniciar sesión)
  const { results: rooms, setById: setRoom } = useRTDatabase<PlanRoom>(
    userId ? "planRooms" : "",
  );

  //* Planes en vivo (Firestore), solo con sesión iniciada
  useEffect(() => {
    if (!userId) return;
    return suscribe();
  }, [userId, suscribe]);

  //? Cupos ocupados por plan, en vivo desde planRooms/{planId}/count
  const counts = useMemo(
    () => Object.fromEntries(rooms.map((room) => [room.id, room.count ?? 0])),
    [rooms],
  );

  const createPlan = async (plan: Plan) => {
    const planId = await add(plan);
    if (!planId) return "Error creando un nuevo plan";

    //* La sala en RTDB comparte id con el plan de Firestore
    const roomCreated = await setRoom(planId, {
      capacity: plan.capacity,
      count: 1,
      creatorId: plan.creatorId,
      //? El organizador entra como primer participante; photoURL se omite si no hay porque RTDB rechaza undefined
      participants: [
        {
          id: plan.creatorId,
          name: plan.creatorName ?? "",
          ...(plan.creatorPhotoUrl && { photoURL: plan.creatorPhotoUrl }),
        },
      ],
    });

    // Si falla la sala, el plan de Firestore queda sin sala (sin rollback), borrarlo o reintentar cuando se implemente unirse
    if (!roomCreated)
      return "El plan se creó, pero falló la sala en tiempo real";
  };

  return {
    plans,
    counts,
    isPending,
    createPlan,
  };
};
