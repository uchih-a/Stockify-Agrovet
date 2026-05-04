import axiosInstance from '@/api/axiosInstance';
import { buildQueryParams, withFallback } from '@/api/apiHelpers';
import { localProducts } from '@/api/localDb';
import useAuthStore from '@/store/authStore';

const productApi = {
  getAllProducts: async (params = {}) =>
    withFallback(
      () => axiosInstance.get('/products', { params: buildQueryParams(params) }),
      () => localProducts.list(params),
    ),

  getProductById: async (id) =>
    withFallback(
      () => axiosInstance.get(`/products/${id}`),
      () => localProducts.getById(id),
    ),

  createProduct: async (data) =>
    withFallback(
      () => axiosInstance.post('/products', data),
      () => localProducts.create(data, useAuthStore.getState().user),
    ),

  updateProduct: async (id, data) =>
    withFallback(
      () => axiosInstance.put(`/products/${id}`, data),
      () => localProducts.update(id, data),
    ),

  deleteProduct: async (id) =>
    withFallback(
      () => axiosInstance.delete(`/products/${id}`),
      () => localProducts.remove(id),
    ),

  uploadProductImages: async (id, formData) =>
    withFallback(
      () =>
        axiosInstance.post(`/products/${id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
      () => localProducts.uploadImages(id, Array.from(formData.getAll('images'))),
    ),

  deleteProductImage: async (id, imgId) =>
    withFallback(
      () => axiosInstance.delete(`/products/${id}/images/${imgId}`),
      () => localProducts.deleteImage(id, imgId),
    ),

  getLowStockProducts: async () =>
    withFallback(
      () => axiosInstance.get('/products/low-stock'),
      () => localProducts.lowStock(),
    ),

  getExpiringProducts: async () =>
    withFallback(
      () => axiosInstance.get('/products/expiring'),
      () => localProducts.expiring(),
    ),
};

export default productApi;