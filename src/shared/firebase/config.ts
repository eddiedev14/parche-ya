import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Las claves viven en .env (ver .env.example), nunca en el código
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

// ? Sin .env, getAuth() y getDatabase() lanzan error al importar y la app no arranca.
// ? Con valores de relleno la UI carga, pero cualquier llamada a Firebase fallará hasta configurarlo.
if (!isFirebaseConfigured) {
  console.warn(
    "[Firebase] Faltan variables VITE_FIREBASE_* en .env. Copia .env.example a .env y complétalo.",
  );
}

// Initialize Firebase
const app = initializeApp(
  isFirebaseConfigured
    ? firebaseConfig
    : {
        apiKey: "missing-api-key",
        authDomain: "missing.firebaseapp.com",
        projectId: "missing-project",
        databaseURL: "https://missing-project-default-rtdb.firebaseio.com",
        appId: "missing-app-id",
      },
);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { app, auth, db, rtdb, isFirebaseConfigured };
