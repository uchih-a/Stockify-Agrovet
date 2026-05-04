import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import chatApi from '@/api/chatApi';
import queryKeys from '@/utils/queryKeys';

const errorMessage = (error) => error?.response?.data?.message || error?.message || 'Chat request failed.';

export const useGetChatHistory = (params = {}) =>
  useQuery({
    queryKey: queryKeys.chat.history(params),
    queryFn: () => chatApi.getChatHistory(params),
    placeholderData: (previous) => previous,
  });

export const useGetChatSession = (sessionId) =>
  useQuery({
    queryKey: queryKeys.chat.session(sessionId),
    queryFn: () => chatApi.getChatSession(sessionId),
    enabled: Boolean(sessionId),
  });

export const useSendMessage = () =>
  useMutation({
    mutationFn: chatApi.sendMessage,
    onError: (error) => toast.error(errorMessage(error)),
  });

export const useRateMessage = () =>
  useMutation({
    mutationFn: ({ messageId, rating }) => chatApi.rateMessage(messageId, rating),
    onError: (error) => toast.error(errorMessage(error)),
  });

export const useDeleteChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.deleteChatSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat'] });
      toast.success('Chat session deleted.');
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
};
