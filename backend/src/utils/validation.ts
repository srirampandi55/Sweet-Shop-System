import { z } from 'zod';

export const RegisterSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'STAFF']).optional(),
});

export const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const SweetSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  stock: z.number().nonnegative(),
  description: z.string().optional(),
});

export const OrderSchema = z.object({
  customerName: z.string().min(1).max(100),
  items: z.array(z.object({
    sweetId: z.string(),
    quantity: z.number().positive(),
  })).min(1),
});

export const UpdateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['ADMIN', 'STAFF']).optional(),
});
