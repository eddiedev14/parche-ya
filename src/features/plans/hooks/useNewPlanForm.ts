import { useForm } from "@/shared/hooks/useForm";
import {
  EMPTY_NEW_PLAN,
  validateNewPlan,
} from "@/features/plans/validations/newPlan.validation";

export const useNewPlanForm = () => {
  //* Form controller
  //? Falta onSubmit (HU-05): guardar el plan y cerrar el modal. useForm solo lo llama si el formulario es válido
  const form = useForm({
    initialValues: EMPTY_NEW_PLAN,
    validate: validateNewPlan,
    onSubmit: (values) => {
      console.log(values);
      alert("Nuevo plan creado!");
    },
  });

  return { form };
};
