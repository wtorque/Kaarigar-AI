import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const checkoutItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive().max(10),
});

export const createCheckoutOrderSchema = z.object({
  shippingAddressId: z.string().uuid(),
  items: z.array(checkoutItemSchema).min(1, 'At least one item is required for checkout'),
});

export type CreateCheckoutOrderInput = z.infer<typeof createCheckoutOrderSchema>;

export const queryOrdersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  status: z.nativeEnum(OrderStatus).optional(),
});

export type QueryOrdersInput = z.infer<typeof queryOrdersSchema>;
