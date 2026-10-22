import { cartRepository, CartRepository } from './cart.repository.js';
import { AddCartItemInput, UpdateCartItemInput } from './cart.schema.js';
import { prisma } from '../../infrastructure/postgres/client.js';

export class CartService {
  constructor(private cartRepo: CartRepository = cartRepository) {}

  async getCart(userId: string) {
    const cart = await this.cartRepo.getOrCreateCart(userId);

    // Compute prices and totals in minor units
    let subtotalMinor = 0;
    const enrichedItems = cart.items.map((item) => {
      const lineTotalMinor = item.variant.priceMinor * item.quantity;
      subtotalMinor += lineTotalMinor;

      const inStock = (item.variant.inventory?.quantity ?? 0) >= item.quantity;

      return {
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        productTitle: item.variant.product.title,
        variantTitle: item.variant.title,
        priceMinor: item.variant.priceMinor,
        lineTotalMinor,
        inStock,
        primaryImage: item.variant.product.images[0]?.url,
        artisan: item.variant.product.artisan,
      };
    });

    const taxMinor = Math.round(subtotalMinor * 0.05); // 5% GST
    const shippingFeeMinor = subtotalMinor > 100000 ? 0 : 9900; // Free shipping over ₹1,000, else ₹99
    const totalAmountMinor = subtotalMinor + taxMinor + shippingFeeMinor;

    return {
      cartId: cart.id,
      items: enrichedItems,
      totalItems: enrichedItems.reduce((acc, curr) => acc + curr.quantity, 0),
      subtotalMinor,
      taxMinor,
      shippingFeeMinor,
      totalAmountMinor,
      currency: 'INR',
    };
  }

  async addItem(userId: string, input: AddCartItemInput) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: input.variantId },
      include: { inventory: true },
    });

    if (!variant) {
      throw new Error('NOT_FOUND: Product variant not found');
    }

    if ((variant.inventory?.quantity ?? 0) < input.quantity) {
      throw new Error('CONFLICT: Requested quantity exceeds available stock');
    }

    const cart = await this.cartRepo.getOrCreateCart(userId);
    await this.cartRepo.addItem(cart.id, input.variantId, input.quantity);

    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, input: UpdateCartItemInput) {
    const cart = await this.cartRepo.getOrCreateCart(userId);
    await this.cartRepo.updateItemQuantity(cart.id, itemId, input.quantity);
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.cartRepo.getOrCreateCart(userId);
    await this.cartRepo.removeItem(cart.id, itemId);
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.cartRepo.getOrCreateCart(userId);
    await this.cartRepo.clearCart(cart.id);
  }
}

export const cartService = new CartService();
