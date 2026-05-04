import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import alertApi from '@/api/alertApi';
import useAlertStore from '@/store/alertStore';
import queryKeys from '@/utils/queryKeys';

const errorMessage = (error) => error?.response?.data?.message || error?.message || 'Alert request failed.';

export const useGetAlerts = (params = {}) =>
  useQuery({
    queryKey: queryKeys.alerts.all(params),
    queryFn: () => alertApi.getAllAlerts(params),
    placeholderData: (previous) => previous,
  });

export const useGetUnreadCount = () =>
  useQuery({
    queryKey: queryKeys.alerts.unreadCount(),
    queryFn: alertApi.getUnreadCount,
    refetchInterval: 60000,
  });

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const setUnreadCount = useAlertStore((state) => state.setUnreadCount);

  return useMutation({
    mutationFn: alertApi.markAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['alerts'] });
      const unread = await alertApi.getUnreadCount();
      setUnreadCount(unread.count ?? unread);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

export const useResolveAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: alertApi.resolveAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Alert resolved.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};

export const useDeleteAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: alertApi.deleteAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Alert deleted.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};
