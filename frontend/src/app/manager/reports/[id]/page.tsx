'use client';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleName, Report, ReportStatus, ReportVersion } from '@/types';
import { managerApi, reportsApi } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Check, X } from 'lucide-react';
import NextLink from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';

export default function ManagerReviewPage() {
    const { id } = useParams();
    const [report, setReport] = useState<Report | null>(null);
    const [versions, setVersions] = useState<ReportVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [comment, setComment] = useState('');
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchDetailedData = async () => {
            try {
                const [reportRes, versionsRes] = await Promise.all([
                    managerApi.getReportDetail(id as string),
                    reportsApi.getVersions(id as string) // usually available to manager too if roles match
                ]);
                if (reportRes.success && reportRes.data) {
                    setReport(reportRes.data);
                }
                if (versionsRes.success && versionsRes.data) {
                    setVersions(versionsRes.data);
                }
            } catch (err) {
                toast({ variant: 'destructive', title: 'Failed to load report' });
            } finally {
                setLoading(false);
            }
        };
        fetchDetailedData();
    }, [id, toast]);

    const handleApprove = async () => {
        setSubmitting(true);
        try {
            const res = await managerApi.approveReport(id as string, { comment });
            if (res.success) {
                toast({ title: 'Report Approved' });
                router.push('/manager/dashboard');
            }
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error Approving', description: err?.message });
        } finally {
            setSubmitting(false);
        }
    };

    const handleRequestChanges = async () => {
        if (!comment) {
            toast({ variant: 'destructive', title: 'Comment required', description: 'Please provide feedback for requested changes.' });
            return;
        }
        setSubmitting(true);
        try {
            const res = await managerApi.requestChanges(id as string, { comment });
            if (res.success) {
                toast({ title: 'Changes Requested' });
                setIsRejectDialogOpen(false);
                router.push('/manager/dashboard');
            }
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error Requesting Changes', description: err?.message });
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

    return (
        <ProtectedRoute allowedRoles={[RoleName.MANAGER, RoleName.ADMIN]}>
            <AppLayout>
                <div className="space-y-6 max-w-5xl mx-auto">
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <NextLink href="/manager/dashboard" className="flex items-center hover:text-foreground transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                        </NextLink>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Review Weekly Report</h1>
                            <p className="text-muted-foreground mt-1">
                                {report.user?.fullName} &bull; {report.project?.name}
                            </p>
                        </div>
                        {report.status === ReportStatus.SUBMITTED && (
                            <div className="flex space-x-3">
                                <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                                    <DialogTrigger>
                                        <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                            <X className="mr-2 h-4 w-4" /> Request Changes
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Request Changes</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-4 space-y-4">
                                            <p className="text-sm text-muted-foreground">Please detail what needs to be corrected in the report.</p>
                                            <Textarea
                                                placeholder="Needs more detail on task Y..."
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                                className="min-h-[100px]"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
                                            <Button variant="destructive" onClick={handleRequestChanges} disabled={submitting}>
                                                {submitting ? 'Submitting...' : 'Send Request'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Button onClick={handleApprove} disabled={submitting} className="bg-green-600 hover:bg-green-700">
                                    <Check className="mr-2 h-4 w-4" /> Approve Report
                                </Button>
                            </div>
                        )}
                        {report.status !== ReportStatus.SUBMITTED && (
                            <Badge className={
                                report.status === ReportStatus.APPROVED ? 'bg-green-500' : 'bg-red-500'
                            }>
                                {report.status}
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Submission Details</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Week</p>
                                    <p className="font-medium">{format(new Date(report.weekStartDate), 'MMM d')} - {format(new Date(report.weekEndDate), 'MMM d, yyyy')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Version</p>
                                    <p className="font-medium">v{report.currentVersionNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Submitted</p>
                                    <p className="font-medium">{format(new Date(report.updatedAt), 'MMM d, h:mm a')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Previous Versions</p>
                                    <p className="font-medium text-sm text-primary">
                                        {versions?.length > 1 ? `${versions.length - 1} prior version(s)` : 'First version'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
                            <CardContent className="p-0">
                                {report.tasks?.length ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 border-b">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium">Task / Priority</th>
                                                    <th className="px-6 py-3 font-medium">Type</th>
                                                    <th className="px-6 py-3 font-medium">Status</th>
                                                    <th className="px-6 py-3 font-medium">Progress</th>
                                                    <th className="px-6 py-3 font-medium">Hours</th>
                                                    <th className="px-6 py-3 font-medium max-w-[200px]">Deliverable</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y text-slate-700 bg-white">
                                                {report.tasks.map(task => (
                                                    <tr key={task.id} className="hover:bg-slate-50">
                                                        <td className="px-6 py-4">
                                                            <div className="font-medium">{task.name}</div>
                                                            <div className="text-xs text-muted-foreground mt-1 uppercase">{task.priority}</div>
                                                        </td>
                                                        <td className="px-6 py-4">{task.taskType}</td>
                                                        <td className="px-6 py-4"><Badge variant="outline">{task.status}</Badge></td>
                                                        <td className="px-6 py-4">
                                                            {Number(task.actualPercentage)}% actual<br />
                                                            <span className="text-xs text-muted-foreground">{Number(task.plannedPercentage)}% planned</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {Number(task.timeSpentHours)} h spent<br />
                                                            <span className="text-xs text-muted-foreground">{Number(task.plannedHours)} h planned</span>
                                                        </td>
                                                        <td className="px-6 py-4 max-w-[200px] truncate text-xs">
                                                            {task.outputDeliverable || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground p-6 text-center">No tasks recorded.</p>
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader><CardTitle>Highlights & Blockers</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-sm font-semibold">Achievements</span>
                                            {report.isKeyAchievement && <Badge variant="secondary" className="ml-2 text-[10px] h-5">Key</Badge>}
                                        </div>
                                        <div className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded border">
                                            {report.achievements || 'No achievements provided.'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-1">
                                            <span className="text-sm font-semibold text-orange-700">Blockers</span>
                                            {report.isKeyBlocker && <Badge variant="destructive" className="ml-2 text-[10px] h-5 bg-red-600">Key Blocker</Badge>}
                                        </div>
                                        <div className="text-sm text-slate-700 whitespace-pre-wrap bg-red-50 p-3 rounded border border-red-100">
                                            {report.blockers || 'No blockers provided.'}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Planning & Notes</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <p className="text-sm font-semibold mb-1">Next Week's Tasks</p>
                                        <div className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded border">
                                            {report.tasksPlannedNextWeek || 'No plans provided.'}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold mb-1">Optional Notes</p>
                                        <div className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded border">
                                            {report.optionalNotes || 'No notes provided.'}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {report.status === ReportStatus.SUBMITTED && (
                            <Card className="border-blue-200 shadow-sm mt-8">
                                <CardContent className="p-6">
                                    <p className="text-sm font-medium mb-3">Optional Approvable Comment:</p>
                                    <Textarea
                                        placeholder="Great work this week. (Visible on approval)"
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        className="mb-4"
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </AppLayout>
        </ProtectedRoute>
    );
}
