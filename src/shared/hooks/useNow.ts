import { useEffect, useState } from "react";

//? Hora actual en ms que se refresca sola. Sirve para recalcular lo que depende de la hora (planes que terminan)
export const useNow = (intervalMs = 60_000) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
};
