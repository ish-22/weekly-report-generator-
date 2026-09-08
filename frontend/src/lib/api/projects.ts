import { apiClient } from './client';
import { Project, ApiResponse, PaginatedData } from '@/types';

export const projectsApi = {
    getProjects: (params?: any) => {
        const query = new URLSearchParams(params).toString();
        return apiClient.get<ApiResponse<PaginatedData<Project>>>(`/projects${query ? `?${query}` : ''}`);
    },
    getAllActiveProjects: () => apiClient.get<ApiResponse<Project[]>>('/projects/all/active'),
    getProject: (id: string) => apiClient.get<ApiResponse<Project>>(`/projects/${id}`),
    createProject: (data: any) => apiClient.post<ApiResponse<Project>>('/projects', data),
    updateProject: (id: string, data: any) => apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data),
    deleteProject: (id: string) => apiClient.delete<ApiResponse<Project>>(`/projects/${id}`),
};
