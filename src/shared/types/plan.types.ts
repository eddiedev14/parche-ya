import type { Timestamp } from "firebase/firestore";
import type { FirestoreDoc } from "@/shared/firebase/types/firestore.types";
import type { CategoryId } from "@/shared/helpers/constants";

//? Firestore devuelve Timestamp; Date y number facilitan mocks y pruebas
export type PlanDate = Timestamp | Date | number;

export interface PlanLocation {
  lat: number;
  lng: number;
  label: string;
}
export type Coordinates = Pick<PlanLocation, "lat" | "lng">;

//* Documento plans/{planId} en Firestore
export interface Plan {
  title: string;
  description?: string;
  category: CategoryId;
  location: PlanLocation;
  startAt: PlanDate;
  expiresAt: PlanDate;
  capacity: number;
  creatorId: string;
  //? Datos denormalizados del organizador para pintar el PlanCard sin una lectura extra por plan
  creatorName?: string;
  creatorPhotoUrl?: string;
  //? "active" o "cancelled". El resto de estados se calcula
  status: "active" | "cancelled";
}

export type PlanDoc = FirestoreDoc<Plan>;
