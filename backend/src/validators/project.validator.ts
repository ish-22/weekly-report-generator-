import { z } from 'zod';

export const createProjectSchema = {
  body: z.object({
    name: z
      .string()
      .min(2, 'Project name must be at least 2 characters long')
      .max(100, 'Project name exceeds 100 characters'),
    code: z
      .string()
      .min(2, 'Project code must be at least 2 characters long')
      .max(20, 'Project code exceeds 20 characters')
      .toUpperCase(),
    description: z.string().optional(),
    isActive: z.boolean().optional().default(true),
  }),
};

export const updateProjectSchema = {
  params: z.object({
    id: z.string().uuid('Invalid project UUID format'),
  }),
  body: z.object({
    name: z
      .string()
      .min(2, 'Project name must be at least 2 characters long')
      .max(100, 'Project name exceeds 100 characters')
      .optional(),
    code: z
      .string()
      .min(2, 'Project code must be at least 2 characters long')
      .max(20, 'Project code exceeds 20 characters')
      .toUpperCase()
      .optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
};

export const projectIdParamSchema = {
  params: z.object({
    id: z.string().uuid('Invalid project UUID format'),
  }),
};
