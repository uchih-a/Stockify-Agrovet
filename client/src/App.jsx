import { useEffect } from 'react';
import authApi from '@/api/authApi';
import useAuthStore from '@/store/authStore';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';

export function App() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const syncUser = async () => {
      if (!accessToken) return;

      try {
        const user = await authApi.getMe();
        setAuth(user, accessToken);
      } catch (error) {
        if (String(accessToken).startsWith('local-')) return;
        clearAuth();
      }
    };

    syncUser();
  }, [accessToken, clearAuth, setAuth]);

  return <RouterProvider router={router} />;
}

export default App;
