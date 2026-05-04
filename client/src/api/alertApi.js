import axiosInstance from '@/api/axiosInstance';
import { buildQueryParams, withFallback } from '@/api/apiHelpers';
import { localAlerts } from '@/api/localDb';
import useAuthStore from '@/store/authStore';

const alertApi = {
  getAllAlerts: async (params = {}) =>
    withFallback(
      () => axiosInstance.get('/alerts', { params: buildQueryParams(params) }),
      () => localAlerts.list(params),
    ),
  getUnreadCount: async () =>
    withFallback(
      () => axiosInstance.get('/alerts/unread-count'),
      () => ({ count: localAlerts.unreadCount() }),
    ),
  markAsRead: async (alertIds) =>
    withFallback(
      () => axiosInstance.put('/alerts/mark-read', { alertIds }),
      () => localAlerts.markAsRead(alertIds),
    ),
  resolveAlert: async (id) =>
    withFallback(
      () => axiosInstance.put(`/alerts/${id}/resolve`),
      () => localAlerts.resolve(id, useAuthStore.getState().user),
    ),
  deleteAlert: async (id) =>
    withFallback(
      () => axiosInstance.delete(`/alerts/${id}`),
      () => localAlerts.remove(id),
    ),
};

export default alertApi;
