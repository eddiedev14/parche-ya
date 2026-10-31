import { useCallback, useState } from "react";
import { db } from "@/shared/firebase/config";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  getDocs,
} from "firebase/firestore";
import type {
  DocumentData,
  PartialWithFieldValue,
  Query,
  QueryConstraint,
  Unsubscribe,
  UpdateData,
} from "firebase/firestore";
import type { FirestoreDoc } from "@/shared/firebase/types/firestore.types";

export const useCollection = <T extends DocumentData>(table: string) => {
  const [results, setResults] = useState<FirestoreDoc<T>[]>([]);
  const [isPending, setIsPending] = useState(false);

  const buildQuery = useCallback(
    (constraints: QueryConstraint[] = []): Query => {
      return query(collection(db, table), ...constraints);
    },
    [table],
  );

  //* 1. R -> READ
  const suscribe = useCallback(
    (constraints: QueryConstraint[] = []): Unsubscribe => {
      setIsPending(true);

      try {
        // Se hace una busqueda sobre la colección indicada
        const q = buildQuery(constraints);

        // Firebase responde con un “paquete” de documentos
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const docs: FirestoreDoc<T>[] = snapshot.docs.map((d) => ({
              id: d.id,
              ...(d.data() as T),
            }));

            setResults(docs);
            setIsPending(false);
          },
          () => {
            setIsPending(false);
          },
        );

        return unsubscribe;
      } catch {
        setIsPending(false);
        return () => {};
      }
    },
    [buildQuery],
  );

  //* 1. R -> READ by id (real-time)
  const suscribeById = useCallback(
    (
      id: string,
      callback: (doc: FirestoreDoc<T> | null) => void,
    ): Unsubscribe => {
      setIsPending(true);

      const unsubscribe = onSnapshot(
        doc(db, table, id),
        (snapshot) => {
          if (snapshot.exists()) {
            callback({ id: snapshot.id, ...(snapshot.data() as T) });
          } else {
            callback(null);
          }

          setIsPending(false);
        },
        () => {
          setIsPending(false);
        },
      );

      return unsubscribe;
    },
    [table],
  );

  //* 1. R -> READ
  const find = useCallback(
    async (
      constraints: QueryConstraint[] = [],
    ): Promise<FirestoreDoc<T> | null> => {
      setIsPending(true);

      try {
        const q = buildQuery(constraints);
        const snapshot = await getDocs(q);
        setIsPending(false);

        if (snapshot.empty) {
          return null;
        }

        return {
          id: snapshot.docs[0].id,
          ...(snapshot.docs[0].data() as T),
        };
      } catch {
        setIsPending(false);
        return null;
      }
    },
    [buildQuery],
  );

  //* 1. R -> READ
  const getAll = useCallback(
    async (constraints: QueryConstraint[] = []): Promise<FirestoreDoc<T>[]> => {
      setIsPending(true);

      try {
        const q = buildQuery(constraints);
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as T),
        }));
      } finally {
        setIsPending(false);
      }
    },
    [buildQuery],
  );

  //* 2. C -> CREATE
  const add = useCallback(
    async (data: T): Promise<string | null> => {
      try {
        const ref = await addDoc(collection(db, table), {
          ...data,
          createdAt: serverTimestamp(),
        });

        return ref.id;
      } catch {
        return null;
      }
    },
    [table],
  );

  //* 2. C -> CREATE
  // ? Útil cuando el id lo define la app, por ejemplo users/{uid}
  const setById = useCallback(
    async (id: string, data: PartialWithFieldValue<T>): Promise<boolean> => {
      try {
        const docRef = doc(db, table, id);

        await setDoc(docRef, {
          ...data,
          createdAt: serverTimestamp(),
        });

        return true;
      } catch {
        return false;
      }
    },
    [table],
  );

  //* 3. U -> UPDATE
  const update = useCallback(
    async (id: string, data: UpdateData<T>): Promise<boolean> => {
      try {
        await updateDoc(doc(db, table, id), {
          ...data,
          updatedAt: serverTimestamp(),
        });

        return true;
      } catch {
        return false;
      }
    },
    [table],
  );

  //* 4. D -> DELETE
  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await deleteDoc(doc(db, table, id));
        return true;
      } catch {
        return false;
      }
    },
    [table],
  );

  return {
    results,
    isPending,
    suscribe,
    suscribeById,
    find,
    getAll,
    add,
    setById,
    update,
    remove,
  };
};
