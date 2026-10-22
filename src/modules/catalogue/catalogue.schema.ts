import { z } from 'zod';
import { createProductSchema } from '../products/product.schema.js';

export const createCatalogueJobSchema = z.object({
  imageUrl: z.string().url('A valid image URL is required'),
  artisanNotes: z.string().max(2000).optional(),
});

export type CreateCatalogueJobInput = z.infer<typeof createCatalogueJobSchema>;

export const publishCatalogueJobSchema = createProductSchema;
export type PublishCatalogueJobInput = z.infer<typeof publishCatalogueJobSchema>;
