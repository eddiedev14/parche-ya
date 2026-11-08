import { useState } from "react";
import { IonActionSheet, IonButton, IonIcon } from "@ionic/react";
import { chevronDownOutline } from "ionicons/icons";

import { RADIUS_OPTIONS } from "../constants";
import type { RadiusKm } from "../types/plans.types";

interface Props {
  radiusKm: RadiusKm;
  onChange: (radiusKm: RadiusKm) => void;
}

export const RadiusSelector = ({ radiusKm, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const label =
    RADIUS_OPTIONS.find((option) => option.value === radiusKm)?.label ??
    "Sin límite";

  return (
    <>
      {/* h-11 = 44 px de zona táctil */}
      <IonButton
        fill="clear"
        className="text-body-lg m-0 h-11 self-start normal-case [--color:var(--color-ink)] [--padding-start:0]"
        onClick={() => setIsOpen(true)}
      >
        Cerca de ti · {label}
        <IonIcon slot="end" icon={chevronDownOutline} />
      </IonButton>

      <IonActionSheet
        isOpen={isOpen}
        onDidDismiss={() => setIsOpen(false)}
        buttons={[
          ...RADIUS_OPTIONS.map((option) => ({
            text: option.label,
            handler: () => onChange(option.value),
          })),
          { text: "Cancelar", role: "cancel" },
        ]}
      />
    </>
  );
};
