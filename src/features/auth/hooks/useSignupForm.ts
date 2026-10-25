import { Toast } from "../../../shared/classes/Toast.class";
import { useForm } from "../../../shared/hooks/useForm";
import {
  EMPTY_SIGNUP,
  SignupValues,
  validateSignup,
} from "../validations/signup.validation";
import { useAuth } from "./useAuth";
import { useImageKit } from "./useImageKit";

export const useSignupForm = () => {
  const { registerWithEmailAndPassword, updateUserPhoto, setRegistering } =
    useAuth();
  const { uploadAvatar } = useImageKit();

  //* Functions
  const signup = async (values: SignupValues) => {
    const { photo, confirmPassword: _, ...userRegister } = values;

    //? 1. Registrar usuario en firebase (inicia sesión y crea users/{uid})
    const registerError = await registerWithEmailAndPassword(userRegister);
    if (registerError) {
      Toast.error(registerError);
      return;
    }

    //? 2. Cargar imagen en ImageKit (función serverless, requiere la sesión del paso 1)
    const imageBucketUrl = await uploadAvatar(photo as File);
    if (!imageBucketUrl) {
      Toast.error(
        "Tu cuenta fue creada, pero no pudimos subir tu foto de perfil.",
      );
      return;
    }

    //? 3. Actualizar el documento del usuario con la URL de la foto
    const photoError = await updateUserPhoto(imageBucketUrl);
    if (photoError) {
      Toast.error(photoError);
      return;
    }

    Toast.success("¡Usuario creado correctamente!");
  };

  //* Form controller
  const form = useForm({
    initialValues: EMPTY_SIGNUP,
    validate: validateSignup,
    onSubmit: async (values) => {
      //? Bloquea la redirección a Explore hasta terminar todo el flujo (el finally la libera después del toast)
      setRegistering(true);
      try {
        await signup(values);
      } finally {
        setRegistering(false);
      }
    },
  });

  return { form };
};
