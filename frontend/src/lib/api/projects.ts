import { apiClient } from './client';
import { Project, ApiResponse, PaginatedData } from '@/types';

export const projectsApi = {
    getProjects: (params?: any) => {
        const cleanParams = Object.fromEntries(Object.entries(params || {}).filter(([_, v]) => v !== undefined));
        const query = new URLSearchParams(cleanParams as any).toString();
        return apiClient.get<ApiResponse<PaginatedData<Project>>>(`/projects${query ? `?${query}` : ''}`);
    },
    getAllActiveProjects: () => apiClient.get<ApiResponse<Project[]>>('/projects'),
    getProject: (id: string) => apiClient.get<ApiResponse<Project>>(`/projects/${id}`),
    createProject: (data: any) => apiClient.post<ApiResponse<Project>>('/projects', data),
    updateProject: (id: string, data: any) => apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data),
    deleteProject: (id: string) => apiClient.delete<ApiResponse<Project>>(`/projects/${id}`),
};
