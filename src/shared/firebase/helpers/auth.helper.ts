import { FirebaseError } from "firebase/app";
import { auth } from "../config";

// Función para obtener el mensaje de error de firebase a la hora de autenticarse
const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Ese correo ya está en uso";

      case "auth/invalid-email":
        return "Ese correo no es válido";

      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres";

      case "auth/invalid-credential":
        return "Correo o contraseña incorrectos";

      case "auth/user-disabled":
        return "Esta cuenta fue deshabilitada";

      case "auth/expired-action-code":
        return "El enlace venció. Pide uno nuevo.";

      case "auth/invalid-action-code":
        return "El enlace no es válido o ya fue usado.";

      case "auth/network-request-failed":
        return "Error de conexión. Revisa tu internet";

      case "auth/too-many-requests":
        return "Demasiados intentos. Inténtalo más tarde";

      default:
        return error.code;
    }
  }

  return "Ocurrió un error inesperado";
};

// Función para obtener el firebaseToken del usuario logueado
const getFirebaseToken = async (): Promise<string | undefined> => {
  const tokenId = await auth.currentUser?.getIdToken();
  return tokenId;
};

export { getAuthErrorMessage, getFirebaseToken };
