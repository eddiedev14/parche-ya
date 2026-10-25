import { useId, type ComponentProps, type ReactNode } from "react";
import { IonInput } from "@ionic/react";

import { InputError } from "./InputError";

type IonInputProps = ComponentProps<typeof IonInput>;

interface Props extends Omit<
  IonInputProps,
  "label" | "value" | "errorText" | "onChange" | "onIonInput" | "onIonChange"
> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  //? Contenido del slot (ej. <IonInputPasswordToggle slot="end" />)
  children?: ReactNode;
}

export const Input = ({
  label,
  value,
  onChange,
  error,
  className = "",
  children,
  ...rest
}: Props) => {
  const errorId = `${useId()}-error`;

  return (
    <div>
      <IonInput
        {...rest}
        label={label}
        labelPlacement="stacked"
        fill="outline"
        value={value}
        onIonInput={(event) => onChange(String(event.detail.value ?? ""))}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`bg-surface rounded-control [--border-color:var(--color-line)] [--border-radius:12px] ${
          error ? "ion-invalid ion-touched" : ""
        } ${className}`}
      >
        {children}
      </IonInput>
      <InputError id={errorId} message={error} />
    </div>
  );
};
