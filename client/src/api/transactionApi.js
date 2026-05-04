import axiosInstance from '@/api/axiosInstance';
import { buildQueryParams, withFallback } from '@/api/apiHelpers';
import { localTransactions } from '@/api/localDb';
import useAuthStore from '@/store/authStore';

const transactionApi = {
  getAllTransactions: async (params = {}) =>
    withFallback(
      () => axiosInstance.get('/transactions', { params: buildQueryParams(params) }),
      () => localTransactions.list(params),
    ),
  getMyTransactions: async (params = {}) =>
    withFallback(
      () => axiosInstance.get('/transactions/my', { params: buildQueryParams(params) }),
      () => localTransactions.list(params, useAuthStore.getState().user, true),
    ),
  getTransactionById: async (id) =>
    withFallback(
      () => axiosInstance.get(`/transactions/${id}`),
      () => localTransactions.getById(id),
    ),
  createTransaction: async (data) =>
    withFallback(
      () => axiosInstance.post('/transactions', data),
      () => localTransactions.create(data, useAuthStore.getState().user),
    ),
};

export default transactionApi;
