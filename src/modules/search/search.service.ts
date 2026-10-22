import { prisma } from '../../infrastructure/postgres/client.js';
import { cache } from '../../infrastructure/redis/client.js';

export class SearchService {
  async search(query: string, limit = 20) {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return { products: [], categories: [], craftClusters: [] };
    }

    const cacheKey = `search:${trimmed}:${limit}`;
    const cached = await cache.get<{ products: unknown[]; categories: unknown[]; craftClusters: unknown[] }>(cacheKey);
    if (cached) {
      return cached;
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: trimmed, mode: 'insensitive' } },
            { description: { contains: trimmed, mode: 'insensitive' } },
            { craftTechnique: { contains: trimmed, mode: 'insensitive' } },
            { clusterRegion: { contains: trimmed, mode: 'insensitive' } },
            { giTagNumber: { contains: trimmed, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          category: { select: { name: true, slug: true } },
          images: { where: { isPrimary: true }, take: 1 },
          artisan: { select: { businessName: true, clusterRegion: true, giTagNumber: true } },
        },
      }),
      prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: trimmed, mode: 'insensitive' } },
            { description: { contains: trimmed, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
    ]);

    const result = {
      products,
      categories,
    };

    // Cache search result for 10 minutes
    await cache.set(cacheKey, result, 600);

    return result;
  }
}

export const searchService = new SearchService();
