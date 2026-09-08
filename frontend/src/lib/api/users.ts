import { apiClient } from './client';
import { User, ApiResponse, PaginatedData, RoleName } from '@/types';

export const usersApi = {
    getUsers: (params?: any) => {
        const cleanParams = Object.fromEntries(Object.entries(params || {}).filter(([_, v]) => v !== undefined));
        const query = new URLSearchParams(cleanParams as any).toString();
        return apiClient.get<ApiResponse<PaginatedData<User>>>(`/users${query ? `?${query}` : ''}`);
    },
    getUser: (id: string) => apiClient.get<ApiResponse<User>>(`/users/${id}`),
    createUser: (data: any) => apiClient.post<ApiResponse<User>>('/users', data),
    updateUserRole: (id: string, role: RoleName) => apiClient.patch<ApiResponse<User>>(`/users/${id}/role`, { role }),
    updateUserStatus: (id: string, isActive: boolean) => apiClient.patch<ApiResponse<User>>(`/users/${id}/status`, { isActive }),
    updateProfile: (data: any) => apiClient.put<ApiResponse<User>>('/users/profile', data),
};
