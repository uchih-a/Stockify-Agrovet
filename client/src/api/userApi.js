import axiosInstance from '@/api/axiosInstance';
import { buildQueryParams, withFallback } from '@/api/apiHelpers';
import { localUsers } from '@/api/localDb';

const userApi = {
  getAllUsers: async (params = {}) =>
    withFallback(
      () => axiosInstance.get('/users', { params: buildQueryParams(params) }),
      () => localUsers.list(params),
    ),
  getUserById: async (id) =>
    withFallback(
      () => axiosInstance.get(`/users/${id}`),
      () => localUsers.getById(id),
    ),
  createUser: async (data) =>
    withFallback(
      () => axiosInstance.post('/users', data),
      () => localUsers.create(data),
    ),
  updateUser: async (id, data) =>
    withFallback(
      () => axiosInstance.put(`/users/${id}`, data),
      () => localUsers.update(id, data),
    ),
  deleteUser: async (id) =>
    withFallback(
      () => axiosInstance.delete(`/users/${id}`),
      () => localUsers.remove(id),
    ),
  uploadProfilePic: async (id, formData) =>
    withFallback(
      () =>
        axiosInstance.post(`/users/${id}/profile-pic`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
      () => localUsers.uploadProfilePic(id, formData.get('profilePic')),
    ),
  getFarmerStats: async (id) =>
    withFallback(
      () => axiosInstance.get(`/users/${id}/stats`),
      () => localUsers.farmerStats(id),
    ),
};

export default userApi;
