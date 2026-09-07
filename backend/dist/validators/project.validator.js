"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectIdParamSchema = exports.updateProjectSchema = exports.createProjectSchema = void 0;
const zod_1 = require("zod");
exports.createProjectSchema = {
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, 'Project name must be at least 2 characters long')
            .max(100, 'Project name exceeds 100 characters'),
        code: zod_1.z
            .string()
            .min(2, 'Project code must be at least 2 characters long')
            .max(20, 'Project code exceeds 20 characters')
            .toUpperCase(),
        description: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional().default(true),
    }),
};
exports.updateProjectSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid project UUID format'),
    }),
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, 'Project name must be at least 2 characters long')
            .max(100, 'Project name exceeds 100 characters')
            .optional(),
        code: zod_1.z
            .string()
            .min(2, 'Project code must be at least 2 characters long')
            .max(20, 'Project code exceeds 20 characters')
            .toUpperCase()
            .optional(),
        description: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
};
exports.projectIdParamSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid project UUID format'),
    }),
};
