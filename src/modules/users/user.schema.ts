import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format').optional(),
  avatarUrl: z.string().url().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const createAddressSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format'),
  streetAddress: z.string().min(5).max(255),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postalCode: z.string().min(4).max(12),
  country: z.string().default('IN'),
  isDefault: z.boolean().default(false),
  type: z.enum(['SHIPPING', 'BILLING', 'BOTH']).default('SHIPPING'),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
