import { useCallback, useEffect, useMemo, useState } from "react";
import { where } from "firebase/firestore";
import { get, limitToFirst, query, ref } from "firebase/database";
import { useAuth } from "@/features/auth";
import { rtdb } from "@/shared/firebase/config";
import { useCollection } from "@/shared/firebase/hooks/useCollection";
import { useRTValue } from "@/shared/firebase/hooks/useRTDatabase";
import { distanceKm, toMillis } from "@/shared/helpers/plan.helper";
import { useNow } from "@/shared/hooks/useNow";
import { MY_PLANS_HISTORY_LIMIT, MY_PLANS_PAGE_SIZE } from "../constants";
import { usePlans } from "./usePlans";
import type { Plan, PlanDoc } from "@/shared/types/plan.types";
import type { MyPlan, MyPlansSegment } from "../types/plans.types";

//? Planes a los que me uní (ids en userPlans/{uid}) y los que organicé (creatorId en Firestore).
//? Se buscan por separado porque al crear un plan no se escribe userPlans para el organizador
export const useMyPlans = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const { counts, userPosition } = usePlans();

  const {
    value: joinedNode,
    isPending: joinedIdsLoading,
    error: joinedIdsError,
    retry: retryJoinedIds,
  } = useRTValue<Record<string, boolean>>(
    userId ? `userPlans/${userId}` : "",
  );
  const {
    results: createdPlans,
    isPending: createdLoading,
    error: createdError,
    suscribe,
  } = useCollection<Plan>("plans");
  //? Instancia aparte: suscribeById también mueve isPending y pisaría el de la consulta de arriba
  const { suscribeById } = useCollection<Plan>("plans");

  const [retryKey, setRetryKey] = useState(0);
  const retry = useCallback(() => {
    retryJoinedIds();
    setRetryKey((key) => key + 1);
  }, [retryJoinedIds]);

  //* Planes que organicé, en vivo
  useEffect(() => {
    if (!userId) return;
    return suscribe([where("creatorId", "==", userId)]);
  }, [userId, suscribe, retryKey]);

  //* Planes a los que me uní, uno por id y en vivo (si lo cancelan se ve al instante)
  const joinedIds = useMemo(() => Object.keys(joinedNode ?? {}), [joinedNode]);
  //? undefined = cargando, null = no existe en Firestore (se ignora)
  const [joinedPlans, setJoinedPlans] = useState<
    Record<string, PlanDoc | null | undefined>
  >({});
  const [joinedError, setJoinedError] = useState(false);

  useEffect(() => {
    setJoinedError(false);
    const unsubscribes = joinedIds.map((id) =>
      suscribeById(
        id,
        (plan) => setJoinedPlans((prev) => ({ ...prev, [id]: plan })),
        () => setJoinedError(true),
      ),
    );
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [joinedIds, suscribeById, retryKey]);

  //* Separación en activos e historial
  //? now se refresca cada minuto para pasar al historial los que van venciendo
  const now = useNow();
  const { activePlans, historyPlans } = useMemo(() => {
    //? Un Map por id para no repetir un plan que llegue por las dos fuentes
    const byId = new Map<string, PlanDoc>();
    createdPlans.forEach((plan) => byId.set(plan.id, plan));
    joinedIds.forEach((id) => {
      const plan = joinedPlans[id];
      if (plan) byId.set(id, plan);
    });

    const plans = [...byId.values()].map((plan) => ({
      ...plan,
      distanceKm: userPosition
        ? distanceKm(userPosition, plan.location)
        : null,
      isCreator: plan.creatorId === userId,
    }));

    const isActive = (plan: PlanDoc) =>
      plan.status === "active" && toMillis(plan.expiresAt) > now;

    return {
      activePlans: plans
        .filter(isActive)
        .sort((a, b) => toMillis(a.startAt) - toMillis(b.startAt)),
      historyPlans: plans
        .filter((plan) => !isActive(plan))
        .sort((a, b) => toMillis(b.startAt) - toMillis(a.startAt))
        .slice(0, MY_PLANS_HISTORY_LIMIT),
    };
  }, [createdPlans, joinedIds, joinedPlans, userPosition, userId, now]);

  //* Chats del historial: basta con saber si hay al menos un mensaje
  //? Se usa la lista de ids como llave para no volver a leer cada vez que cambia now
  const historyKey = historyPlans.map((plan) => plan.id).join(",");
  const [plansWithChat, setPlansWithChat] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (!historyKey) return;
    let isCurrent = true;

    Promise.all(
      historyKey.split(",").map(async (id) => {
        try {
          const snapshot = await get(
            query(ref(rtdb, `chats/${id}`), limitToFirst(1)),
          );
          return [id, snapshot.exists()] as const;
        } catch {
          return [id, false] as const;
        }
      }),
    ).then((entries) => {
      if (isCurrent) setPlansWithChat(Object.fromEntries(entries));
    });

    return () => {
      isCurrent = false;
    };
  }, [historyKey]);

  //* Segmento y paginación
  const [segment, setSegment] = useState<MyPlansSegment>("active");
  const [page, setPage] = useState(1);

  const changeSegment = useCallback((value: MyPlansSegment) => {
    setSegment(value);
    setPage(1);
  }, []);
  const loadMore = useCallback(() => setPage((prev) => prev + 1), []);

  const segmentPlans = segment === "active" ? activePlans : historyPlans;
  const visiblePlans: MyPlan[] = segmentPlans
    .slice(0, page * MY_PLANS_PAGE_SIZE)
    .map((plan) => ({
      ...plan,
      canOpenChat: segment === "active" || !!plansWithChat[plan.id],
    }));

  return {
    segment,
    changeSegment,
    visiblePlans,
    counts,
    isEmpty: segmentPlans.length === 0,
    hasMore: visiblePlans.length < segmentPlans.length,
    loadMore,
    loading:
      joinedIdsLoading ||
      createdLoading ||
      joinedIds.some((id) => joinedPlans[id] === undefined),
    error: !!joinedIdsError || !!createdError || joinedError,
    retry,
  };
};
