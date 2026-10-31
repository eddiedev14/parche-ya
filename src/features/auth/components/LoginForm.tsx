import { IonButton } from "@ionic/react";

import { Input } from "@/shared/components/Input";
import { PasswordInput } from "@/shared/components/PasswordInput";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";

export const LoginForm = () => {
  const { form } = useLoginForm();

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit}
      className="flex flex-col gap-4"
    >
      <Input
        label="Correo"
        type="email"
        inputmode="email"
        autocomplete="email"
        placeholder="tucorreo@ejemplo.com"
        {...form.getFieldProps("email")}
      />
      <PasswordInput
        withToggle
        label="Contraseña"
        autocomplete="current-password"
        {...form.getFieldProps("password")}
      />

      <IonButton
        type="submit"
        expand="block"
        className="m-0"
        disabled={form.submitting}
      >
        Iniciar sesión
      </IonButton>
    </form>
  );
};
