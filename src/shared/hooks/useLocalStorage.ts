import { useEffect, useState } from "react";

//? Igual que useState, pero el valor se guarda en localStorage y sobrevive a cerrar la app
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      //? Si el JSON está dañado o no hay acceso al almacenamiento, se arranca con el valor inicial
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      //? Sin almacenamiento disponible el valor sigue funcionando, solo que no se recuerda
    }
  }, [key, value]);

  return [value, setValue] as const;
};
