import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import {
  DASHBOARD,
  HOME,
  LOGIN,
  SIGN_UP,
} from '../../utils/constants/routes.constants';
import { showToast } from '../../utils/toast';

const Header = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const menuItems = [
    {
      id: 1,
      name: 'Home',
      link: HOME,
    },
    {
      id: 2,
      name: 'Login',
      link: LOGIN,
    },
    {
      id: 3,
      name: 'Sign Up',
      link: SIGN_UP,
    },
  ];

  const handleLogout = async () => {
    showToast('Logging out...');
    try {
      await signOut();
      showToast('You are now logged out');
      router.push(LOGIN);
    } catch (error: any) {
      showToast(error.message, false);
    }
  };

  return (
    <>
      <header className='bg-slate-950 flex flex-wrap container mx-auto max-w-full items-center p-6 justify-between shadow-md sticky top-0 z-50'>
        <div className='flex items-center text-white hover:text-green-500 cursor-pointer transition duration-150 '>
          <Link href={HOME} legacyBehavior>
            <span className='transitionfont-semibold text-4xl font-sans ml-5'>
              ShiftScribe
            </span>
          </Link>
        </div>

        <nav className={`md:flex md:items-center font-title w-full md:w-auto`}>
          <ul className='text-lg inline-block'>
            <>
              {!user ? (
                menuItems
                  .filter((item) => item.link !== router.pathname)
                  .map((item) => (
                    <li
                      key={item.id}
                      className='my-3 md:my-0 items-center mr-8 md:inline-block block'
                    >
                      <Link href={item?.link} legacyBehavior>
                        <a
                          href=''
                          className='text-white hover:text-green-500 transition'
                        >
                          {item?.name}
                        </a>
                      </Link>
                    </li>
                  ))
              ) : (
                <>
                  <li className='my-3 md:my-0 items-center mr-4 md:inline-block block '>
                    <Link href={DASHBOARD} legacyBehavior>
                      <a
                        href=''
                        className='text-white hover:text-green-500 transition'
                      >
                        Dashboard
                      </a>
                    </Link>
                  </li>
                  <li className='my-3 md:my-0 items-center mr-4 md:inline-block block '>
                    <a
                      onClick={handleLogout}
                      className='text-white hover:text-green-500 transition cursor-pointer'
                    >
                      Logout
                    </a>
                  </li>
                </>
              )}
            </>
          </ul>
        </nav>
      </header>
      {children}
    </>
  );
};

export default Header;
