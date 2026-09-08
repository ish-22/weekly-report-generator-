'use client';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleName, Project, ReportStatus } from '@/types';
import { ReportForm } from '@/components/reports/ReportForm';
import { reportsApi, projectsApi } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function NewReportPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await projectsApi.getAllActiveProjects();
                if (res.success && res.data) {
                    setProjects(res.data);
                }
            } catch (err) {
                console.error('Failed to load projects');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleCreateDraft = async (data: any) => {
        setSubmitting(true);
        try {
            const res = await reportsApi.createDraft(data);
            if (res.success && res.data) {
                toast({ title: 'Draft saved successfully' });
                router.push(`/reports/${res.data.id}`);
            }
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error saving draft', description: err?.message || 'Something went wrong.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateAndSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            const res = await reportsApi.createDraft(data);
            if (res.success && res.data) {
                const submitRes = await reportsApi.submitReport(res.data.id);
                if (submitRes.success) {
                    toast({ title: 'Report submitted successfully' });
                    router.push(`/dashboard`);
                }
            }
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error submitting report', description: err?.message || 'Something went wrong.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={[RoleName.TEAM_MEMBER, RoleName.MANAGER, RoleName.ADMIN]}>
            <AppLayout>
                <div className="space-y-6 max-w-5xl mx-auto">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Weekly Report</h1>
                        <p className="text-muted-foreground mt-1">Fill out your weekly status and submit for review.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : (
                        <ReportForm
                            projects={projects}
                            onSubmitDraft={handleCreateDraft}
                            onSubmitFinal={handleCreateAndSubmit}
                            loading={submitting}
                        />
                    )}
                </div>
            </AppLayout>
        </ProtectedRoute>
    );
}
