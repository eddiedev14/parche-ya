import { useState } from "react";
import { IonButton, IonIcon, IonTextarea } from "@ionic/react";
import { send } from "ionicons/icons";

interface Props {
  onSend: (text: string) => void;
}

//? Caja de texto que crece de 1 a 4 líneas y botón circular de enviar
export const ChatComposer = ({ onSend }: Props) => {
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex items-end gap-2">
      {/* autoGrow lo hace crecer; el max-h lo frena en 4 líneas y de ahí hace scroll */}
      <IonTextarea
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
        className="m-0 size-11 shrink-0 [--padding-end:0] [--padding-start:0]"
      >
        <IonIcon slot="icon-only" icon={send} />
      </IonButton>
    </div>
  );
};
