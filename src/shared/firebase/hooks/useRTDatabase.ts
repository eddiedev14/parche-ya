import { useCallback, useEffect, useState } from "react";
import {
  get,
  onValue,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
  type DatabaseReference,
} from "firebase/database";
import { rtdb } from "@/shared/firebase/config";
import type { RTDoc } from "@/shared/firebase/types/firestore.types";

//* Colección: el nodo contiene hijos con id, por ejemplo "chats/{planId}" -> { msg1: {...}, msg2: {...} }
export const useRTDatabase = <T>(node: string) => {
  //* States
  const [results, setResults] = useState<RTDoc<T>[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //* Helper para generar referencias a nodos
  // Si se pasa una id, se apunta a un nodo hijo específico, por ejemplo "chats/plan1/msg1"
  // Si no se pasa una id, se apunta al nodo completo, por ejemplo "chats/plan1"
  const getRef = useCallback(
    (id?: string): DatabaseReference =>
      id ? ref(rtdb, `${node}/${id}`) : ref(rtdb, node),
    [node],
  );

  //* Effects (onValue)
  useEffect(() => {
    // Si no hay nodo definido (por ejemplo, cuando el usuario aún no ha iniciado sesión) no se escucha nada
    if (!node) {
      setResults([]);
      return;
    }

    // Referencia al nodo general o principal, por ejemplo "chats/plan1"
    const nodeRef = getRef();

    const unsubscribe = onValue(nodeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convertir el objeto de datos en un array de documentos con id
        const docs: RTDoc<T>[] = Object.keys(data).map((key) => ({
          id: key,
          ...(data[key] as T),
        }));
        setResults(docs);
      } else {
        setResults([]);
      }
    });

    return () => unsubscribe(); // limpiar listener al desmontar
  }, [getRef, node]);

  //* 1. READ
  const getAll = async (): Promise<RTDoc<T>[]> => {
    setIsPending(true);
    setError(null);

    try {
      // ? Se obtiene la referencia del nodo principal, por ejemplo "chats/plan1"
      const nodeRef = getRef();
      const snapshot = await get(nodeRef);

      if (snapshot.exists()) {
        const data = snapshot.val();

        // Convertir el objeto de datos en un array de documentos con id
        const docs: RTDoc<T>[] = Object.keys(data).map((key) => ({
          id: key,
          ...(data[key] as T),
        }));

        setResults(docs);
        setIsPending(false);
        return docs;
      } else {
        setResults([]);
        setIsPending(false);
        return [];
      }
    } catch {
      setError(`Error al consultar los registros de ${node}`);
      setIsPending(false);
      return [];
    }
  };

  //* 1. READ
  const getById = async (id: string): Promise<RTDoc<T> | null> => {
    setIsPending(true);
    setError(null);

    try {
      // ? Se obtiene la referencia de ese nodo específico, por ejemplo "chats/plan1/msg1"
      const nodeRef = getRef(id);
      const snapshot = await get(nodeRef);

      if (snapshot.exists()) {
        const data = snapshot.val() as T;

        // Combinar el id con los datos para formar un documento completo
        const result: RTDoc<T> = {
          id,
          ...data,
        };

        setIsPending(false);
        return result;
      } else {
        setIsPending(false);
        return null; // No existe el nodo
      }
    } catch {
      setError(`Error al obtener el registro con id ${id} de ${node}`);
      setIsPending(false);
      return null;
    }
  };

  //* 2. CREATE
  const add = async (data: T): Promise<string | null> => {
    setIsPending(true);
    setError(null);

    try {
      // ? Se obtiene la referencia del nodo general, por ejemplo "chats/plan1"
      const nodeRef = getRef();

      // * Agregar un nuevo nodo con id automático
      const newRef = await push(nodeRef, {
        ...data,
        createdAt: serverTimestamp(),
      });

      setIsPending(false);
      return newRef.key; // Se retorna el id generado
    } catch {
      setError(`Error al agregar un nuevo registro en ${node}`);
      setIsPending(false);
      return null;
    }
  };

  //* 2. CREATE (con set)
  const setById = async (id: string, data: T): Promise<boolean> => {
    setIsPending(true);
    setError(null);

    try {
      // ? Se obtiene la referencia de ese nodo específico, por ejemplo "planRooms/plan1" (así no exista, se crea)
      const nodeRef = getRef(id);
      await set(nodeRef, {
        ...data,
        createdAt: serverTimestamp(),
      });
      setIsPending(false);
      return true;
    } catch {
      setError(`Error al guardar el nodo ${node} con id ${id}`);
      setIsPending(false);
      return false;
    }
  };

  //* 3. UPDATE
  // ? En este caso se implementa con update, pues se actualiza solo los campos indicados, sin afectar el resto del nodo
  // ? Set, en cambio, reemplazaría todo el nodo, por lo que se perderían los campos no incluidos en la actualización
  const updateNode = async (id: string, data: Partial<T>) => {
    setIsPending(true);
    setError(null);

    try {
      // ? Se obtiene la referencia de ese nodo específico, por ejemplo "planRooms/plan1"
      const nodeRef = getRef(id);

      // Actualizar solo los campos indicados
      await update(nodeRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      setIsPending(false);
      return true;
    } catch {
      setIsPending(false);
      setError(`Error al actualizar el registro con id ${id} en ${node}`);
      return false;
    }
  };

  //* 4. DELETE
  const removeNode = async (id: string) => {
    setIsPending(true);
    setError(null);

    try {
      // ? Se obtiene la referencia de ese nodo específico, por ejemplo "chats/plan1/msg1"
      const nodeRef = getRef(id);

      // Eliminar el nodo
      await remove(nodeRef);

      setIsPending(false);
      return true;
    } catch {
      setError(`Error al eliminar el registro con id ${id} de ${node}`);
      setIsPending(false);
      return false;
    }
  };

  return {
    results,
    isPending,
    error,

    getRef,
    getAll,
    getById,
    add,
    setById,
    updateNode,
    removeNode,
  };
};

//* Valor único: escucha un nodo que NO es una colección, por ejemplo "planRooms/plan1/count" (número) o "planRooms/plan1" (objeto)
export const useRTValue = <T>(path: string) => {
  //* States
  const [value, setValue] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(true);

  //* Effects (onValue)
  useEffect(() => {
    // Si no hay ruta definida no se escucha nada
    if (!path) {
      setValue(null);
      setIsPending(false);
      return;
    }

    setIsPending(true);

    const unsubscribe = onValue(
      ref(rtdb, path),
      (snapshot) => {
        setValue(snapshot.exists() ? (snapshot.val() as T) : null);
        setIsPending(false);
      },
      () => {
        setIsPending(false);
      },
    );

    return () => unsubscribe(); // limpiar listener al desmontar
  }, [path]);

  return { value, isPending };
};
