'use client';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleName, Report, ReportStatus, Project } from '@/types';
import { reportsApi, projectsApi } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import NextLink from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReportForm } from '@/components/reports/ReportForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

export default function ReportDetailPage() {
    const { id } = useParams();
    const [report, setReport] = useState<Report | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchDetailedData = async () => {
            try {
                const [reportRes, projectsRes] = await Promise.all([
                    reportsApi.getReport(id as string),
                    projectsApi.getAllActiveProjects()
                ]);
                if (reportRes.success && reportRes.data) {
                    setReport(reportRes.data);
                }
                if (projectsRes.success && projectsRes.data) {
                    setProjects(projectsRes.data);
                }
            } catch (err) {
                toast({ variant: 'destructive', title: 'Failed to load report' });
            } finally {
                setLoading(false);
            }
        };
        fetchDetailedData();
    }, [id, toast]);

    const handleUpdateDraft = async (data: any) => {
        setSubmitting(true);
        try {
            const res = await reportsApi.updateReport(id as string, data);
            if (res.success && res.data) {
                toast({ title: 'Report saved.' });
                setReport(res.data);
            }
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error saving report', description: err?.message });
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateAndSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            const res = await reportsApi.updateReport(id as string, data);
            if (res.success && res.data) {
                const submitRes = await reportsApi.submitReport(id as string);
                if (submitRes.success) {
                    toast({ title: 'Report submitted for review.' });
                    router.push('/reports');
                }
            }
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error submitting report', description: err?.message });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            </AppLayout>
        );
    }

    if (!report) {
        return (
            <AppLayout>
                <div className="text-center p-12 text-muted-foreground">Report not found.</div>
            </AppLayout>
        );
    }

    const isEditable = report.status === ReportStatus.DRAFT || report.status === ReportStatus.NEEDS_CORRECTION;

    // Get latest review comment if NEEDS_CORRECTION
    const latestReview = report.reviewHistories?.length ? report.reviewHistories[0] : null;

    return (
        <ProtectedRoute allowedRoles={[RoleName.TEAM_MEMBER, RoleName.MANAGER, RoleName.ADMIN]}>
            <AppLayout>
                <div className="space-y-6 max-w-5xl mx-auto">
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <NextLink href="/reports" className="flex items-center hover:text-foreground transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back to history
                        </NextLink>
                    </div>

                    <div>
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold tracking-tight">Report Details</h1>
                            <Badge variant={isEditable ? 'outline' : 'default'} className="text-sm">
                                {report.status}
                            </Badge>
                        </div>
                    </div>

                    {report.status === ReportStatus.NEEDS_CORRECTION && latestReview && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex space-x-3 text-red-900">
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-red-800">Manager comment requires action</h4>
                                <p className="text-sm mt-1">{latestReview.comment || "Please adjust your report and resubmit."}</p>
                            </div>
                        </div>
                    )}

                    {isEditable ? (
                        <ReportForm
                            initialData={{
                                ...report,
                                weekStartDate: format(new Date(report.weekStartDate), 'yyyy-MM-dd'),
                                weekEndDate: format(new Date(report.weekEndDate), 'yyyy-MM-dd')
                            }}
                            projects={projects}
                            onSubmitDraft={handleUpdateDraft}
                            onSubmitFinal={handleUpdateAndSubmit}
                            loading={submitting}
                        />
                    ) : (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Submission Details</CardTitle></CardHeader>
                                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Project</p>
                                        <p className="font-medium">{report.project?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Week</p>
                                        <p className="font-medium">{format(new Date(report.weekStartDate), 'MMM d')} - {format(new Date(report.weekEndDate), 'MMM d, yyyy')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Version</p>
                                        <p className="font-medium">v{report.currentVersionNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Updated</p>
                                        <p className="font-medium">{format(new Date(report.updatedAt), 'MMM d, yyyy')}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Read Only task view would go here. A proper implementation would display the tasks in a clean table since they aren't editable */}
                            <Card>
                                <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
                                <CardContent>
                                    {report.tasks?.length ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
                                                <thead className="bg-slate-50 border-b">
                                                    <tr>
                                                        <th className="px-4 py-2 font-medium">Task</th>
                                                        <th className="px-4 py-2 font-medium">Status</th>
                                                        <th className="px-4 py-2 font-medium">Progress</th>
                                                        <th className="px-4 py-2 font-medium">Hours</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {report.tasks.map(task => (
                                                        <tr key={task.id}>
                                                            <td className="px-4 py-3">{task.name}</td>
                                                            <td className="px-4 py-3"><Badge variant="outline">{task.status}</Badge></td>
                                                            <td className="px-4 py-3">{Number(task.actualPercentage)}% of {Number(task.plannedPercentage)}%</td>
                                                            <td className="px-4 py-3">{Number(task.timeSpentHours)} / {Number(task.plannedHours)} hr</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">No tasks documented.</p>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader><CardTitle>Achievements & Blockers</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm font-semibold">Achievements</p>
                                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{report.achievements || 'None'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-orange-700">Blockers</p>
                                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{report.blockers || 'None'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm font-semibold">Next Week's Plan</p>
                                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{report.tasksPlannedNextWeek || 'None'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">Optional Notes</p>
                                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{report.optionalNotes || 'None'}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </ProtectedRoute>
    );
}
