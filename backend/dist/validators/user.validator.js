"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByIdSchema = exports.updateStatusSchema = exports.updateRoleSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.updateRoleSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid user UUID format'),
    }),
    body: zod_1.z.object({
        role: zod_1.z.nativeEnum(client_1.RoleName, {
            errorMap: () => ({ message: 'Role must be one of: TEAM_MEMBER, MANAGER, ADMIN' }),
        }),
    }),
};
exports.updateStatusSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid user UUID format'),
    }),
    body: zod_1.z.object({
        isActive: zod_1.z.boolean({ required_error: 'isActive status boolean flag is required' }),
    }),
};
exports.getUserByIdSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid user UUID format'),
    }),
};
