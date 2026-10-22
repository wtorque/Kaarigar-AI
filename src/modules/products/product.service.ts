import { productRepository, ProductRepository } from './product.repository.js';
import { CreateProductInput, UpdateProductInput, QueryProductsInput } from './product.schema.js';
import { ProductStatus } from '@prisma/client';
import { AuthenticatedUser } from '../../types/fastify.js';

export class ProductService {
  constructor(private prodRepo: ProductRepository = productRepository) {}

  async listPublicProducts(query: QueryProductsInput) {
    return this.prodRepo.findMany(query, true);
  }

  async listArtisanProducts(_artisanId: string, query: QueryProductsInput) {
    return this.prodRepo.findMany({ ...query }, false);
  }

  async getProductById(id: string) {
    const product = await this.prodRepo.findById(id);
    if (!product) {
      throw new Error('NOT_FOUND: Product not found');
    }
    return product;
  }

  async createProduct(user: AuthenticatedUser, data: CreateProductInput) {
    if (!user.artisanProfile) {
      throw new Error('FORBIDDEN: You must have an artisan profile to create products');
    }

    // Invariant: Unverified artisans can ONLY create DRAFT products
    if (user.artisanProfile.status !== 'VERIFIED' && data.status === ProductStatus.PUBLISHED) {
      throw new Error('FORBIDDEN: Unverified artisans cannot publish products. Set status to DRAFT until approved.');
    }

    return this.prodRepo.create(user.artisanProfile.id, data);
  }

  async updateProduct(id: string, user: AuthenticatedUser, data: UpdateProductInput) {
    const existing = await this.getProductById(id);

    // Ownership check: must be owner artisan or admin
    const isOwner = user.artisanProfile && existing.artisanId === user.artisanProfile.id;
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      throw new Error('FORBIDDEN: You can only edit your own products');
    }

    // Invariant: If publishing, artisan must be verified
    if (data.status === ProductStatus.PUBLISHED && !isAdmin) {
      if (!user.artisanProfile || user.artisanProfile.status !== 'VERIFIED') {
        throw new Error('FORBIDDEN: Artisan account pending verification. Cannot publish.');
      }
    }

    return this.prodRepo.update(id, data);
  }

  async deleteProduct(id: string, user: AuthenticatedUser) {
    const existing = await this.getProductById(id);

    const isOwner = user.artisanProfile && existing.artisanId === user.artisanProfile.id;
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      throw new Error('FORBIDDEN: You can only delete your own products');
    }

    return this.prodRepo.delete(id);
  }
}

export const productService = new ProductService();
