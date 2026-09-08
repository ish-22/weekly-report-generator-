'use client';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleName, Report, ReportStatus, PaginatedData } from '@/types';
import { reportsApi } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import NextLink from 'next/link';

export default function ReportsHistoryPage() {
    const [data, setData] = useState<PaginatedData<Report> | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const fetchReports = async (p = 1) => {
        setLoading(true);
        try {
            const res = await reportsApi.getMyReports({ page: p, limit: 10 });
            if (res.success && res.data) {
                const isArray = Array.isArray(res.data);
                setData({
                    items: isArray ? res.data as any : (res.data as any).items || [],
                    total: res.meta?.total || 0,
                    page: res.meta?.page || 1,
                    limit: res.meta?.limit || 10,
                    totalPages: res.meta?.totalPages || 1
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports(page);
    }, [page]);

    const getStatusBadge = (status: ReportStatus) => {
        switch (status) {
            case ReportStatus.DRAFT: return <Badge variant="outline" className="text-slate-500">Draft</Badge>;
            case ReportStatus.SUBMITTED: return <Badge className="bg-blue-500 hover:bg-blue-600">Submitted</Badge>;
            case ReportStatus.NEEDS_CORRECTION: return <Badge variant="destructive">Needs Correction</Badge>;
            case ReportStatus.APPROVED: return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <ProtectedRoute allowedRoles={[RoleName.TEAM_MEMBER, RoleName.MANAGER, RoleName.ADMIN]}>
            <AppLayout>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Report History</h1>
                            <p className="text-muted-foreground mt-1">View all your past and current weekly reports.</p>
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="outline" size="icon" onClick={() => fetchReports(page)} disabled={loading}>
                                <RefreshCcw className="h-4 w-4" />
                            </Button>
                            <NextLink href="/reports/new">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> New Report
                                </Button>
                            </NextLink>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            {loading && !data ? (
                                <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 border-b">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium text-slate-500">Week</th>
                                                    <th className="px-6 py-3 font-medium text-slate-500">Project</th>
                                                    <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                                                    <th className="px-6 py-3 font-medium text-slate-500">Updated</th>
                                                    <th className="px-6 py-3 font-medium text-slate-500 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y text-slate-700 bg-white">
                                                {data?.items.map((report) => (
                                                    <tr key={report.id} className="hover:bg-slate-50">
                                                        <td className="px-6 py-4 font-medium">
                                                            {format(new Date(report.weekStartDate), 'MMM d, yyyy')} - {format(new Date(report.weekEndDate), 'MMM d, yyyy')}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {report.project?.name || 'Unknown'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {getStatusBadge(report.status)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {format(new Date(report.updatedAt), 'MMM d, yyyy')}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <NextLink href={`/reports/${report.id}`}>
                                                                <Button variant="outline" size="sm">View / Edit</Button>
                                                            </NextLink>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {data?.items.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                                            No reports found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex items-center justify-between px-6 py-4 border-t">
                                        <div className="text-sm text-slate-500">
                                            Showing page {data?.page} of {data?.totalPages || 1}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={page === 1 || loading}
                                                onClick={() => setPage(page - 1)}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={page === (data?.totalPages || 1) || loading}
                                                onClick={() => setPage(page + 1)}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </ProtectedRoute>
    );
}
