import { useEffect, useRef, useState } from "react";
import { IonButton, IonIcon, IonTextarea } from "@ionic/react";
import { send } from "ionicons/icons";

interface Props {
  onSend: (text: string) => void;
}

const MAX_LENGTH = 500;
//? El contador aparece al pasar de este largo
const COUNTER_FROM = 450;
//? Un mensaje por segundo como máximo
const SEND_COOLDOWN_MS = 1000;

//? Caja de texto que crece de 1 a 4 líneas y botón circular de enviar
export const ChatComposer = ({ onSend }: Props) => {
  const [text, setText] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const textareaRef = useRef<HTMLIonTextareaElement>(null);
  const cooldownTimer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(cooldownTimer.current), []);

  const length = text.trim().length;
  //? Sin maxlength: así se puede pasar de 500 y se ve el contador en rojo
  const tooLong = length > MAX_LENGTH;
  const canSend = length > 0 && !tooLong && !cooldown;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText("");

    setCooldown(true);
    cooldownTimer.current = window.setTimeout(
      () => setCooldown(false),
      SEND_COOLDOWN_MS,
    );

    //? Respaldo por si el foco se pierde: el teclado se mantiene abierto
    textareaRef.current?.setFocus();
  };

  return (
    <div className="flex flex-col gap-1">
      {length > COUNTER_FROM && (
        <span
          className={`text-caption self-end px-2 ${
            tooLong ? "text-danger" : "text-muted"
          }`}
        >
          {length}/{MAX_LENGTH}
        </span>
      )}
      <div className="flex items-end gap-2">
        {/* autoGrow lo hace crecer; el max-h lo frena en 4 líneas y de ahí hace scroll */}
        <IonTextarea
          ref={textareaRef}
          aria-label="Mensaje"
          placeholder="Escribe un mensaje"
          autoGrow
          rows={1}
          value={text}
          onIonInput={(event) => setText(String(event.detail.value ?? ""))}
          className="bg-surface text-body-lg max-h-[104px] min-h-11 overflow-y-auto rounded-3xl [--padding-bottom:10px] [--padding-end:16px] [--padding-start:16px] [--padding-top:10px]"
        />
        <IonButton
          shape="round"
          aria-label="Enviar mensaje"
          disabled={!canSend}
          onClick={handleSend}
          //? Evita que tocar el botón le quite el foco al textarea (se cerraría el teclado)
          onMouseDown={(event) => event.preventDefault()}
          className="m-0 size-11 shrink-0 [--padding-end:0] [--padding-start:0]"
        >
          <IonIcon slot="icon-only" icon={send} />
        </IonButton>
      </div>
    </div>
  );
};
