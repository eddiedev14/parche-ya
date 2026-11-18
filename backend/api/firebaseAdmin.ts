import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";

const {
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PROJECT_ID,
  FIREBASE_DATABASE_URL,
} = process.env;

if (
  !FIREBASE_PRIVATE_KEY ||
  !FIREBASE_CLIENT_EMAIL ||
  !FIREBASE_PROJECT_ID ||
  !FIREBASE_DATABASE_URL
) {
  throw new Error("Missing Firebase environment variables");
}

const app = !getApps().length
  ? initializeApp({
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      databaseURL: FIREBASE_DATABASE_URL,
    })
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
