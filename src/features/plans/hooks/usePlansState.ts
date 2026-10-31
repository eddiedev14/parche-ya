import { useCollection } from "@/shared/firebase/hooks/useCollection";
import { Plan } from "@/shared/types/plan.types";

export const usePlansState = () => {
  const { results: plans, isPending, add } = useCollection<Plan>("/plans");

  const createPlan = async (plan: Plan) => {
    const planId = await add(plan);
    if (!planId) return "Error creando un nuevo plan";
  };

  return {
    plans,
    isPending,
    createPlan,
  };
};
