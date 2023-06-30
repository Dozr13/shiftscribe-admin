// utils/auth.ts
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { LOGIN } from '../../utils/constants/routes.constants';

export const useLogout = () => {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const toastId = toast.loading('Logging out...');
    try {
      await auth.signOut();
      toast.success('You are now logged out', { id: toastId });
      router.push(LOGIN);
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  return handleLogout;
};
