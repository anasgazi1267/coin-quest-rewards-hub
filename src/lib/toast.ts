
import { toast as sonnerToast } from "sonner";

// Define the ToastOptions type to match what we're using
type ToastOptions = {
  description?: string;
  duration?: number;
};

// Re-export the toast functions with our app's styling and extended options
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, options);
  },
  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, options);
  },
  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, options);
  },
  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, options);
  }
};
