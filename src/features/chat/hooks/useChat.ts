import { useRef, useEffect } from "react";
import { useParams } from "react-router";
import { Toast } from "@/shared/classes/Toast.class";
import { useRTDatabase } from "@/shared/firebase/hooks/useRTDatabase";
import { useAuth } from "@/features/auth";
import { usePlanDetail } from "@/features/plans";
import type { ChatMessage, ChatMessageDoc } from "../types/chat.types";

//? Dos mensajes seguidos del mismo autor en menos de este tiempo se agrupan
const GROUP_WINDOW_MS = 2 * 60_000;

export const useChat = () => {
  const { planId = "" } = useParams<{ planId: string }>();
  const { user } = useAuth();
  const { plan, loading, notFound, count, isCreator, isJoined, status } =
    usePlanDetail(planId);
  const contentRef = useRef<HTMLIonContentElement>(null);

  // * RT Database
  const { results, add: sendMessage } = useRTDatabase<
    Omit<ChatMessage, "createdAt">
  >(`chats/${planId}`);
  //? add siempre guarda createdAt (serverTimestamp), pero el tipo del hook no lo sabe
  const messages = results as ChatMessageDoc[];

  //? Al llegar un mensaje (o al entrar) el chat baja hasta el último
  useEffect(() => {
    contentRef.current?.scrollToBottom(0);
  }, [messages.length, loading]);

  const isOver = status === "terminado" || status === "cancelado";

  // * shortcut: solo agrega el mensaje en memoria; reemplazar por el envío real
  const handleSend = async (text: string) => {
    if (!user) return;

    const messageSent = await sendMessage({
      userId: user.id,
      name: user.displayName,
      text,
      photoUrl: user.photoUrl,
    });

    if (!messageSent) Toast.error("Error enviando tu mensaje");
  };

  return {
    GROUP_WINDOW_MS,
    contentRef,
    user,
    planId,
    plan,
    messages,
    loading,
    notFound,
    count,
    isCreator,
    isJoined,
    status,
    isOver,
    handleSend,
  };
};
