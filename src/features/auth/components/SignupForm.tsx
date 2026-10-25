import { IonButton, IonSpinner } from "@ionic/react";

import { AvatarPicker } from "../../../shared/components/AvatarPicker";
import { Input } from "../../../shared/components/Input";
import { PasswordInput } from "../../../shared/components/PasswordInput";

export const SignupForm = () => {
  const submitting = false;

  return (
    <form noValidate className="flex flex-col gap-4">
      <AvatarPicker value="" error="" onChange={() => {}} />

      <Input
        label="Nombre"
        placeholder="¿Cómo te llamamos?"
        autocomplete="name"
        value=""
        error=""
        onChange={() => {}}
      />
      <Input
        label="Bio"
        placeholder="¿Cuéntanos sobre ti?"
        value=""
        error=""
        onChange={() => {}}
      />
      <Input
        label="Correo"
        type="email"
        inputmode="email"
        autocomplete="email"
        placeholder="tucorreo@ejemplo.com"
        value=""
        error=""
        onChange={() => {}}
      />
      <PasswordInput
        withToggle
        label="Contraseña"
        autocomplete="new-password"
        placeholder="Mínimo 8 caracteres"
        value=""
        error=""
        onChange={() => {}}
      />
      <PasswordInput
        label="Confirmar contraseña"
        autocomplete="new-password"
        placeholder="Repite tu contraseña"
        value=""
        error=""
        onChange={() => {}}
      />

      <IonButton
        type="submit"
        expand="block"
        disabled={submitting}
        className="mt-2 mb-0"
      >
        {submitting ? (
          <IonSpinner name="crescent" aria-label="Creando cuenta" />
        ) : (
          "Crear cuenta"
        )}
      </IonButton>
    </form>
  );
};
