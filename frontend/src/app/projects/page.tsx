'use client';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleName, Project } from '@/types';
import { projectsApi } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [formData, setFormData] = useState({ name: '', code: '', description: '', isActive: true });

    const { hasRole } = useAuth();
    const { toast } = useToast();

    const isManagerOrAdmin = hasRole([RoleName.MANAGER, RoleName.ADMIN]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await projectsApi.getProjects(); // Assuming getProjects returns paginated or all? Let's assume paginated and we map items
            if (res.success && res.data) {
                setProjects(res.data.items || res.data); // handles both if it's paginated or array
            }
        } catch (err) {
            toast({ variant: 'destructive', title: 'Failed to load projects' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleOpenCreate = () => {
        setEditingProject(null);
        setFormData({ name: '', code: '', description: '', isActive: true });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (p: Project) => {
        setEditingProject(p);
        setFormData({ name: p.name, code: p.code, description: p.description || '', isActive: p.isActive });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await projectsApi.updateProject(editingProject.id, formData);
                toast({ title: 'Project updated' });
            } else {
                await projectsApi.createProject(formData);
                toast({ title: 'Project created' });
            }
            setIsDialogOpen(false);
            fetchProjects();
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error saving', description: err?.message });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await projectsApi.deleteProject(id);
            toast({ title: 'Project deleted' });
            fetchProjects();
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error deleting', description: err?.message });
        }
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRoles={[RoleName.TEAM_MEMBER, RoleName.MANAGER, RoleName.ADMIN]}>
            <AppLayout>
                <div className="space-y-6 max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                            <p className="text-muted-foreground mt-1">Manage project codes and categories.</p>
                        </div>
                        {isManagerOrAdmin && (
                            <Button onClick={handleOpenCreate}>
                                <Plus className="mr-2 h-4 w-4" /> Add Project
                            </Button>
                        )}
                    </div>

                    <Card>
                        <CardHeader className="py-4 border-b">
                            <div className="relative max-w-sm">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search projects..."
                                    className="pl-9"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 border-b">
                                            <tr>
                                                <th className="px-6 py-3 font-medium text-slate-500">Code</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Name</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Created</th>
                                                {isManagerOrAdmin && <th className="px-6 py-3 font-medium text-slate-500 text-right">Actions</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y text-slate-700 bg-white">
                                            {filteredProjects.map(p => (
                                                <tr key={p.id} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4 font-mono font-medium">{p.code}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium">{p.name}</div>
                                                        <div className="text-xs text-muted-foreground line-clamp-1">{p.description}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                                            {p.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-muted-foreground">{format(new Date(p.createdAt), 'MMM d, yyyy')}</td>
                                                    {isManagerOrAdmin && (
                                                        <td className="px-6 py-4 text-right space-x-2">
                                                            <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(p)}>
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(p.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                            {filteredProjects.length === 0 && (
                                                <tr><td colSpan={isManagerOrAdmin ? 5 : 4} className="px-6 py-12 text-center text-muted-foreground">No projects found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent>
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>{editingProject ? 'Edit Project' : 'Create Project'}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="code">Project Code</Label>
                                        <Input id="code" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} required placeholder="e.g. PRJ-01" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Project Name</Label>
                                        <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. Website Redesign" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="desc">Description</Label>
                                        <Input id="desc" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select value={formData.isActive ? 'true' : 'false'} onValueChange={v => setFormData({ ...formData, isActive: v === 'true' })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">Active</SelectItem>
                                                <SelectItem value="false">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit">Save</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                </div>
            </AppLayout>
        </ProtectedRoute>
    );
}
