import type { CSSProperties } from "react";
import { IonChip, IonIcon } from "@ionic/react";

interface Props {
  //? Una categoría de CATEGORIES o CATEGORY_ALL ("Todos")
  category: { name: string; icon: string; color: string };
  selected?: boolean;
  onClick?: () => void;
}

export const CategoryChip = ({
  category,
  selected = false,
  onClick,
}: Props) => {
  const { name, icon, color } = category;

  return (
    <IonChip
      onClick={onClick}
      aria-pressed={selected}
      className="m-0 shrink-0 cursor-pointer gap-2 border px-4 py-2"
      style={
        {
          "--background": selected ? color : "#FFFFFF",
          "--color": selected ? "#FFFFFF" : "#1F1B2E",
          borderColor: selected ? color : "#E8E2EE",
        } as CSSProperties
      }
    >
      <IonIcon icon={icon} style={{ color: selected ? "#FFFFFF" : color }} />
      <span className="text-caption">{name}</span>
    </IonChip>
  );
};
