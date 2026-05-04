import { useQuery } from '@tanstack/react-query';
import reportApi from '@/api/reportApi';
import queryKeys from '@/utils/queryKeys';

export const useGetSalesSummary = (params = {}) =>
  useQuery({
    queryKey: queryKeys.reports.sales(params),
    queryFn: () => reportApi.getSalesSummary(params),
    placeholderData: (previous) => previous,
  });

export const useGetInventorySnapshot = () =>
  useQuery({
    queryKey: queryKeys.reports.inventory(),
    queryFn: reportApi.getInventorySnapshot,
  });

export const useGetFarmerActivityReport = (params = {}) =>
  useQuery({
    queryKey: queryKeys.reports.farmers(params),
    queryFn: () => reportApi.getFarmerActivityReport(params),
    placeholderData: (previous) => previous,
  });

export const useGetChatbotStats = () =>
  useQuery({
    queryKey: queryKeys.reports.chatbot(),
    queryFn: reportApi.getChatbotStats,
    staleTime: 0,
  });

export const useGetGeminiInsights = () =>
  useQuery({
    queryKey: queryKeys.reports.insights(),
    queryFn: reportApi.getGeminiInsights,
    staleTime: 0,
    enabled: false,
  });
