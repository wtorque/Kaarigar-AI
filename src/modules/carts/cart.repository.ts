import { prisma } from '../../infrastructure/postgres/client.js';

export class CartRepository {
  async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { where: { isPrimary: true }, take: 1 },
                    artisan: { select: { id: true, businessName: true } },
                  },
                },
                inventory: { select: { quantity: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: { where: { isPrimary: true }, take: 1 },
                      artisan: { select: { id: true, businessName: true } },
                    },
                  },
                  inventory: { select: { quantity: true } },
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async addItem(cartId: string, variantId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: {
        cartId_variantId: {
          cartId,
          variantId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId,
        variantId,
        quantity,
      },
      include: {
        variant: true,
      },
    });
  }

  async updateItemQuantity(cartId: string, itemId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id: itemId, cartId },
      data: { quantity },
    });
  }

  async removeItem(cartId: string, itemId: string) {
    return prisma.cartItem.deleteMany({
      where: { id: itemId, cartId },
    });
  }

  async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}

export const cartRepository = new CartRepository();
