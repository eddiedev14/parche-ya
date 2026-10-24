export type UserRole = "user" | "admin";

//* Documento users/{uid} en Firestore
export interface User {
  displayName: string;
  email: string;
  bio: string;
  photoUrl: string;
  fcmToken: string | null;
  role: UserRole;
}

//* Usuario de la sesión: Firebase Auth + rol leído de Firestore
export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  photoUrl: string;
  role: UserRole;
};
