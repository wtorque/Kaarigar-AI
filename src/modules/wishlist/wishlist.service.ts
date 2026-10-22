import { prisma } from '../../infrastructure/postgres/client.js';

export class WishlistService {
  async getOrCreateWishlist(userId: string) {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                artisan: { select: { id: true, businessName: true, clusterRegion: true } },
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                  artisan: { select: { id: true, businessName: true, clusterRegion: true } },
                },
              },
            },
          },
        },
      });
    }

    return wishlist;
  }

  async addItem(userId: string, productId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);
    await prisma.wishlistItem.upsert({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
      update: {},
      create: {
        wishlistId: wishlist.id,
        productId,
      },
    });
    return this.getOrCreateWishlist(userId);
  }

  async removeItem(userId: string, productId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);
    await prisma.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    });
    return this.getOrCreateWishlist(userId);
  }
}

export const wishlistService = new WishlistService();
