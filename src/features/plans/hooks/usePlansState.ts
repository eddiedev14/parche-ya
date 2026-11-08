import { useCallback, useEffect, useMemo, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { Timestamp, where } from "firebase/firestore";
import { useAuth } from "@/features/auth";
import { useCollection } from "@/shared/firebase/hooks/useCollection";
import { useRTDatabase } from "@/shared/firebase/hooks/useRTDatabase";
import { Toast } from "@/shared/classes/Toast.class";
import { distanceKm, toMillis } from "@/shared/helpers/plan.helper";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { useNow } from "@/shared/hooks/useNow";
import { DEFAULT_FILTERS, FILTERS_STORAGE_KEY } from "../constants";
import type { Coordinates, Plan, PlanRoom } from "@/shared/types/plan.types";
import type {
  CategoryFilter,
  PlanFilters,
  PlanWithDistance,
  RadiusKm,
} from "../types/plans.types";

export const usePlansState = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const {
    results: plans,
    isPending,
    error: plansError,
    add,
    suscribe,
  } = useCollection<Plan>("/plans");
  //? Sin sesión el nodo va vacío y el hook no escucha nada (las reglas rechazarían el listener y no se reintenta al iniciar sesión)
  const { results: rooms, setById: setRoom } = useRTDatabase<PlanRoom>(
    userId ? "planRooms" : "",
  );

  //? Cambiarlo vuelve a correr el efecto de la suscripción (botón "Reintentar")
  const [retryKey, setRetryKey] = useState(0);
  const retry = useCallback(() => setRetryKey((key) => key + 1), []);

  //* Planes en vivo (Firestore), solo con sesión iniciada
  useEffect(() => {
    if (!userId) return;
    //? Un solo where para no necesitar índice compuesto; el status se filtra abajo en el cliente
    return suscribe([where("expiresAt", ">", Timestamp.now())]);
  }, [userId, suscribe, retryKey]);

  //? Cupos ocupados por plan, en vivo desde planRooms/{planId}/count
  const counts = useMemo(
    () => Object.fromEntries(rooms.map((room) => [room.id, room.count ?? 0])),
    [rooms],
  );

  //* Ubicación del usuario
  const [userPosition, setUserPosition] = useState<Coordinates | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  //? Devuelve false si no hay permiso o el GPS está apagado (para el banner da igual cuál de los dos fue)
  const locate = useCallback(async (): Promise<boolean> => {
    try {
      const { coords } = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      setUserPosition({ lat: coords.latitude, lng: coords.longitude });
      setLocationDenied(false);
      return true;
    } catch {
      setLocationDenied(true);
      return false;
    }
  }, []);

  //? Se pide al entrar con sesión, no en la bienvenida
  useEffect(() => {
    if (!userId) return;
    locate();
  }, [userId, locate]);

  //? Botón "Activar": si el sistema ya no muestra el diálogo, toca ir a los ajustes
  const requestLocation = useCallback(async () => {
    const located = await locate();
    if (!located) {
      Toast.info(
        "Activa la ubicación de ParcheYa en los ajustes de tu celular",
      );
    }
  }, [locate]);

  //* Filtros recordados entre sesiones (compartidos con el Mapa)
  const [storedFilters, setFilters] = useLocalStorage<PlanFilters>(
    FILTERS_STORAGE_KEY,
    DEFAULT_FILTERS,
  );
  //? Por si lo guardado viene de una versión vieja y le falta algún campo
  const { category, radiusKm } = { ...DEFAULT_FILTERS, ...storedFilters };

  const setCategory = useCallback(
    (value: CategoryFilter) =>
      setFilters((prev) => ({ ...prev, category: value })),
    [setFilters],
  );
  const setRadiusKm = useCallback(
    (value: RadiusKm) => setFilters((prev) => ({ ...prev, radiusKm: value })),
    [setFilters],
  );
  //? "Quitar filtros": todas las categorías y sin límite de distancia
  const clearFilters = useCallback(
    () => setFilters({ category: "todos", radiusKm: null }),
    [setFilters],
  );

  //* Planes vigentes con su distancia, ordenados por hora de inicio
  //? now se refresca cada minuto para sacar los que ya vencieron
  const now = useNow();
  const activePlans = useMemo<PlanWithDistance[]>(
    () =>
      plans
        .filter(
          (plan) => plan.status === "active" && toMillis(plan.expiresAt) > now,
        )
        .map((plan) => ({
          ...plan,
          distanceKm: userPosition
            ? distanceKm(userPosition, plan.location)
            : null,
        }))
        .sort((a, b) => toMillis(a.startAt) - toMillis(b.startAt)),
    [plans, now, userPosition],
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
    activePlans,
    plansError,
    userPosition,
    locationDenied,
    radiusKm,
    category,
    plansLoading: isPending,
    retry,
    requestLocation,
    setCategory,
    createPlan,
    setRadiusKm,
    clearFilters,
  };
};
