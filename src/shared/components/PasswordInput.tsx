import type { ComponentProps } from "react";
import { IonInputPasswordToggle } from "@ionic/react";

import { Input } from "./Input";

type Props = Omit<ComponentProps<typeof Input>, "type" | "children"> & {
  //? El toggle de ver/ocultar solo tiene sentido en la contraseña principal
  withToggle?: boolean;
};

export const PasswordInput = ({ withToggle = false, ...rest }: Props) => {
  return (
    <Input type="password" {...rest}>
      {withToggle && <IonInputPasswordToggle slot="end" color="medium" />}
    </Input>
  );
};
