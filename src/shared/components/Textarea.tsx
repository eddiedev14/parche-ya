import { useId, type ComponentProps } from "react";
import { IonTextarea } from "@ionic/react";

import { InputError } from "./InputError";

type IonTextareaProps = ComponentProps<typeof IonTextarea>;

interface Props extends Omit<
  IonTextareaProps,
  "label" | "value" | "errorText" | "onChange" | "onIonInput" | "onIonChange"
> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  //? Muestra el contador "n/max". Se calcula aquí porque el de Ionic exige maxlength, y con maxlength nunca se vería el error de límite
  counterMax?: number;
}

export const Textarea = ({
  label,
  value,
  onChange,
  error,
  counterMax,
  className = "",
  ...rest
}: Props) => {
  const errorId = `${useId()}-error`;

  return (
    <div>
      <IonTextarea
        {...rest}
        label={label}
        labelPlacement="stacked"
        fill="outline"
        value={value}
        onIonInput={(event) => onChange(String(event.detail.value ?? ""))}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`bg-surface rounded-control [--border-color:var(--color-line)] [--border-radius:12px] [--padding-start:16px] [--padding-end:16px] ${
          error ? "ion-invalid ion-touched" : ""
        } ${className}`}
      />
      <div className="flex items-start justify-between gap-2">
        <InputError id={errorId} message={error} />
        {counterMax !== undefined && (
          <span
            className={`text-caption mt-1 ml-auto ${
              value.length > counterMax ? "text-danger" : "text-muted"
            }`}
          >
            {value.length}/{counterMax}
          </span>
        )}
      </div>
    </div>
  );
};
