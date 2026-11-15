import { Navigate } from "react-router-dom";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowBackOutline, chatbubblesOutline } from "ionicons/icons";
import { ChatComposer, MessageBubble } from "@/features/chat";
import { EmptyState } from "@/shared/components/EmptyState";
import { ROUTES } from "@/router/routes";
import { useChat } from "@/features/chat/hooks/useChat";

const ChatPage = () => {
  const {
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
  } = useChat();

  //* Solo entra quien está dentro del plan; el resto vuelve al feed
  if (!loading && (notFound || !(isJoined || isCreator))) {
    return <Navigate to={ROUTES.explore} replace />;
  }

  const renderMessages = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <IonSpinner />
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <EmptyState
          icon={chatbubblesOutline}
          title="Aún no hay mensajes"
          text="Escribe el primero para romper el hielo"
        />
      );
    }

    return messages.map((message, index) => {
      const previous = messages[index - 1];
      const isGrouped =
        !!previous &&
        previous.userId === message.userId &&
        message.timestamp.toMillis() - previous.timestamp.toMillis() <
          GROUP_WINDOW_MS;

      return (
        <MessageBubble
          key={message.name} // * Reemplazar por la futura Id
          message={message}
          isMyMessage={message.userId === user?.id}
          isGrouped={isGrouped}
        />
      );
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              icon={arrowBackOutline}
              text=""
              defaultHref={ROUTES.plan(planId)}
            />
          </IonButtons>
          <IonTitle>
            <div className="font-heading text-body-lg truncate font-semibold">
              {plan?.title ?? ""}
            </div>
            {!loading && (
              <div className="text-caption text-muted font-normal">
                {count} {count === 1 ? "participante" : "participantes"}
              </div>
            )}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} fullscreen>
        <div className="pb-3">{renderMessages()}</div>
      </IonContent>

      {!loading && (
        <IonFooter className="ion-no-border">
          {isOver ? (
            <p
              role="status"
              className="bg-line text-muted text-body px-4 pt-3 pb-[max(12px,var(--ion-safe-area-bottom))] text-center"
            >
              {status === "cancelado"
                ? "Este plan fue cancelado. El chat es de solo lectura"
                : "Este plan terminó. El chat es de solo lectura"}
            </p>
          ) : (
            <IonToolbar className="px-3 pt-2 pb-[max(8px,var(--ion-safe-area-bottom))]">
              <ChatComposer onSend={handleSend} />
            </IonToolbar>
          )}
        </IonFooter>
      )}
    </IonPage>
  );
};

export default ChatPage;
