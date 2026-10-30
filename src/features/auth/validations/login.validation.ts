import { EMAIL_REGEX } from "../../../shared/helpers/constants";

export interface LoginValues {
  email: string;
  password: string;
}

export const EMPTY_LOGIN: LoginValues = {
  email: "",
  password: "",
};

export const validateLogin = (
  values: LoginValues,
): Partial<Record<keyof LoginValues, string>> => {
  const errors: Partial<Record<keyof LoginValues, string>> = {};
  const email = values.email.trim();

  if (!email) errors.email = "Escribe tu correo";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Ese correo no es válido";

  //? La contraseña no se recorta con trim(): los espacios pueden ser parte de ella
  if (!values.password) errors.password = "Escribe tu contraseña";

  return errors;
};
