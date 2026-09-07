import { z } from 'zod';
import { RoleName } from '@prisma/client';

export const updateRoleSchema = {
  params: z.object({
    id: z.string().uuid('Invalid user UUID format'),
  }),
  body: z.object({
    role: z.nativeEnum(RoleName, {
      errorMap: () => ({ message: 'Role must be one of: TEAM_MEMBER, MANAGER, ADMIN' }),
    }),
  }),
};

export const updateStatusSchema = {
  params: z.object({
    id: z.string().uuid('Invalid user UUID format'),
  }),
  body: z.object({
    isActive: z.boolean({ required_error: 'isActive status boolean flag is required' }),
  }),
};

export const getUserByIdSchema = {
  params: z.object({
    id: z.string().uuid('Invalid user UUID format'),
  }),
};
