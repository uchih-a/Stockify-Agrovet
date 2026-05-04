import axiosInstance from '@/api/axiosInstance';
import { buildQueryParams, withFallback } from '@/api/apiHelpers';
import { localReports } from '@/api/localDb';

const reportApi = {
  getSalesSummary: async (params = {}) =>
    withFallback(
      () => axiosInstance.get('/reports/sales', { params: buildQueryParams(params) }),
      () => localReports.sales(params),
    ),
  getInventorySnapshot: async () =>
    withFallback(
      () => axiosInstance.get('/reports/inventory'),
      () => localReports.inventory(),
    ),
  getFarmerActivityReport: async (params = {}) =>
    withFallback(
      () => axiosInstance.get('/reports/farmers', { params: buildQueryParams(params) }),
      () => localReports.farmers(params),
    ),
  getChatbotStats: async () =>
    withFallback(
      () => axiosInstance.get('/reports/chatbot'),
      () => localReports.chatbot(),
    ),
  getGeminiInsights: async () =>
    withFallback(
      () => axiosInstance.get('/reports/insights'),
      () => ({ insights: localReports.insights() }),
    ),
};

export default reportApi;
