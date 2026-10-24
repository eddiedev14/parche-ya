import { IonButton, IonIcon } from "@ionic/react";

interface Props {
  icon: string;
  title: string;
  text?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon,
  title,
  text,
  actionLabel,
  onAction,
}: Props) => {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <IonIcon icon={icon} className="text-muted size-16" />
      <h3 className="font-heading text-h3 text-ink">{title}</h3>
      {text && <p className="text-body text-muted">{text}</p>}
      {actionLabel && onAction && (
        <IonButton className="mt-2" onClick={onAction}>
          {actionLabel}
        </IonButton>
      )}
    </div>
  );
};
