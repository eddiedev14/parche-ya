import type { ReactNode } from "react";

interface Props {
  legend: string;
  children: ReactNode;
}

//? Grupo con título accesible (fieldset + legend) para los campos que no son un input de texto
export const FieldGroup = ({ legend, children }: Props) => (
  <fieldset className="flex flex-col gap-2">
    <legend className="text-body text-ink mb-2 font-semibold">{legend}</legend>
    {children}
  </fieldset>
);
