'use client';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleName, Report, ReportStatus, User } from '@/types';
import { usersApi, reportsApi } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, User as UserIcon, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export default function ProfilePage() {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({ fullName: '', email: '' });
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            setFormData({ fullName: user.fullName, email: user.email });

            const fetchMyStats = async () => {
                try {
                    const res = await reportsApi.getMyReports({ limit: 100 });
                    if (res.success && res.data) {
                        const data = Array.isArray(res.data) ? res.data : (res.data as any).items || [];
                        setReports(data);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchMyStats();
        }
    }, [user]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await usersApi.updateProfile({ fullName: formData.fullName });
            if (res.success && res.data) {
                toast({ title: 'Profile updated' });
                // The token is not updated but the user state needs upate.
                // Usually, the app re-fetches /auth/me on reload, but we can do a partial update here.
            }
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error updating profile', description: err?.message });
        } finally {
            setSaving(false);
        }
    };

    if (!user) return null;

    const numSubmitted = reports.filter(r => r.status === ReportStatus.SUBMITTED).length;
    const numApproved = reports.filter(r => r.status === ReportStatus.APPROVED).length;
    const numNeedsCorrection = reports.filter(r => r.status === ReportStatus.NEEDS_CORRECTION).length;
    const total = reports.length;

    return (
        <ProtectedRoute allowedRoles={[RoleName.TEAM_MEMBER, RoleName.MANAGER, RoleName.ADMIN]}>
            <AppLayout>
                <div className="space-y-6 max-w-5xl mx-auto">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                        <p className="text-muted-foreground mt-1">Manage your account settings and view your performance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="md:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Details</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center text-center">
                                    <Avatar className="h-24 w-24 mb-4">
                                        <AvatarImage src={user.avatarUrl || ''} />
                                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                            {user.fullName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-xl font-semibold">{user.fullName}</h3>
                                    <p className="text-muted-foreground text-sm">{user.email}</p>
                                    <p className="mt-2 text-xs font-semibold px-2 py-1 bg-slate-100 rounded-full">{user.role?.name}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Edit Profile</CardTitle></CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSaveProfile} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input
                                                value={formData.fullName}
                                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input value={formData.email} disabled className="bg-slate-50 text-slate-500" />
                                            <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
                                        </div>
                                        <Button type="submit" disabled={saving} className="w-full">
                                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                            Save Changes
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Performance Overview</CardTitle></CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="flex justify-center p-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                                    ) : (
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="border rounded-lg p-4 bg-slate-50 flex flex-col items-center">
                                                <FileText className="h-6 w-6 text-slate-400 mb-2" />
                                                <span className="text-2xl font-bold">{total}</span>
                                                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total Reports</span>
                                            </div>
                                            <div className="border border-green-100 rounded-lg p-4 bg-green-50 flex flex-col items-center">
                                                <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                                                <span className="text-2xl font-bold text-green-700">{numApproved}</span>
                                                <span className="text-xs text-green-600 uppercase tracking-wider mt-1">Approved</span>
                                            </div>
                                            <div className="border border-blue-100 rounded-lg p-4 bg-blue-50 flex flex-col items-center">
                                                <UserIcon className="h-6 w-6 text-blue-500 mb-2" />
                                                <span className="text-2xl font-bold text-blue-700">{numSubmitted}</span>
                                                <span className="text-xs text-blue-600 uppercase tracking-wider mt-1">Pending</span>
                                            </div>
                                            <div className="border border-red-100 rounded-lg p-4 bg-red-50 flex flex-col items-center">
                                                <AlertCircle className="h-6 w-6 text-red-500 mb-2" />
                                                <span className="text-2xl font-bold text-red-700">{numNeedsCorrection}</span>
                                                <span className="text-xs text-red-600 uppercase tracking-wider mt-1">Corrections</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto m-6" />
                                    ) : reports.length === 0 ? (
                                        <p className="text-muted-foreground text-center p-4">No recent activity.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {reports.slice(0, 5).map(report => (
                                                <div key={report.id} className="flex justify-between items-center p-3 border rounded hover:bg-slate-50 transition-colors">
                                                    <div>
                                                        <p className="font-medium">Report {format(new Date(report.weekStartDate), 'MMM d')} - {format(new Date(report.weekEndDate), 'MMM d')}</p>
                                                        <p className="text-xs text-muted-foreground">Updated {format(new Date(report.updatedAt), 'MMM d, yyyy')}</p>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                                   ${report.status === ReportStatus.APPROVED ? 'bg-green-100 text-green-700' :
                                                            report.status === ReportStatus.NEEDS_CORRECTION ? 'bg-red-100 text-red-700' :
                                                                report.status === ReportStatus.SUBMITTED ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}
                                `}>
                                                        {report.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            </AppLayout>
        </ProtectedRoute>
    );
}
