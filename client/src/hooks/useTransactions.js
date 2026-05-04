import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import transactionApi from '@/api/transactionApi';
import queryKeys from '@/utils/queryKeys';

const errorMessage = (error) => error?.response?.data?.message || error?.message || 'Transaction request failed.';

export const useGetTransactions = (params = {}) =>
  useQuery({
    queryKey: queryKeys.transactions.all(params),
    queryFn: () => transactionApi.getAllTransactions(params),
    placeholderData: (previous) => previous,
  });

export const useGetMyTransactions = (params = {}) =>
  useQuery({
    queryKey: queryKeys.transactions.my(params),
    queryFn: () => transactionApi.getMyTransactions(params),
    placeholderData: (previous) => previous,
  });

export const useGetTransaction = (id) =>
  useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: () => transactionApi.getTransactionById(id),
    enabled: Boolean(id),
  });

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Transaction recorded.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};
