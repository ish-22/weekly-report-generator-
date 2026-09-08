import { apiClient } from './client';
import { Report, ApiResponse, PaginatedData } from '@/types';

export const managerApi = {
    getTeamReports: (params?: any) => {
        const query = new URLSearchParams(params).toString();
        return apiClient.get<ApiResponse<PaginatedData<Report>>>(`/manager/reports${query ? `?${query}` : ''}`);
    },
    getReportDetail: (id: string) => apiClient.get<ApiResponse<Report>>(`/manager/reports/${id}`),
    approveReport: (id: string, data?: { comment?: string }) => apiClient.post<ApiResponse<Report>>(`/manager/reports/${id}/approve`, data || {}),
    requestChanges: (id: string, data: { comment: string }) => apiClient.post<ApiResponse<Report>>(`/manager/reports/${id}/request-changes`, data),
};
