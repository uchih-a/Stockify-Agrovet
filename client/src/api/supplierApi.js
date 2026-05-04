import axiosInstance from '@/api/axiosInstance';
import { buildQueryParams, withFallback } from '@/api/apiHelpers';
import { localSuppliers } from '@/api/localDb';

const supplierApi = {
  getAllSuppliers: async (params = {}) =>
    withFallback(
      () => axiosInstance.get('/suppliers', { params: buildQueryParams(params) }),
      () => localSuppliers.list(params),
    ),
  getSupplierById: async (id) =>
    withFallback(
      () => axiosInstance.get(`/suppliers/${id}`),
      () => localSuppliers.getById(id),
    ),
  createSupplier: async (data) =>
    withFallback(
      () => axiosInstance.post('/suppliers', data),
      () => localSuppliers.create(data),
    ),
  updateSupplier: async (id, data) =>
    withFallback(
      () => axiosInstance.put(`/suppliers/${id}`, data),
      () => localSuppliers.update(id, data),
    ),
  deleteSupplier: async (id) =>
    withFallback(
      () => axiosInstance.delete(`/suppliers/${id}`),
      () => localSuppliers.remove(id),
    ),
  getSupplierProducts: async (id) =>
    withFallback(
      () => axiosInstance.get(`/suppliers/${id}/products`),
      () => localSuppliers.products(id),
    ),
};

export default supplierApi;
