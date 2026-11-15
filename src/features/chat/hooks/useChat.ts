import { useRef, useState, useEffect } from "react";
import { useParams, replace } from "react-router";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/features/auth";
import { usePlanDetail } from "@/features/plans";
import { ChatMessage } from "../types/chat.types";

//? Dos mensajes seguidos del mismo autor en menos de este tiempo se agrupan
const GROUP_WINDOW_MS = 2 * 60_000;

// * shortcut: mensajes de ejemplo para ver la UI; reemplazar por el hook real del chat
const buildMockMessages = (myId: string): ChatMessage[] => {
  const base = Date.now() - 20 * 60_000;
  const at = (minutes: number) => Timestamp.fromMillis(base + minutes * 60_000);

  return [
    {
      userId: "ana",
      name: "Ana Gómez",
      text: "¡Hola parche! ¿Ya van saliendo?",
      timestamp: at(0),
    },
    {
      userId: "ana",
      name: "Ana Gómez",
      text: "Yo llego en 10 minutos",
      timestamp: at(1),
    },
    {
      userId: myId,
      name: "Yo",
      text: "Dale, ya voy para allá",
      timestamp: at(3),
    },
    {
      userId: myId,
      name: "Yo",
      text: "Me esperan en la entrada principal?",
      timestamp: at(3.5),
    },
    {
      userId: "luis",
      name: "Luis Pérez",
      text: "Sí, ahí los espero. Traigo el balón y también unas botellas de agua para todos, que hace mucho calor hoy",
      timestamp: at(8),
    },
  ];
};

export const useChat = () => {
  const { planId = "" } = useParams<{ planId: string }>();
  const { user } = useAuth();
  const contentRef = useRef<HTMLIonContentElement>(null);

  const { plan, loading, notFound, count, isCreator, isJoined, status } =
    usePlanDetail(planId);

  const [messages, setMessages] = useState(() =>
    buildMockMessages(user?.id ?? ""),
  );

  //? Al llegar un mensaje (o al entrar) el chat baja hasta el último
  useEffect(() => {
    contentRef.current?.scrollToBottom(0);
  }, [messages.length, loading]);

  const isOver = status === "terminado" || status === "cancelado";

  // * shortcut: solo agrega el mensaje en memoria; reemplazar por el envío real
  const handleSend = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        userId: user?.id ?? "",
        name: user?.displayName ?? "Yo",
        photoUrl: user?.photoUrl,
        text,
        timestamp: Timestamp.now(),
      },
    ]);
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
