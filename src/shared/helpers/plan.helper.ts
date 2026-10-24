import type { Plan, PlanDate } from "../types/plan.types";
import type { PlanStatus } from "./constants";

const MINUTE = 60_000;

const timeFormatter = new Intl.DateTimeFormat("es-CO", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
});

const startOfDay = (ms: number) => new Date(ms).setHours(0, 0, 0, 0);

export const toMillis = (date: PlanDate): number => {
  if (typeof date === "number") return date;
  if (date instanceof Date) return date.getTime();
  return date.toMillis();
};

//? "cancelled" es lo único que se guarda; el resto depende de la hora y de los cupos
export const getPlanStatus = (
  plan: Pick<Plan, "status" | "startAt" | "expiresAt" | "capacity">,
  count: number,
  now = Date.now(),
): PlanStatus => {
  if (plan.status === "cancelled") return "cancelado";
  if (now >= toMillis(plan.expiresAt)) return "terminado";
  if (count >= plan.capacity) return "lleno";
  if (now >= toMillis(plan.startAt)) return "en_curso";
  return "por_empezar";
};

//? Devuelve "En 25 min", "Hoy 6:30 p. m.", "Mañana 6:30 p. m." o "12 oct, 6:30 p. m."
export const formatPlanWhen = (startAt: PlanDate, now = Date.now()): string => {
  const start = toMillis(startAt);
  const diff = start - now;

  if (diff >= 0 && diff < 60 * MINUTE) {
    const minutes = Math.ceil(diff / MINUTE);
    return minutes <= 0 ? "Ahora" : `En ${minutes} min`;
  }

  const time = timeFormatter.format(start);
  const days = Math.round((startOfDay(start) - startOfDay(now)) / 86_400_000);

  if (days === 0) return `Hoy ${time}`;
  if (days === 1) return `Mañana ${time}`;
  return `${dateFormatter.format(start)}, ${time}`;
};

//? Devuelve "350 m" o "1,2 km"
export const formatDistance = (km: number): string => {
  if (km < 1) return `${Math.max(10, Math.round((km * 1000) / 10) * 10)} m`;
  return `${km >= 10 ? Math.round(km) : km.toFixed(1).replace(".", ",")} km`;
};
