import { useEffect, useState } from "react";
import { IonToast } from "@ionic/react";
import { Toast } from "../classes/Toast.class";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastState {
  message: string;
  type: ToastType;
}

const colors = {
  success: "success",
  error: "danger",
  warning: "warning",
  info: "info",
} as const;

export function ToastProvider() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return Toast.subscribe(({ message, type }) => {
      setToast({ message, type });
      setIsOpen(true);
    });
  }, []);

  return (
    <IonToast
      isOpen={isOpen}
      message={toast?.message ?? ""}
      color={toast ? colors[toast.type] : "primary"}
      duration={3000}
      position="top"
      onDidDismiss={() => setIsOpen(false)}
    />
  );
}
