'use client';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleName, Report, ReportStatus, Project, PaginatedData, User } from '@/types';
import { dashboardApi, managerApi, projectsApi } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import NextLink from 'next/link';
import { format } from 'date-fns';

export default function ManagerDashboardPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [reports, setReports] = useState<PaginatedData<Report> | null>(null);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [projectFilter, setProjectFilter] = useState<string>('all');
    const [page, setPage] = useState(1);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [metricsRes, reportsRes, projectsRes] = await Promise.all([
                dashboardApi.getMetrics(),
                managerApi.getTeamReports({ page, status: statusFilter !== 'all' ? statusFilter : undefined, projectId: projectFilter !== 'all' ? projectFilter : undefined }),
                projectsApi.getAllActiveProjects()
            ]);

            if (metricsRes.success) setMetrics(metricsRes.data);
            if (reportsRes.success) setReports(reportsRes.data as PaginatedData<Report>);
            if (projectsRes.success) setProjects(projectsRes.data as Project[]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [page, statusFilter, projectFilter]);

    const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444'];

    const getStatusBadge = (status: ReportStatus) => {
        switch (status) {
            case ReportStatus.DRAFT: return <Badge variant="outline" className="text-slate-500">Draft</Badge>;
            case ReportStatus.SUBMITTED: return <Badge className="bg-blue-500">Pending Review</Badge>;
            case ReportStatus.NEEDS_CORRECTION: return <Badge variant="destructive">Needs Correction</Badge>;
            case ReportStatus.APPROVED: return <Badge className="bg-green-500">Approved</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <ProtectedRoute allowedRoles={[RoleName.MANAGER, RoleName.ADMIN]}>
            <AppLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Overview of team performance and pending reports.</p>
                    </div>

                    {loading && !metrics ? (
                        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{metrics?.pendingReports || 0}</div>
                                        <p className="text-xs text-muted-foreground mt-1">Reports awaiting approval</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{metrics?.complianceRate || 0}%</div>
                                        <p className="text-xs text-muted-foreground mt-1">Team members submitted on time</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Needs Correction</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-orange-600">{metrics?.needsCorrection || 0}</div>
                                        <p className="text-xs text-muted-foreground mt-1">Reports returned to team</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Open Blockers</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-red-600">{metrics?.openBlockers || 0}</div>
                                        <p className="text-xs text-muted-foreground mt-1">Key blockers reported this week</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader><CardTitle>Report Status Distribution</CardTitle></CardHeader>
                                    <CardContent className="h-[300px]">
                                        {metrics?.statusDistribution && metrics.statusDistribution.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={metrics.statusDistribution}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="count"
                                                        nameKey="status"
                                                    >
                                                        {metrics.statusDistribution.map((entry: any, index: number) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader><CardTitle>Workload by Project</CardTitle></CardHeader>
                                    <CardContent className="h-[300px]">
                                        {metrics?.projectWorkload && metrics.projectWorkload.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={metrics.projectWorkload}>
                                                    <XAxis dataKey="projectName" fontSize={12} tickLine={false} axisLine={false} />
                                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                                    <Tooltip />
                                                    <Bar dataKey="hours" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Report Table */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                                    <CardTitle>Team Reports</CardTitle>
                                    <div className="flex space-x-2 items-center">
                                        <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val || 'all'); setPage(1); }}>
                                            <SelectTrigger className="w-[150px] h-8"><SelectValue placeholder="Status" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="SUBMITTED">Pending Review</SelectItem>
                                                <SelectItem value="APPROVED">Approved</SelectItem>
                                                <SelectItem value="NEEDS_CORRECTION">Needs Correction</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={projectFilter} onValueChange={(val) => { setProjectFilter(val || 'all'); setPage(1); }}>
                                            <SelectTrigger className="w-[150px] h-8"><SelectValue placeholder="Project" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Projects</SelectItem>
                                                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 border-b text-slate-500">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium">Team Member</th>
                                                    <th className="px-6 py-3 font-medium">Week</th>
                                                    <th className="px-6 py-3 font-medium">Project</th>
                                                    <th className="px-6 py-3 font-medium">Status</th>
                                                    <th className="px-6 py-3 font-medium text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y text-slate-700 bg-white">
                                                {reports?.items.map(report => (
                                                    <tr key={report.id} className="hover:bg-slate-50">
                                                        <td className="px-6 py-4 font-medium">{report.user?.fullName}</td>
                                                        <td className="px-6 py-4">{format(new Date(report.weekStartDate), 'MMM d')} - {format(new Date(report.weekEndDate), 'MMM d, yy')}</td>
                                                        <td className="px-6 py-4">{report.project?.name}</td>
                                                        <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <NextLink href={`/manager/reports/${report.id}`}>
                                                                <Button variant="outline" size="sm">Review</Button>
                                                            </NextLink>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {reports?.items.length === 0 && (
                                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No reports match the current filters.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex items-center justify-between px-6 py-4 border-t">
                                        <div className="text-sm text-slate-500">
                                            Showing page {reports?.page} of {reports?.totalPages || 1}
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
                                                disabled={page === (reports?.totalPages || 1) || loading}
                                                onClick={() => setPage(page + 1)}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </AppLayout>
        </ProtectedRoute>
    );
}
