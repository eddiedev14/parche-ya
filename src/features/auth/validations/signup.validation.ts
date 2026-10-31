import { EMAIL_REGEX } from "@/shared/helpers/constants";
import type { FormErrors } from "@/shared/hooks/useForm";

export interface SignupValues {
  //? Archivo de la foto de perfil, listo para subir a ImageKit
  photo: File | null;
  name: string;
  bio: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type SignupErrors = FormErrors<SignupValues>;

export const EMPTY_SIGNUP: SignupValues = {
  photo: null,
  name: "",
  bio: "",
  email: "",
  password: "",
  confirmPassword: "",
};

//? Letras (con tildes y ñ), números, espacios, "." y "-"
const NAME_REGEX = /^[\p{L}\p{N} .-]+$/u;

const validateName = (value: string) => {
  const name = value.trim();
  if (!name) return "Escribe tu nombre";
  if (name.length < 2) return "Mínimo 2 caracteres";
  if (name.length > 30) return "Máximo 30 caracteres";
  if (!NAME_REGEX.test(name))
    return "Usa solo letras, números, espacios, . y -";
};

const validateBio = (value: string) => {
  const bio = value.trim();
  if (!bio) return "Escribe tu bio";
  if (bio.length > 50) return "Máximo 50 caracteres.";
};

const validateEmail = (value: string) => {
  const email = value.trim();
  if (!email) return "Escribe tu correo";
  if (!EMAIL_REGEX.test(email)) return "Ese correo no es válido";
};

const validatePassword = (value: string) => {
  if (value.length < 8) return "Mínimo 8 caracteres";
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value))
    return "Incluye al menos una letra y un número";
};

export const validateSignup = (values: SignupValues): SignupErrors => {
  const errors: SignupErrors = {
    photo: values.photo ? undefined : "Agrega tu foto de perfil",
    name: validateName(values.name),
    bio: validateBio(values.bio),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword:
      values.confirmPassword === values.password
        ? undefined
        : "Las contraseñas no coinciden",
  };

  //? Se descartan las llaves sin error para poder usar Object.keys(errors).length
  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message),
  );
};
