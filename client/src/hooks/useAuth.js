import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authApi from '@/api/authApi';
import useAuthStore from '@/store/authStore';
import { ROLES, ROUTES } from '@/utils/constants';
import queryKeys from '@/utils/queryKeys';

const getRoleHome = (role) =>
  role === ROLES.FARMER ? ROUTES.FARMER_DASHBOARD : ROUTES.ADMIN_DASHBOARD;

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong.';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (payload) => {
      const user = payload.user || payload?.data?.user || payload;
      const accessToken = payload.accessToken || payload?.data?.accessToken;
      setAuth(user, accessToken);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}.`);
      navigate(getRoleHome(user.role), { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Account created. You can sign in now.');
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Signed out successfully.');
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: (error) => {
      clearAuth();
      queryClient.clear();
      toast.error(getErrorMessage(error));
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });
};

export const useForgotPassword = () =>
  useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => toast.success('Reset instructions sent if the account exists.'),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

export const useGetMe = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authApi.getMe,
    enabled: Boolean(accessToken),
    staleTime: 2 * 60 * 1000,
  });
};

export default function useAuth() {
  const auth = useAuthStore();

  return {
    ...auth,
    isAdmin: auth.user?.role === ROLES.ADMIN,
    isFarmer: auth.user?.role === ROLES.FARMER,
  };
}
