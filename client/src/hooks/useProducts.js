import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import productApi from '@/api/productApi';
import queryKeys from '@/utils/queryKeys';

const errorMessage = (error) => error?.response?.data?.message || error?.message || 'Unable to complete request.';

export const useGetProducts = (params = {}) =>
  useQuery({
    queryKey: queryKeys.products.all(params),
    queryFn: () => productApi.getAllProducts(params),
    placeholderData: (previous) => previous,
  });

export const useGetProduct = (id) =>
  useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productApi.getProductById(id),
    enabled: Boolean(id),
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Product saved successfully.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => productApi.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Product updated successfully.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Product deleted successfully.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

export const useGetLowStockProducts = () =>
  useQuery({
    queryKey: queryKeys.products.lowStock(),
    queryFn: productApi.getLowStockProducts,
  });

export const useGetExpiringProducts = () =>
  useQuery({
    queryKey: queryKeys.products.expiring(),
    queryFn: productApi.getExpiringProducts,
  });

export const useUploadProductImages = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => productApi.uploadProductImages(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Images uploaded successfully.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};
