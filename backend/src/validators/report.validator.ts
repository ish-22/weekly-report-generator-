import { z } from 'zod';
import { TaskPriority, TaskStatus, TaskType, ReportStatus } from '@prisma/client';

export const taskItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Task name must be at least 2 characters long').max(255),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  taskType: z.nativeEnum(TaskType).default(TaskType.DEVELOPMENT),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.IN_PROGRESS),
  plannedPercentage: z
    .number()
    .min(0, 'Planned percentage cannot be negative')
    .max(100, 'Planned percentage cannot exceed 100')
    .default(100),
  actualPercentage: z
    .number()
    .min(0, 'Actual percentage cannot be negative')
    .max(100, 'Actual percentage cannot exceed 100')
    .default(0),
  plannedHours: z.number().min(0, 'Planned hours cannot be negative').default(0),
  timeSpentHours: z.number().min(0, 'Time spent hours cannot be negative').default(0),
  outputDeliverable: z.string().max(255).optional().nullable(),
});

export const createReportSchema = {
  body: z.object({
    projectId: z.string().uuid('Invalid project UUID format'),
    weekStartDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'weekStartDate must be in format YYYY-MM-DD'),
    weekEndDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'weekEndDate must be in format YYYY-MM-DD'),
    tasksPlannedNextWeek: z.string().optional().nullable(),
    blockers: z.string().optional().nullable(),
    isKeyBlocker: z.boolean().optional().default(false),
    achievements: z.string().optional().nullable(),
    isKeyAchievement: z.boolean().optional().default(false),
    optionalNotes: z.string().optional().nullable(),
    tasks: z.array(taskItemSchema).min(1, 'At least one task item is required in a report'),
  }),
};

export const updateReportSchema = {
  params: z.object({
    id: z.string().uuid('Invalid report UUID format'),
  }),
  body: createReportSchema.body.partial().extend({
    tasks: z.array(taskItemSchema).min(1, 'At least one task item is required'),
  }),
};

export const reportIdParamSchema = {
  params: z.object({
    id: z.string().uuid('Invalid report UUID format'),
  }),
};

export const reportVersionParamSchema = {
  params: z.object({
    id: z.string().uuid('Invalid report UUID format'),
    versionNumber: z.string().regex(/^\d+$/, 'versionNumber must be an integer'),
  }),
};

export const requestChangesSchema = {
  params: z.object({
    id: z.string().uuid('Invalid report UUID format'),
  }),
  body: z.object({
    comment: z
      .string()
      .min(3, 'Review comment requesting correction must be at least 3 characters long')
      .max(2000, 'Comment is too long'),
  }),
};

export const approveReportSchema = {
  params: z.object({
    id: z.string().uuid('Invalid report UUID format'),
  }),
  body: z.object({
    comment: z.string().max(2000).optional().nullable(),
  }),
};

export const listReportsQuerySchema = {
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
    status: z.nativeEnum(ReportStatus).optional(),
    projectId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
};
