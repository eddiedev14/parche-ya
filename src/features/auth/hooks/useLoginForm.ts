import { Toast } from "@/shared/classes/Toast.class";
import { useForm } from "@/shared/hooks/useForm";
import {
  EMPTY_LOGIN,
  validateLogin,
} from "@/features/auth/validations/login.validation";
import { useAuth } from "./useAuth";

export const useLoginForm = () => {
  const { login } = useAuth();

  const form = useForm({
    initialValues: EMPTY_LOGIN,
    validate: validateLogin,
    onSubmit: async (values) => {
      //? Si sale bien, AppRoutes detecta el usuario y redirige a Explorar
      const error = await login(
        values.email.trim().toLowerCase(),
        values.password,
      );
      if (error) Toast.error(error);
    },
  });

  return { form };
};
