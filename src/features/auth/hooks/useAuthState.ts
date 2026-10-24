//* React
import { useEffect, useState } from "react";

//* Firebase
import { auth, db } from "../../../shared/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// * Types & utils
import type { AuthUser, User, UserRole } from "../types/auth.types";

//? El rol vive en users/{uid}. Si el documento no existe todavía (registro en curso) o falla la lectura, se asume "user"
const getUserRole = async (uid: string): Promise<UserRole> => {
  try {
    const snapshot = await getDoc(doc(db, "users", uid));
    return snapshot.exists() ? (snapshot.data() as User).role : "user";
  } catch {
    return "user";
  }
};

const logout = async (): Promise<string | null> => {
  try {
    await signOut(auth);
    return null;
  } catch {
    return "No pudimos cerrar tu sesión. Inténtalo de nuevo.";
  }
};

export default function useAuthState() {
  //* States
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  //* Effects
  useEffect(() => {
    //? La sesión persiste entre recargas (persistencia local por defecto de getAuth)
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setUserLoading(false);
        return;
      }

      //? Firebase Auth es la fuente de verdad de la sesión; el rol se completa después sin bloquear la carga
      setUser({
        id: fbUser.uid,
        email: fbUser.email ?? "",
        displayName: fbUser.displayName ?? "",
        photoUrl: fbUser.photoURL ?? "",
        role: "user",
      });
      setUserLoading(false);

      const role = await getUserRole(fbUser.uid);
      setUser((prev) => (prev?.id === fbUser.uid ? { ...prev, role } : prev));
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return {
    user,
    userLoading,
    logout,
  };
}
