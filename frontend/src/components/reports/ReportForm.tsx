'use client';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Trash2, Plus, Save, Send } from 'lucide-react';
import {
    Project,
    TaskPriority,
    TaskStatus,
    TaskType,
    ReportStatus
} from '@/types';
import { format, startOfWeek, endOfWeek } from 'date-fns';

const reportSchema = z.object({
    projectId: z.string().min(1, 'Project is required'),
    weekStartDate: z.string(),
    weekEndDate: z.string(),
    tasksPlannedNextWeek: z.string().optional(),
    blockers: z.string().optional(),
    isKeyBlocker: z.boolean().default(false),
    achievements: z.string().optional(),
    isKeyAchievement: z.boolean().default(false),
    optionalNotes: z.string().optional(),
    tasks: z.array(z.object({
        id: z.string().optional(),
        name: z.string().min(1, 'Task name is required'),
        priority: z.nativeEnum(TaskPriority),
        taskType: z.nativeEnum(TaskType),
        status: z.nativeEnum(TaskStatus),
        plannedPercentage: z.coerce.number().min(0).max(100),
        actualPercentage: z.coerce.number().min(0).max(100),
        plannedHours: z.coerce.number().min(0),
        timeSpentHours: z.coerce.number().min(0),
        outputDeliverable: z.string().optional(),
    }))
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportFormProps {
    initialData?: any; // The existing report if editing
    projects: Project[];
    onSubmitDraft: (data: ReportFormValues) => Promise<void>;
    onSubmitFinal: (data: ReportFormValues) => Promise<void>;
    loading: boolean;
}

export const ReportForm = ({ initialData, projects, onSubmitDraft, onSubmitFinal, loading }: ReportFormProps) => {

    const defaultWeekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const defaultWeekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');

    const form = useForm<ReportFormValues>({
        resolver: zodResolver(reportSchema) as any,
        defaultValues: initialData || {
            projectId: '',
            weekStartDate: defaultWeekStart,
            weekEndDate: defaultWeekEnd,
            tasks: [],
            tasksPlannedNextWeek: '',
            blockers: '',
            isKeyBlocker: false,
            achievements: '',
            isKeyAchievement: false,
            optionalNotes: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "tasks"
    });

    const handleSubmitDraft = async (data: ReportFormValues) => {
        await onSubmitDraft(data);
    };

    const handleSubmitFinal = async (data: ReportFormValues) => {
        await onSubmitFinal(data);
    };

    return (
        <form className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Project</Label>
                            <Controller
                                name="projectId"
                                control={form.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a project" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projects.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {form.formState.errors.projectId && <p className="text-sm text-red-500">{form.formState.errors.projectId.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Week Start Date</Label>
                                <Input type="date" {...form.register('weekStartDate')} />
                            </div>
                            <div className="space-y-2">
                                <Label>Week End Date</Label>
                                <Input type="date" {...form.register('weekEndDate')} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Highlights & Blockers</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Achievements</Label>
                            <Textarea {...form.register('achievements')} placeholder="What went well?" />
                            <div className="flex items-center space-x-2 mt-2">
                                <Controller
                                    name="isKeyAchievement"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Checkbox id="isKeyAchievement" checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <Label htmlFor="isKeyAchievement" className="text-xs font-normal">Mark as Key Achievement</Label>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Label>Blockers</Label>
                            <Textarea {...form.register('blockers')} placeholder="Any issues or delays?" />
                            <div className="flex items-center space-x-2 mt-2">
                                <Controller
                                    name="isKeyBlocker"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Checkbox id="isKeyBlocker" checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <Label htmlFor="isKeyBlocker" className="text-xs font-normal">Mark as Key Blocker</Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Tasks</CardTitle>
                    <Button type="button" onClick={() => append({
                        name: '',
                        priority: TaskPriority.MEDIUM,
                        taskType: TaskType.DEVELOPMENT,
                        status: TaskStatus.NOT_STARTED,
                        plannedPercentage: 100,
                        actualPercentage: 0,
                        plannedHours: 0,
                        timeSpentHours: 0
                    })}
                        variant="outline"
                        size="sm"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                </CardHeader>
                <CardContent>
                    {fields.length === 0 ? (
                        <div className="text-center p-6 text-muted-foreground border border-dashed rounded bg-slate-50">
                            No tasks added yet. Click &quot;Add Task&quot; to begin.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left font-medium py-2 min-w-[200px]">Task Name</th>
                                        <th className="text-left font-medium py-2">Type / Priority</th>
                                        <th className="text-left font-medium py-2">Status</th>
                                        <th className="text-left font-medium py-2">Hours (Plan/Actual)</th>
                                        <th className="text-left font-medium py-2">% (Plan/Actual)</th>
                                        <th className="text-left font-medium py-2 max-w-[200px]">Deliverable</th>
                                        <th className="text-right py-2"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {fields.map((field, index) => (
                                        <tr key={field.id} className="group">
                                            <td className="py-3 px-1 align-top">
                                                <Input placeholder="E.g. API Implementation" {...form.register(`tasks.${index}.name`)} className="bg-white" />
                                            </td>
                                            <td className="py-3 px-1 align-top space-y-2">
                                                <Controller
                                                    name={`tasks.${index}.taskType`}
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                {Object.values(TaskType).map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                <Controller
                                                    name={`tasks.${index}.priority`}
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="bg-white h-7 text-xs"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                {Object.values(TaskPriority).map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </td>
                                            <td className="py-3 px-1 align-top">
                                                <Controller
                                                    name={`tasks.${index}.status`}
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                {Object.values(TaskStatus).map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </td>
                                            <td className="py-3 px-1 align-top space-x-2">
                                                <div className="flex space-x-2">
                                                    <div className="w-1/2 before:content-['Plan'] before:text-[10px] before:text-slate-400 before:block">
                                                        <Input type="number" step="0.5" {...form.register(`tasks.${index}.plannedHours`)} className="bg-white w-full" />
                                                    </div>
                                                    <div className="w-1/2 before:content-['Act'] before:text-[10px] before:text-slate-400 before:block">
                                                        <Input type="number" step="0.5" {...form.register(`tasks.${index}.timeSpentHours`)} className="bg-white w-full" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-1 align-top space-x-2">
                                                <div className="flex space-x-2">
                                                    <div className="w-1/2 before:content-['Plan'] before:text-[10px] before:text-slate-400 before:block">
                                                        <Input type="number" {...form.register(`tasks.${index}.plannedPercentage`)} className="bg-white w-full" />
                                                    </div>
                                                    <div className="w-1/2 before:content-['Act'] before:text-[10px] before:text-slate-400 before:block">
                                                        <Input type="number" {...form.register(`tasks.${index}.actualPercentage`)} className="bg-white w-full" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-1 align-top">
                                                <Input placeholder="URL or output" {...form.register(`tasks.${index}.outputDeliverable`)} className="bg-white h-20" />
                                            </td>
                                            <td className="py-3 pl-2 align-top text-right">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Next Steps & Notes</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tasks Planned for Next Week</Label>
                        <Textarea {...form.register('tasksPlannedNextWeek')} placeholder="What's prioritized for next week?" />
                    </div>
                    <div className="space-y-2">
                        <Label>Optional Notes</Label>
                        <Textarea {...form.register('optionalNotes')} placeholder="Any additional information..." />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-3 bg-slate-50 pt-4 rounded-b-lg border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={form.handleSubmit(handleSubmitDraft as any)}
                        disabled={loading}
                    >
                        <Save className="mr-2 h-4 w-4" /> Save as Draft
                    </Button>
                    <Button
                        type="button"
                        onClick={form.handleSubmit(handleSubmitFinal as any)}
                        disabled={loading}
                    >
                        <Send className="mr-2 h-4 w-4" /> Submit Report
                    </Button>
                </CardFooter>
            </Card>

        </form>
    )
}
