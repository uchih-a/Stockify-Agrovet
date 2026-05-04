import axios from 'axios';
import useAuthStore from '@/store/authStore';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api/v1';

const axiosInstance = axios.create({
  baseURL: `${baseUrl}${apiPrefix}`,
  timeout: 15000,
  withCredentials: true,
});

let refreshPromise = null;

axiosInstance.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || '';
    const isAuthRoute = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh-token');

    if (status === 401 && !isAuthRoute && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios.post(
            `${baseUrl}${apiPrefix}/auth/refresh-token`,
            {},
            {
              withCredentials: true,
            },
          );
        }

        const refreshResponse = await refreshPromise;
        refreshPromise = null;

        const newToken =
          refreshResponse?.data?.data?.accessToken ??
          refreshResponse?.data?.accessToken ??
          null;

        if (!newToken) {
          throw new Error('Unable to refresh token');
        }

        useAuthStore.getState().setToken(newToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        useAuthStore.getState().clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
