import { apiClient } from './client';
import { ApiResponse } from '@/types';

export const dashboardApi = {
    getMetrics: () => apiClient.get<ApiResponse<any>>('/dashboard/metrics'),
    getAnalytics: () => apiClient.get<ApiResponse<any>>('/dashboard/analytics'),
};
