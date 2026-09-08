import { apiClient } from './client';
import { Report, ApiResponse, PaginatedData, ReportVersion } from '@/types';

export const reportsApi = {
    createDraft: (data: any) => apiClient.post<ApiResponse<Report>>('/reports', data),
    getMyReports: (params?: any) => {
        const cleanParams = Object.fromEntries(Object.entries(params || {}).filter(([_, v]) => v !== undefined));
        const query = new URLSearchParams(cleanParams as any).toString();
        return apiClient.get<ApiResponse<PaginatedData<Report>>>(`/reports/my-reports${query ? `?${query}` : ''}`);
    },
    getReport: (id: string) => apiClient.get<ApiResponse<Report>>(`/reports/${id}`),
    updateReport: (id: string, data: any) => apiClient.put<ApiResponse<Report>>(`/reports/${id}`, data),
    submitReport: (id: string) => apiClient.post<ApiResponse<Report>>(`/reports/${id}/submit`, {}),
    getVersions: (id: string) => apiClient.get<ApiResponse<ReportVersion[]>>(`/reports/${id}/versions`),
    getVersionDetail: (id: string, versionNumber: string) => apiClient.get<ApiResponse<ReportVersion>>(`/reports/${id}/versions/${versionNumber}`),
};
