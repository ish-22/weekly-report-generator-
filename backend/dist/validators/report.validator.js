"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listReportsQuerySchema = exports.approveReportSchema = exports.requestChangesSchema = exports.reportVersionParamSchema = exports.reportIdParamSchema = exports.updateReportSchema = exports.createReportSchema = exports.taskItemSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.taskItemSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    name: zod_1.z.string().min(2, 'Task name must be at least 2 characters long').max(255),
    priority: zod_1.z.nativeEnum(client_1.TaskPriority).default(client_1.TaskPriority.MEDIUM),
    taskType: zod_1.z.nativeEnum(client_1.TaskType).default(client_1.TaskType.DEVELOPMENT),
    status: zod_1.z.nativeEnum(client_1.TaskStatus).default(client_1.TaskStatus.IN_PROGRESS),
    plannedPercentage: zod_1.z
        .number()
        .min(0, 'Planned percentage cannot be negative')
        .max(100, 'Planned percentage cannot exceed 100')
        .default(100),
    actualPercentage: zod_1.z
        .number()
        .min(0, 'Actual percentage cannot be negative')
        .max(100, 'Actual percentage cannot exceed 100')
        .default(0),
    plannedHours: zod_1.z.number().min(0, 'Planned hours cannot be negative').default(0),
    timeSpentHours: zod_1.z.number().min(0, 'Time spent hours cannot be negative').default(0),
    outputDeliverable: zod_1.z.string().max(255).optional().nullable(),
});
exports.createReportSchema = {
    body: zod_1.z.object({
        projectId: zod_1.z.string().uuid('Invalid project UUID format'),
        weekStartDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'weekStartDate must be in format YYYY-MM-DD'),
        weekEndDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'weekEndDate must be in format YYYY-MM-DD'),
        tasksPlannedNextWeek: zod_1.z.string().optional().nullable(),
        blockers: zod_1.z.string().optional().nullable(),
        isKeyBlocker: zod_1.z.boolean().optional().default(false),
        achievements: zod_1.z.string().optional().nullable(),
        isKeyAchievement: zod_1.z.boolean().optional().default(false),
        optionalNotes: zod_1.z.string().optional().nullable(),
        tasks: zod_1.z.array(exports.taskItemSchema).min(1, 'At least one task item is required in a report'),
    }),
};
exports.updateReportSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid report UUID format'),
    }),
    body: exports.createReportSchema.body.partial().extend({
        tasks: zod_1.z.array(exports.taskItemSchema).min(1, 'At least one task item is required'),
    }),
};
exports.reportIdParamSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid report UUID format'),
    }),
};
exports.reportVersionParamSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid report UUID format'),
        versionNumber: zod_1.z.string().regex(/^\d+$/, 'versionNumber must be an integer'),
    }),
};
exports.requestChangesSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid report UUID format'),
    }),
    body: zod_1.z.object({
        comment: zod_1.z
            .string()
            .min(3, 'Review comment requesting correction must be at least 3 characters long')
            .max(2000, 'Comment is too long'),
    }),
};
exports.approveReportSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid report UUID format'),
    }),
    body: zod_1.z.object({
        comment: zod_1.z.string().max(2000).optional().nullable(),
    }),
};
exports.listReportsQuerySchema = {
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
        status: zod_1.z.nativeEnum(client_1.ReportStatus).optional(),
        projectId: zod_1.z.string().uuid().optional(),
        userId: zod_1.z.string().uuid().optional(),
        startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        endDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    }),
};
