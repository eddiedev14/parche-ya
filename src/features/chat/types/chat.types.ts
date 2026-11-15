import { FirestoreDoc } from "@/shared/firebase/types/firestore.types";

//* Un mensaje del chat de un plan
export interface ChatMessage {
  userId: string;
  name: string;
  photoUrl?: string;
  text: string;
  createdAt: number;
}

export type ChatMessageDoc = FirestoreDoc<ChatMessage>;
