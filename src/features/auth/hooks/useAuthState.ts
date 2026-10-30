//* React
import { useEffect, useState } from "react";

//* Firebase
import { auth, db } from "../../../shared/firebase/config";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// * Types & utils
import type { AuthUser, User, UserRole } from "../types/auth.types";
import { useCollection } from "../../../shared/firebase/hooks/useCollection";
import { SignupValues as UserRegister } from "../validations/signup.validation";
import { getAuthErrorMessage } from "../../../shared/firebase/helpers/auth.helper";

//? El rol vive en users/{uid}. Si el documento no existe todavía (registro en curso) o falla la lectura, se asume "user"
const getUserRole = async (uid: string): Promise<UserRole> => {
  try {
    const snapshot = await getDoc(doc(db, "users", uid));
    return snapshot.exists() ? (snapshot.data() as User).role : "user";
  } catch {
    return "user";
  }
};

//? Devuelve null si todo salió bien, o el mensaje de error
const login = async (
  email: string,
  password: string,
): Promise<string | null> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return null;
  } catch (error) {
    return getAuthErrorMessage(error);
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
  //? Mientras dura el registro (cuenta + foto) AppRoutes no redirige, aunque Firebase ya haya iniciado sesión
  const [registering, setRegistering] = useState(false);

  //* Firestore collection
  const { setById, update } = useCollection<User>("users");

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
      setUserLoading(true);
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

  //* Functions
  const registerWithEmailAndPassword = async (
    user: Omit<UserRegister, "photo" | "confirmPassword">,
  ): Promise<string | null> => {
    let error: string | null = null;
    const { name: displayName, bio, email, password } = user;

    // Proceed with the register in Firebase Auth
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      //? La foto se sube después del registro (ImageKit exige sesión) y actualiza este documento con updateUserPhoto
      const userId = userCredential.user.uid;
      const created = await setById(userId, {
        displayName,
        email,
        bio,
        photoUrl: "",
        fcmToken: null,
        role: "user",
      });
      if (!created) error = "No pudimos guardar tu perfil. Inténtalo de nuevo.";
    } catch (err) {
      error = getAuthErrorMessage(err);
    }

    return error;
  };

  //? Requiere sesión iniciada: se llama justo después de registrarse, con la URL devuelta por ImageKit
  const updateUserPhoto = async (photoUrl: string): Promise<string | null> => {
    const fbUser = auth.currentUser;
    if (!fbUser) return "No hay una sesión iniciada.";

    const updated = await update(fbUser.uid, { photoUrl });
    if (!updated) return "No pudimos guardar tu foto de perfil.";

    //? updateProfile no dispara onAuthStateChanged, por eso se sincroniza el estado local a mano
    try {
      await updateProfile(fbUser, { photoURL: photoUrl });
    } catch {
      //? El documento de Firestore ya quedó actualizado; el photoURL de Auth es secundario
    }
    setUser((prev) => (prev?.id === fbUser.uid ? { ...prev, photoUrl } : prev));
    return null;
  };

  return {
    user,
    userLoading,
    registering,
    setRegistering,
    registerWithEmailAndPassword,
    updateUserPhoto,
    login,
    logout,
  };
}
