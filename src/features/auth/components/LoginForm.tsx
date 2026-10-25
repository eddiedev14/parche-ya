import { IonButton } from "@ionic/react";
import { Input } from "../../../shared/components/Input";
import { PasswordInput } from "../../../shared/components/PasswordInput";

//? Esqueleto visual del login. La validación y el envío son de HU-04
export const LoginForm = () => {
  return (
    <form noValidate className="flex flex-col gap-4">
      <Input
        label="Correo"
        type="email"
        inputmode="email"
        autocomplete="email"
        placeholder="tucorreo@ejemplo.com"
        value=""
        onChange={() => {}}
      />
      <PasswordInput
        withToggle
        label="Contraseña"
        autocomplete="current-password"
        value=""
        onChange={() => {}}
      />

      <IonButton type="submit" expand="block" className="m-0">
        Iniciar sesión
      </IonButton>
    </form>
  );
};
