"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = {
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address format'),
        password: zod_1.z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .max(100, 'Password exceeds max length'),
        fullName: zod_1.z
            .string()
            .min(2, 'Full name must be at least 2 characters long')
            .max(100, 'Full name exceeds max length'),
    }),
};
exports.loginSchema = {
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address format'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
};
