import { z } from 'zod';
import { ProductStatus } from '@prisma/client';

export const createProductVariantSchema = z.object({
  sku: z.string().min(3).max(50),
  title: z.string().min(2).max(100),
  priceMinor: z.number().int().positive('Price must be a positive integer in minor units (paise)'),
  stockQuantity: z.number().int().min(0).default(0),
  attributes: z.record(z.any()).optional(),
});

export const createProductImageSchema = z.object({
  url: z.string().url(),
  altText: z.string().max(255).optional(),
  sortOrder: z.number().int().default(0),
  isPrimary: z.boolean().default(false),
});

export const createProductSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  craftTechnique: z.string().max(150).optional(),
  story: z.string().max(5000).optional(),
  categoryId: z.string().uuid(),
  clusterRegion: z.string().max(100).optional(),
  giTagNumber: z.string().max(50).optional(),
  basePriceMinor: z.number().int().positive('Base price must be positive minor units (paise)'),
  currency: z.string().default('INR'),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
  images: z.array(createProductImageSchema).min(1, 'At least one product image is required'),
  variants: z.array(createProductVariantSchema).min(1, 'At least one product variant is required'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const queryProductsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  categoryId: z.string().uuid().optional(),
  search: z.string().optional(),
  clusterRegion: z.string().optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().positive().optional(),
  sortBy: z.enum(['newest', 'price_asc', 'price_desc', 'popular']).default('newest'),
  status: z.nativeEnum(ProductStatus).optional(),
});

export type QueryProductsInput = z.infer<typeof queryProductsSchema>;
