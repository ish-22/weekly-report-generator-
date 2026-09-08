import { apiClient } from './client';
import { User, ApiResponse, PaginatedData } from '@/types';

export const usersApi = {
    getUsers: (params?: any) => {
        const query = new URLSearchParams(params).toString();
        return apiClient.get<ApiResponse<PaginatedData<User>>>(`/users${query ? `?${query}` : ''}`);
    },
    getUser: (id: string) => apiClient.get<ApiResponse<User>>(`/users/${id}`),
    createUser: (data: any) => apiClient.post<ApiResponse<User>>('/users', data),
    updateUser: (id: string, data: any) => apiClient.put<ApiResponse<User>>(`/users/${id}`, data),
    updateProfile: (data: any) => apiClient.put<ApiResponse<User>>('/users/profile', data),
    deactivateUser: (id: string) => apiClient.delete<ApiResponse<User>>(`/users/${id}`),
};
