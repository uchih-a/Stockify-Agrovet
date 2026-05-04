import axiosInstance from '@/api/axiosInstance';
import { buildQueryParams, withFallback } from '@/api/apiHelpers';
import { localChat } from '@/api/localDb';
import useAuthStore from '@/store/authStore';

const chatApi = {
  sendMessage: async (data) =>
    withFallback(
      () => axiosInstance.post('/chat', data),
      () => localChat.send(data, useAuthStore.getState().user),
    ),
  getChatHistory: async (params = {}) =>
    withFallback(
      () => axiosInstance.get('/chat/history', { params: buildQueryParams(params) }),
      () => localChat.history(params, useAuthStore.getState().user),
    ),
  getChatSession: async (sessionId) =>
    withFallback(
      () => axiosInstance.get(`/chat/session/${sessionId}`),
      () => localChat.session(sessionId),
    ),
  rateMessage: async (messageId, rating) =>
    withFallback(
      () => axiosInstance.post(`/chat/rate/${messageId}`, { feedbackRating: rating }),
      () => localChat.rate(messageId, rating),
    ),
  bookmarkMessage: async (messageId) =>
    withFallback(
      () => axiosInstance.post(`/chat/bookmark/${messageId}`),
      () => localChat.bookmark(messageId),
    ),
  deleteChatSession: async (sessionId) =>
    withFallback(
      () => axiosInstance.delete(`/chat/session/${sessionId}`),
      () => localChat.removeSession(sessionId),
    ),
};

export default chatApi;
