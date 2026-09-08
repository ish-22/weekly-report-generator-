'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleName } from '@/types';
import { authApi } from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    hasRole: (roles: RoleName[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
    hasRole: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get('token');
            if (token) {
                try {
                    const res = await authApi.getCurrentUser();
                    if (res.success && res.data) {
                        setUser(res.data);
                    } else {
                        Cookies.remove('token');
                    }
                } catch (err) {
                    Cookies.remove('token');
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = (token: string, userData: User) => {
        Cookies.set('token', token, { expires: 1 }); // 1 day
        setUser(userData);
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        router.push('/login');
    };

    const hasRole = (roles: RoleName[]) => {
        if (!user || !user.role) return false;
        return roles.includes(user.role.name);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
