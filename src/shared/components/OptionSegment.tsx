import { IonSegment, IonSegmentButton } from "@ionic/react";

interface Props {
  options: { label: string; value: number }[];
  value: number;
  onChange: (value: number) => void;
}

//? IonSegment para elegir una opción numérica (minutos, horas...). Siempre hay una seleccionada
export const OptionSegment = ({ options, value, onChange }: Props) => (
  <IonSegment
    value={value}
    onIonChange={({ detail }) => {
      if (detail.value !== undefined) onChange(Number(detail.value));
    }}
  >
    {options.map((option) => (
      <IonSegmentButton key={option.value} value={option.value}>
        {option.label}
      </IonSegmentButton>
    ))}
  </IonSegment>
);
