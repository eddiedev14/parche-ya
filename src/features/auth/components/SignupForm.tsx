import { IonButton, IonSpinner } from "@ionic/react";
import { AvatarPicker, Input, PasswordInput } from "../../../shared/components";
import { useForm } from "../../../shared/hooks/useForm";
import { EMPTY_SIGNUP, validateSignup } from "../validations/signup.validation";

export const SignupForm = () => {
  const form = useForm({
    initialValues: EMPTY_SIGNUP,
    validate: validateSignup,
    onSubmit: async () => {
      // Ejecutar submit real
    },
  });

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit}
      className="flex flex-col gap-4"
    >
      <AvatarPicker {...form.getControlProps("photoUrl")} />

      <Input
        label="Nombre"
        placeholder="¿Cómo te llamamos?"
        autocomplete="name"
        {...form.getFieldProps("name")}
      />
      <Input
        label="Bio"
        placeholder="¿Cuéntanos sobre ti?"
        {...form.getFieldProps("bio")}
      />
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
        autocomplete="new-password"
        placeholder="Mínimo 8 caracteres"
        {...form.getFieldProps("password")}
      />
      <PasswordInput
        label="Confirmar contraseña"
        autocomplete="new-password"
        placeholder="Repite tu contraseña"
        {...form.getFieldProps("confirmPassword")}
      />

      <IonButton
        type="submit"
        expand="block"
        disabled={form.submitting}
        className="mt-2 mb-0"
      >
        {form.submitting ? (
          <IonSpinner name="crescent" aria-label="Creando cuenta" />
        ) : (
          "Crear cuenta"
        )}
      </IonButton>
    </form>
  );
};
