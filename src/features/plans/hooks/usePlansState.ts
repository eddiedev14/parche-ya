import { useCollection } from "@/shared/firebase/hooks/useCollection";
import { useRTDatabase } from "@/shared/firebase/hooks/useRTDatabase";
import { Plan, PlanRoom } from "@/shared/types/plan.types";

export const usePlansState = () => {
  const { results: plans, isPending, add } = useCollection<Plan>("/plans");
  const { setById: setRoom } = useRTDatabase<PlanRoom>("planRooms");

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
    if (!roomCreated) return "El plan se creó, pero falló la sala en tiempo real";
  };

  return {
    plans,
    isPending,
    createPlan,
  };
};
