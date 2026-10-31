import { useForm } from "../../../shared/hooks/useForm";
import {
  EMPTY_NEW_PLAN,
  validateNewPlan,
} from "../validations/newPlan.validation";

export const useNewPlanForm = () => {
  //* Form controller
  //? Falta onSubmit (HU-05): guardar el plan y cerrar el modal. useForm solo lo llama si el formulario es válido
  const form = useForm({
    initialValues: EMPTY_NEW_PLAN,
    validate: validateNewPlan,
    onSubmit: () => {
      alert("Nuevo plan creado!");
    },
  });

  return { form };
};
