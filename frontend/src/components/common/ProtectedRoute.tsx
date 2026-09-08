'use client';
import { useAuth } from '@/contexts/AuthContext';
import { RoleName } from '@/types';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: RoleName[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, loading, hasRole } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const hasAccess = allowedRoles ? hasRole(allowedRoles) : true;
    const allowedRolesStr = allowedRoles?.join(',');

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            } else if (!hasAccess) {
                router.push('/');
            }
        }
    }, [user, loading, allowedRolesStr, router, pathname, hasAccess]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || (allowedRoles && !hasRole(allowedRoles))) {
        return null;
    }

    return <>{children}</>;
};
