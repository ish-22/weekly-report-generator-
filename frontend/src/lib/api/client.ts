import Cookies from 'js-cookie';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
    private getHeaders(): HeadersInit {
        const token = Cookies.get('token');
        return {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        const data = await response.json();
        if (!response.ok) {
            if (response.status === 401) {
                Cookies.remove('token');
                if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login';
                }
            }
            throw data;
        }
        return data;
    }

    async get<T>(url: string): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
    }

    async post<T>(url: string, body: any): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    }

    async put<T>(url: string, body: any): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    }

    async delete<T>(url: string): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
    }
}

export const apiClient = new ApiClient();
