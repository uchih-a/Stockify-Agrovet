import axiosInstance from '@/api/axiosInstance';
import { extractData, withFallback } from '@/api/apiHelpers';
import { localAuth } from '@/api/localDb';

const authApi = {
  register: async (data) =>
    withFallback(
      () => axiosInstance.post('/auth/register', data),
      () =>
        localAuth.register({
          ...data,
          location: data.location || data.county,
        }),
    ),
  login: async (data) =>
    withFallback(
      () => axiosInstance.post('/auth/login', data),
      () => localAuth.login(data),
    ),
  logout: async () =>
    withFallback(
      () => axiosInstance.post('/auth/logout'),
      () => ({ success: true }),
    ),
  refreshToken: async () => {
    const response = await axiosInstance.post('/auth/refresh-token');
    return extractData(response);
  },
  forgotPassword: async (email) =>
    withFallback(
      () => axiosInstance.post('/auth/forgot-password', { email }),
      () => ({ success: true }),
    ),
  resetPassword: async (token, data) =>
    withFallback(
      () => axiosInstance.put(`/auth/reset-password/${token}`, data),
      () => ({ success: true }),
    ),
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return extractData(response);
  },
};

export default authApi;
