import { prisma } from '../../infrastructure/postgres/client.js';
import { CreateProductInput, UpdateProductInput, QueryProductsInput } from './product.schema.js';
import { ProductStatus, Prisma } from '@prisma/client';

export class ProductRepository {
  async findMany(query: QueryProductsInput, isPublic = true) {
    const { page, limit, categoryId, search, clusterRegion, minPrice, maxPrice, sortBy, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (isPublic) {
      where.status = ProductStatus.PUBLISHED;
    } else if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (clusterRegion) {
      where.clusterRegion = { contains: clusterRegion, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePriceMinor = {};
      if (minPrice !== undefined) where.basePriceMinor.gte = minPrice;
      if (maxPrice !== undefined) where.basePriceMinor.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { craftTechnique: { contains: search, mode: 'insensitive' } },
        { story: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sortBy === 'price_asc') {
      orderBy = { basePriceMinor: 'asc' };
    } else if (sortBy === 'price_desc') {
      orderBy = { basePriceMinor: 'desc' };
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          artisan: {
            select: {
              id: true,
              businessName: true,
              craftTitle: true,
              clusterRegion: true,
              giTagNumber: true,
              user: { select: { name: true, avatarUrl: true } },
            },
          },
          images: { orderBy: { sortOrder: 'asc' } },
          variants: {
            include: {
              inventory: { select: { quantity: true, reservedQuantity: true } },
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        artisan: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
        images: { orderBy: { sortOrder: 'asc' } },
        variants: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        artisan: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        images: { orderBy: { sortOrder: 'asc' } },
        variants: {
          include: {
            inventory: true,
          },
        },
      },
    });
  }

  async create(artisanId: string, data: CreateProductInput) {
    const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;

    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          artisanId,
          categoryId: data.categoryId,
          title: data.title,
          slug,
          description: data.description,
          craftTechnique: data.craftTechnique,
          story: data.story,
          clusterRegion: data.clusterRegion,
          giTagNumber: data.giTagNumber,
          basePriceMinor: data.basePriceMinor,
          currency: data.currency,
          status: data.status,
          images: {
            create: data.images.map((img, idx) => ({
              url: img.url,
              altText: img.altText,
              sortOrder: img.sortOrder ?? idx,
              isPrimary: img.isPrimary ?? idx === 0,
            })),
          },
        },
      });

      // Create variants with corresponding inventory records
      for (const variantInput of data.variants) {
        await tx.productVariant.create({
          data: {
            productId: product.id,
            sku: variantInput.sku,
            title: variantInput.title,
            priceMinor: variantInput.priceMinor,
            attributes: variantInput.attributes as unknown as object,
            inventory: {
              create: {
                quantity: variantInput.stockQuantity,
                reservedQuantity: 0,
                version: 1,
              },
            },
          },
        });
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: {
          images: true,
          variants: { include: { inventory: true } },
          category: true,
        },
      });
    });
  }

  async update(id: string, data: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        craftTechnique: data.craftTechnique,
        story: data.story,
        clusterRegion: data.clusterRegion,
        giTagNumber: data.giTagNumber,
        basePriceMinor: data.basePriceMinor,
        status: data.status,
      },
      include: {
        images: true,
        variants: { include: { inventory: true } },
      },
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}

export const productRepository = new ProductRepository();
