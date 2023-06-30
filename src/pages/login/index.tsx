import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { FormInput } from '../../components/form-components/FormInput';
import SubmitButton from '../../components/form-components/SubmitButton';
import { useAuth } from '../../context/AuthContext';
import { DASHBOARD } from '../../utils/constants/routes.constants';
import { loginSchema } from '../../validations/login.validation';

const LoginPage = () => {
  type FormData = Yup.InferType<typeof loginSchema>;

  const { signIn } = useAuth();
  const router = useRouter();

  const methods = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(loginSchema),
  });
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = methods;

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading('Logging in...');
    try {
      await signIn(data.email, data.password);
      toast.success('Successfully logged in!', { id: toastId });
      router.push(DASHBOARD);
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div className='flex justify-center items-center'>
      <div
        className='sign-up-form container mx-auto w-96 border-2 bg-gray-400 border-gray-400 rounded-md'
        style={{ marginTop: '20%' }}
      >
        <h2 className='px-12 mt-8 text-center text-2xl font-semibold text-blue-900'>
          Welcome
        </h2>
        <FormProvider {...methods}>
          <form
            action=''
            className='w-80 mx-auto pb-12 px-4'
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormInput
              label='Email'
              name='email'
              type='email'
              formOptions={loginSchema.fields.email}
              errors={errors.email}
            />
            <FormInput
              label='Password'
              name='password'
              type='password'
              formOptions={loginSchema.fields.password}
              errors={errors.password}
            />
            <SubmitButton message={'Sign In'} disabled={isSubmitting} />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default LoginPage;
