'use client';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleName, Report, ReportStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { reportsApi } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import NextLink from 'next/link';

export default function DashboardPage() {
    const { user, hasRole } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await reportsApi.getMyReports({ limit: 5 });
                if (res.success && res.data) {
                    setReports(res.data.items);
                }
            } catch (err) {
                console.error('Failed to load reports', err);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const currentStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    const currentEndDate = endOfWeek(new Date(), { weekStartsOn: 1 });
    const currentWeekReport = reports.find(r =>
        new Date(r.weekStartDate).getTime() === currentStartDate.getTime()
    );

    const needsCorrectionReport = reports.find(r => r.status === ReportStatus.NEEDS_CORRECTION);

    const getStatusBadge = (status: ReportStatus) => {
        switch (status) {
            case ReportStatus.DRAFT: return <Badge variant="outline" className="text-slate-500"><Clock className="mr-1 h-3 w-3" /> Draft</Badge>;
            case ReportStatus.SUBMITTED: return <Badge className="bg-blue-500 hover:bg-blue-600">Submitted</Badge>;
            case ReportStatus.NEEDS_CORRECTION: return <Badge variant="destructive"><AlertCircle className="mr-1 h-3 w-3" /> Needs Correction</Badge>;
            case ReportStatus.APPROVED: return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="mr-1 h-3 w-3" /> Approved</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <ProtectedRoute allowedRoles={[RoleName.TEAM_MEMBER, RoleName.MANAGER, RoleName.ADMIN]}>
            <AppLayout>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <NextLink href="/reports/new">
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Weekly Report
                            </Button>
                        </NextLink>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {/* Current Week Status */}
                            <Card className="col-span-1 lg:col-span-2 shadow-sm border-slate-200">
                                <CardHeader>
                                    <CardTitle>Current Week</CardTitle>
                                    <CardDescription>
                                        {format(currentStartDate, 'MMM d')} - {format(currentEndDate, 'MMM d, yyyy')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {currentWeekReport ? (
                                        <div className="flex flex-col space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-lg">Status</span>
                                                {getStatusBadge(currentWeekReport.status)}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {currentWeekReport.achievements || "No achievements documented yet."}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-50 rounded-lg border border-dashed">
                                            <p className="text-muted-foreground">You haven&apos;t started a report for this week yet.</p>
                                            <NextLink href="/reports/new">
                                                <Button variant="outline">Create Now</Button>
                                            </NextLink>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Alerts */}
                            <Card className="shadow-sm border-slate-200">
                                <CardHeader>
                                    <CardTitle>Action Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {needsCorrectionReport ? (
                                        <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-100 flex flex-col space-y-3">
                                            <div className="flex items-start">
                                                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 text-red-500" />
                                                <div>
                                                    <h4 className="font-medium text-red-900">Correction Required</h4>
                                                    <p className="text-sm mt-1">Review feedback for week {format(new Date(needsCorrectionReport.weekStartDate), 'MMM d')}.</p>
                                                </div>
                                            </div>
                                            <NextLink href={`/reports/${needsCorrectionReport.id}`}>
                                                <Button size="sm" variant="destructive" className="w-full">View Comments & Edit</Button>
                                            </NextLink>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                            <CheckCircle className="h-12 w-12 text-slate-200 mb-2" />
                                            <p className="text-slate-500 text-sm">All caught up! No pending actions.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Reports */}
                            <Card className="col-span-1 lg:col-span-3 shadow-sm border-slate-200">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Recent Reports</CardTitle>
                                        <NextLink href="/reports" className="text-sm text-primary hover:underline">View All</NextLink>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {reports.length === 0 ? (
                                            <p className="text-muted-foreground text-center py-4">No reports found.</p>
                                        ) : (
                                            reports.slice(0, 3).map((report) => (
                                                <div key={report.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                    <div className="flex flex-col mb-2 sm:mb-0">
                                                        <span className="font-medium">
                                                            Week of {format(new Date(report.weekStartDate), 'MMM d, yyyy')}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {report.project?.name || 'No Project'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col sm:items-end space-y-2">
                                                        {getStatusBadge(report.status)}
                                                        <NextLink href={`/reports/${report.id}`}>
                                                            <Button variant="link" size="sm" className="h-auto p-0">View Details</Button>
                                                        </NextLink>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    )}
                </div>
            </AppLayout>
        </ProtectedRoute>
    );
}
