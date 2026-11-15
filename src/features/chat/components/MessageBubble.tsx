import { Avatar } from "@/shared/components/Avatar";
import { formatClock } from "@/shared/helpers/plan.helper";
import type { ChatMessage } from "../types/chat.types";

interface Props {
  message: ChatMessage;
  isMyMessage: boolean;
  //? Mismo autor que el mensaje anterior y a menos de 2 min: no repite avatar ni nombre
  isGrouped?: boolean;
}

const AVATAR_SIZE = 32;

export const MessageBubble = ({
  message,
  isMyMessage,
  isGrouped = false,
}: Props) => {
  const { name, photoUrl, text, createdAt } = message;
  const time = (
    <span className="text-caption text-muted mt-0.5">
      {formatClock(createdAt)}
    </span>
  );

  //* Mis mensajes: a la derecha, verde, sin avatar ni nombre
  if (isMyMessage) {
    return (
      <div className={`flex justify-end px-4 ${isGrouped ? "mt-1" : "mt-3"}`}>
        <div className="flex max-w-[80%] flex-col items-end">
          <p className="bg-success/20 text-ink text-body rounded-card rounded-br-sm px-3 py-2 break-words whitespace-pre-wrap">
            {text}
          </p>
          {time}
        </div>
      </div>
    );
  }

  //* Mensajes de otros: a la izquierda; si es continuación, un hueco del ancho del avatar
  return (
    <div className={`flex items-end gap-2 px-4 ${isGrouped ? "mt-1" : "mt-3"}`}>
      <div className="shrink-0 self-start" style={{ width: AVATAR_SIZE }}>
        {!isGrouped && <Avatar url={photoUrl} name={name} size={AVATAR_SIZE} />}
      </div>
      <div className="flex max-w-[80%] flex-col items-start">
        {!isGrouped && (
          <span className="text-caption text-ink mb-0.5 font-bold">{name}</span>
        )}
        <p className="bg-line text-ink text-body rounded-card rounded-bl-sm px-3 py-2 break-words whitespace-pre-wrap">
          {text}
        </p>
        {time}
      </div>
    </div>
  );
};
