import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import supplierApi from '@/api/supplierApi';
import queryKeys from '@/utils/queryKeys';

const errorMessage = (error) => error?.response?.data?.message || error?.message || 'Supplier request failed.';

export const useGetSuppliers = (params = {}) =>
  useQuery({
    queryKey: queryKeys.suppliers.all(params),
    queryFn: () => supplierApi.getAllSuppliers(params),
    placeholderData: (previous) => previous,
  });

export const useGetSupplier = (id) =>
  useQuery({
    queryKey: queryKeys.suppliers.detail(id),
    queryFn: () => supplierApi.getSupplierById(id),
    enabled: Boolean(id),
  });

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierApi.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier created successfully.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => supplierApi.updateSupplier(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.detail(variables.id) });
      toast.success('Supplier updated successfully.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierApi.deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier deleted successfully.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

export const useGetSupplierProducts = (id) =>
  useQuery({
    queryKey: ['suppliers', 'products', id],
    queryFn: () => supplierApi.getSupplierProducts(id),
    enabled: Boolean(id),
  });
