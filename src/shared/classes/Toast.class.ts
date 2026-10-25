type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  message: string;
  type: ToastType;
}

export class Toast {
  private static listener?: (options: ToastOptions) => void;

  static subscribe(listener: (options: ToastOptions) => void) {
    Toast.listener = listener;

    return () => {
      Toast.listener = undefined;
    };
  }

  private static show(message: string, type: ToastType) {
    Toast.listener?.({ message, type });
  }

  static success(message: string) {
    Toast.show(message, "success");
  }

  static error(message: string) {
    Toast.show(message, "error");
  }

  static warning(message: string) {
    Toast.show(message, "warning");
  }

  static info(message: string) {
    Toast.show(message, "info");
  }
}
