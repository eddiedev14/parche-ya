import { IonAlert } from "@ionic/react";
import { useAuth } from "@/features/auth";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { usePushPermission } from "../hooks/usePushPermission";

interface Props {
  userId: string;
}

//? Marca por usuario: si otra persona inicia sesión en el mismo celular, también ve el alert
const getStorageKey = (userId: string) => `parcheya:push-asked:${userId}`;

const PermissionAlert = ({ userId }: Props) => {
  const [asked, setAsked] = useLocalStorage(getStorageKey(userId), false);
  const { isSupported, permission, enable } = usePushPermission();

  //? Solo si el sistema aún no tiene respuesta: si ya las dio o las negó, el alert sobra
  const isPending =
    permission === "prompt" || permission === "prompt-with-rationale";

  return (
    <IonAlert
      isOpen={isSupported && !asked && isPending}
      onDidDismiss={() => setAsked(true)}
      message="¿Quieres que te avisemos de planes y mensajes nuevos?"
      buttons={[
        { text: "Ahora no", role: "cancel" },
        {
          text: "Sí, avisarme",
          //? Sin return: así el alert se cierra antes de que aparezca el diálogo del sistema
          handler: () => {
            enable();
          },
        },
      ]}
    />
  );
};

//? key = uid: useLocalStorage lee su clave solo al montarse, así que al cambiar de usuario se monta de nuevo
export const PushPermissionAlert = () => {
  const { user } = useAuth();
  if (!user) return null;

  return <PermissionAlert key={user.id} userId={user.id} />;
};
