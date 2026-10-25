import { useState, type FormEvent } from "react";

//* Errores por campo. Un campo sin llave (o sin mensaje) es válido
export type FormErrors<T> = Partial<Record<keyof T, string>>;

//? Llaves cuyo valor es string: las únicas que pueden usarse con getFieldProps (Input, PasswordInput...)
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

interface UseFormOptions<T> {
  initialValues: T;
  //? Función pura: recibe todos los valores y devuelve los mensajes de error
  validate: (values: T) => FormErrors<T>;
  //? Solo se ejecuta si el formulario es válido. Recibe los valores actuales
  onSubmit?: (values: T) => void | Promise<void>;
}

//* Estado base de cualquier formulario: valores, errores, touched y envío.
//* Ejemplo:
//*   const form = useForm({ initialValues, validate, onSubmit });
//*   <form onSubmit={form.handleSubmit}>
//*     <Input label="Nombre" {...form.getFieldProps("name")} />
export const useForm = <T extends object>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  //? Campos que el usuario ya tocó (entró y salió). Ej: { name: true }
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  //? Errores de TODOS los campos, se vean o no
  const errors = validate(values);
  const isValid = Object.values(errors).every((message) => !message);

  const setValue = <K extends keyof T>(field: K, value: T[K]) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const touch = (field: keyof T) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  //? El error se muestra al salir del campo o al intentar enviar, no mientras se escribe por primera vez
  const getError = (field: keyof T) =>
    touched[field] || submitAttempted ? errors[field] : undefined;

  //? Props listas para esparcir en un Input / PasswordInput
  const getFieldProps = (field: StringKeys<T>) => ({
    value: values[field] as string,
    error: getError(field),
    onChange: (value: string) => setValue(field, value as T[typeof field]),
    onIonBlur: () => touch(field),
  });

  //? Igual que getFieldProps pero para cualquier campo (foto, switch, selector...). Sin onIonBlur:
  //? esos widgets no tienen blur, así que su error se ve al intentar enviar. Value y onChange van tipados con T[K]
  const getControlProps = <K extends keyof T>(field: K) => ({
    value: values[field],
    error: getError(field),
    onChange: (value: T[K]) => setValue(field, value),
  });

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    setSubmitAttempted(true);
    if (!isValid) return;

    //? El finally apaga `submitting` aunque onSubmit falle. Ese error lo maneja quien llama a useForm
    setSubmitting(true);
    try {
      await onSubmit?.(values);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setTouched({});
    setSubmitAttempted(false);
  };

  return {
    values,
    errors,
    touched,
    submitAttempted,
    submitting,
    isValid,
    setValue,
    setValues,
    touch,
    getError,
    getFieldProps,
    getControlProps,
    handleSubmit,
    reset,
  };
};
