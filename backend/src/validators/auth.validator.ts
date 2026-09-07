import { z } from 'zod';

export const registerSchema = {
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(100, 'Password exceeds max length'),
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters long')
      .max(100, 'Full name exceeds max length'),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z.string().min(1, 'Password is required'),
  }),
};
