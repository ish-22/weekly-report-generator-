import { apiClient } from './client';
import { User, ApiResponse } from '@/types';

export const authApi = {
    login: (data: any) => apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data),
    register: (data: any) => apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/register', data),
    getCurrentUser: () => apiClient.get<ApiResponse<User>>('/auth/me'),
};
