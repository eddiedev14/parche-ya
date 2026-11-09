import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth";
import { Toast } from "@/shared/classes/Toast.class";
import { useCollection } from "@/shared/firebase/hooks/useCollection";
import { useRTValue } from "@/shared/firebase/hooks/useRTDatabase";
import { distanceKm, getPlanStatus } from "@/shared/helpers/plan.helper";
import { useNow } from "@/shared/hooks/useNow";
import { usePlans } from "./usePlans";
import type { Plan, PlanDoc, PlanRoom } from "@/shared/types/plan.types";

//? Datos del detalle: el plan (Firestore) y su sala (RTDB), los dos en vivo
export const usePlanDetail = (planId: string) => {
  const { user } = useAuth();
  //? El PlansProvider envuelve toda la app, así que la ubicación ya está pedida
  const { userPosition } = usePlans();
  const { suscribeById, update } = useCollection<Plan>("plans");
  const { value: room, isPending: roomLoading } = useRTValue<PlanRoom>(
    `planRooms/${planId}`,
  );

  //? undefined = cargando, null = el plan no existe
  const [plan, setPlan] = useState<PlanDoc | null | undefined>(undefined);
  //? Cada 30 s, para que el estado pase solo a "En curso" o "Terminado" con la pantalla abierta
  const now = useNow(30_000);

  //* Plan en vivo: si el organizador lo cancela se ve al instante
  useEffect(() => {
    setPlan(undefined);
    return suscribeById(planId, setPlan);
  }, [planId, suscribeById]);

  //? RTDB guarda los arrays como objetos { 0: …, 1: … } y si quedan huecos los devuelve como objeto.
  //? Object.values sirve en los dos casos y siempre deja un array
  const participants = Object.values(room?.participants ?? {});
  const count = room?.count ?? 0;

  const isCreator = !!plan && plan.creatorId === user?.id;
  const isJoined = participants.some(
    (participant) => participant.id === user?.id,
  );
  const status = plan ? getPlanStatus(plan, count, now) : null;
  const distance =
    plan && userPosition ? distanceKm(userPosition, plan.location) : null;

  //? Solo se guarda "cancelled"; la sala y el chat se dejan para el historial
  const cancelPlan = useCallback(async () => {
    const cancelled = await update(planId, { status: "cancelled" });
    if (!cancelled) {
      Toast.error("No pudimos cancelar el plan. Inténtalo de nuevo.");
    }
  }, [planId, update]);

  return {
    plan,
    loading: plan === undefined || roomLoading,
    notFound: plan === null,
    participants,
    count,
    isCreator,
    isJoined,
    status,
    distanceKm: distance,
    now,
    cancelPlan,
  };
};
