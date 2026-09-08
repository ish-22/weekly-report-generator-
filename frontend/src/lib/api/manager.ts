import { apiClient } from './client';
import { Report, ApiResponse, PaginatedData } from '@/types';

export const managerApi = {
    getTeamReports: (params?: any) => {
        const cleanParams = Object.fromEntries(Object.entries(params || {}).filter(([_, v]) => v !== undefined));
        const query = new URLSearchParams(cleanParams as any).toString();
        return apiClient.get<ApiResponse<PaginatedData<Report>>>(`/manager/reports${query ? `?${query}` : ''}`);
    },
    getReportDetail: (id: string) => apiClient.get<ApiResponse<Report>>(`/manager/reports/${id}`),
    approveReport: (id: string, data?: { comment?: string }) => apiClient.post<ApiResponse<Report>>(`/manager/reports/${id}/approve`, data || {}),
    requestChanges: (id: string, data: { comment: string }) => apiClient.post<ApiResponse<Report>>(`/manager/reports/${id}/request-changes`, data),
};
