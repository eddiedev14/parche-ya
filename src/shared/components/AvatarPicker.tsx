import { useState } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { cameraOutline, personOutline } from "ionicons/icons";

import { InputError } from "./InputError";

interface Props {
  //? URL local de la foto tomada (webPath). null si aún no hay foto
  value: string | null;
  onChange: (photoUrl: string) => void;
  //? Error de validación del formulario (ej. falta la foto)
  error?: string;
  size?: number;
}

const PERMISSION_ERROR = "Debes tener activado el permiso de camara";

//? Cuando el usuario cierra la cámara sin tomar foto el plugin lanza un error "cancelled"; no es un fallo
const isCancelled = (error: unknown) =>
  error instanceof Error && /cancel/i.test(error.message);

export const AvatarPicker = ({ value, onChange, error, size = 112 }: Props) => {
  const [cameraError, setCameraError] = useState("");

  const takePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
        quality: 80,
        width: 640,
        correctOrientation: true,
      });
      if (!photo.webPath) return;
      setCameraError("");
      onChange(photo.webPath);
    } catch (e) {
      if (!isCancelled(e)) setCameraError(PERMISSION_ERROR);
    }
  };

  const message = cameraError || error;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <IonButton
          fill="clear"
          onClick={takePhoto}
          aria-label={value ? "Cambiar foto de perfil" : "Tomar foto de perfil"}
          className={`m-0 h-full w-full [--border-radius:9999px] [--padding-bottom:0] [--padding-end:0] [--padding-start:0] [--padding-top:0] ${
            message ? "text-danger" : "text-muted"
          }`}
        >
          <span
            className={`bg-surface flex size-full items-center justify-center overflow-hidden rounded-full border-2 ${
              value
                ? "border-line border-solid"
                : message
                  ? "border-danger border-dashed"
                  : "border-line border-dashed"
            }`}
            style={{ width: size, height: size }}
          >
            {value ? (
              <img
                src={value}
                alt="Tu foto de perfil"
                className="size-full object-cover"
              />
            ) : (
              <IonIcon
                icon={personOutline}
                aria-hidden="true"
                style={{ fontSize: size * 0.45 }}
              />
            )}
          </span>
        </IonButton>

        {/* Badge de cámara: decorativo, el toque lo recibe el botón de arriba */}
        <span
          aria-hidden="true"
          className="bg-primary border-cream pointer-events-none absolute right-0 bottom-0 flex size-9 items-center justify-center rounded-full border-2 text-white shadow-sm"
        >
          <IonIcon icon={cameraOutline} className="text-lg" />
        </span>
      </div>

      <p className="text-caption text-muted">
        {value ? "Toca para cambiarla" : "Toma tu foto de perfil"}
      </p>
      <InputError message={message} />
    </div>
  );
};
