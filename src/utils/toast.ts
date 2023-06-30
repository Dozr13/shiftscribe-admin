import { toast } from 'react-hot-toast';

export const showToast = (message: string, success: boolean = true) => {
  const toastId = toast.loading(message);
  if (success) {
    toast.success(message, { id: toastId });
  } else {
    toast.error(message, { id: toastId });
  }
};
