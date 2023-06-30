import { useRouter } from 'next/router';
import SubmitButton from '../../components/form-components/SubmitButton';
import ProtectedRoute from '../../components/protected-route';
import { useAuth } from '../../context/AuthContext';
import { PermissionLevel } from '../../lib';
import { LOGIN, RECORDS } from '../../utils/constants/routes.constants';
import { showToast } from '../../utils/toast';

const DashboardPage = () => {
  const auth = useAuth();
  const router = useRouter();

  const onClick = () => {
    auth.permissionLevel >= PermissionLevel.MANAGER
      ? router.push(RECORDS)
      : router.back();
  };

  const handleLogout = async () => {
    showToast('Logging out...');
    try {
      await auth.signOut();
      showToast('You are now logged out');
      router.push(LOGIN);
    } catch (error: any) {
      showToast(error.message, false);
    }
  };

  return (
    <ProtectedRoute>
      <div className='flex py-2 container mx-auto'>
        <div className='text-gray-600 flex flex-col justify-center items-center px-12 py-24 mx-auto'>
          <p className='text-2xl text-white font-semibold'>{`Welcome ${auth.user?.displayName}`}</p>

          {auth.permissionLevel >= PermissionLevel.MANAGER ? (
            <SubmitButton
              message={'Click Here To Manage Records'}
              onClick={onClick}
            />
          ) : (
            <>
              <p className='text-2xl text-white font-semibold'>
                Unable to access this page without proper permissions
              </p>
              <SubmitButton
                message={'Click Here To Logout'}
                onClick={handleLogout}
              />
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
