'use client';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleName, User } from '@/types';
import { usersApi } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, UserMinus, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const { toast } = useToast();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Typically an admin gets all users or paginated
            const res = await usersApi.getUsers();
            if (res.success && res.data) {
                setUsers((res.data as any).items || res.data); // handles paginated or array
            }
        } catch (err) {
            toast({ variant: 'destructive', title: 'Failed to load users' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, roleName: string) => {
        try {
            await usersApi.updateUserRole(userId, roleName as RoleName);
            toast({ title: 'Role updated' });
            fetchUsers();
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error updating role', description: err?.message });
        }
    };

    const handleDeactivate = async (id: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;
        try {
            await usersApi.updateUserStatus(id, !currentStatus);
            toast({ title: `User ${currentStatus ? 'deactivated' : 'activated'}` });
            fetchUsers();
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error changing status', description: err?.message });
        }
    };

    const filteredUsers = users.filter((u) => {
        const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role?.name === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <ProtectedRoute allowedRoles={[RoleName.ADMIN]}>
            <AppLayout>
                <div className="space-y-6 max-w-6xl mx-auto">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground mt-1">Manage team members, roles, and access.</p>
                    </div>

                    <Card>
                        <CardHeader className="py-4 border-b flex flex-col sm:flex-row space-y-3 sm:space-y-0 justify-between">
                            <div className="relative max-w-sm w-full">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="pl-9"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={v => setRoleFilter(v ?? 'all')}>
                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Role" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
                                    <SelectItem value="MANAGER">Manager</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 border-b">
                                            <tr>
                                                <th className="px-6 py-3 font-medium text-slate-500">Name & Email</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Role</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Joined</th>
                                                <th className="px-6 py-3 font-medium text-slate-500 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y text-slate-700 bg-white">
                                            {filteredUsers.map(u => (
                                                <tr key={u.id} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-slate-900">{u.fullName}</div>
                                                        <div className="text-xs text-muted-foreground">{u.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Select
                                                            defaultValue={u.role?.name || ''}
                                                            onValueChange={(val) => handleRoleChange(u.id, val || '')}
                                                        >
                                                            <SelectTrigger className="h-8 max-w-[140px] text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="TEAM_MEMBER">Member</SelectItem>
                                                                <SelectItem value="MANAGER">Manager</SelectItem>
                                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                                            {u.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-muted-foreground">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <Button
                                                            variant={u.isActive ? 'outline' : 'default'}
                                                            size="sm"
                                                            className={u.isActive ? 'text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200' : ''}
                                                            onClick={() => handleDeactivate(u.id, u.isActive)}
                                                        >
                                                            <UserMinus className="h-4 w-4 mr-1" />
                                                            {u.isActive ? 'Deactivate' : 'Activate'}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredUsers.length === 0 && (
                                                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No users found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </ProtectedRoute>
    );
}
