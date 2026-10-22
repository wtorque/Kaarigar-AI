import { prisma } from '../../infrastructure/postgres/client.js';

export interface StockReservationRequest {
  variantId: string;
  quantity: number;
}

export class InventoryRepository {
  async getByVariantId(variantId: string) {
    return prisma.inventory.findUnique({
      where: { variantId },
    });
  }

  /**
   * Concurrency-safe atomic reservation using conditional update
   * Decrements available quantity and increments reservedQuantity atomically.
   * Fails if available quantity < requested quantity.
   */
  async reserveStock(variantId: string, quantityToReserve: number): Promise<boolean> {
    const updatedCount = await prisma.$executeRaw`
      UPDATE inventories
      SET 
        quantity = quantity - ${quantityToReserve},
        "reservedQuantity" = "reservedQuantity" + ${quantityToReserve},
        version = version + 1,
        "updatedAt" = NOW()
      WHERE "variantId" = ${variantId}::uuid
        AND quantity >= ${quantityToReserve}
    `;

    return updatedCount > 0;
  }

  /**
   * Finalizes reservation upon successful payment capture
   * Permanently reduces reservedQuantity.
   */
  async finalizeReservation(variantId: string, quantityPurchased: number): Promise<boolean> {
    const updatedCount = await prisma.$executeRaw`
      UPDATE inventories
      SET 
        "reservedQuantity" = GREATEST("reservedQuantity" - ${quantityPurchased}, 0),
        version = version + 1,
        "updatedAt" = NOW()
      WHERE "variantId" = ${variantId}::uuid
    `;

    return updatedCount > 0;
  }

  /**
   * Releases stock back to available quantity if checkout expires or is cancelled
   */
  async releaseReservation(variantId: string, quantityToRelease: number): Promise<boolean> {
    const updatedCount = await prisma.$executeRaw`
      UPDATE inventories
      SET 
        quantity = quantity + ${quantityToRelease},
        "reservedQuantity" = GREATEST("reservedQuantity" - ${quantityToRelease}, 0),
        version = version + 1,
        "updatedAt" = NOW()
      WHERE "variantId" = ${variantId}::uuid
    `;

    return updatedCount > 0;
  }

  /**
   * Replenishes stock (e.g., when artisan produces new handcrafted pieces)
   */
  async addStock(variantId: string, quantityToAdd: number) {
    return prisma.inventory.update({
      where: { variantId },
      data: {
        quantity: { increment: quantityToAdd },
        version: { increment: 1 },
      },
    });
  }
}

export const inventoryRepository = new InventoryRepository();
