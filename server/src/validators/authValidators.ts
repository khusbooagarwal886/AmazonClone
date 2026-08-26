import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .trim()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  email: z
    .string({ message: 'Email is required' })
    .trim()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase(),
  password: z
    .string({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .trim()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase(),
  password: z
    .string({ message: 'Password is required' })
    .min(1, { message: 'Password cannot be empty' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
