import { FirestoreDoc } from "@/shared/firebase/types/firestore.types";
import { Timestamp } from "firebase/firestore";

//* Un mensaje del chat de un plan
export interface ChatMessage {
  userId: string;
  name: string;
  photoUrl?: string;
  text: string;
  timestamp: Timestamp;
}

export type ChatMessageDoc = FirestoreDoc<ChatMessage>;
