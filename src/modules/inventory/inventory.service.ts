import { inventoryRepository, InventoryRepository, StockReservationRequest } from './inventory.repository.js';
import { logger } from '../../config/logger.js';

export class InventoryService {
  constructor(private invRepo: InventoryRepository = inventoryRepository) {}

  async checkAvailability(variantId: string, requestedQuantity: number): Promise<boolean> {
    const inv = await this.invRepo.getByVariantId(variantId);
    if (!inv) return false;
    return inv.quantity >= requestedQuantity;
  }

  /**
   * Concurrency-safe multi-item reservation in checkout pipeline
   * If any single item fails reservation due to insufficient stock,
   * all previously reserved items in this batch are rolled back immediately.
   */
  async reserveBatch(items: StockReservationRequest[]): Promise<{ success: boolean; failedVariantId?: string }> {
    const reservedItems: StockReservationRequest[] = [];

    for (const item of items) {
      const reserved = await this.invRepo.reserveStock(item.variantId, item.quantity);
      if (!reserved) {
        logger.warn({ variantId: item.variantId, requested: item.quantity }, 'Insufficient stock for reservation');
        // Rollback already reserved items in this batch
        for (const rollbackItem of reservedItems) {
          await this.invRepo.releaseReservation(rollbackItem.variantId, rollbackItem.quantity);
        }
        return { success: false, failedVariantId: item.variantId };
      }
      reservedItems.push(item);
    }

    return { success: true };
  }

  async finalizeBatch(items: StockReservationRequest[]): Promise<void> {
    for (const item of items) {
      await this.invRepo.finalizeReservation(item.variantId, item.quantity);
    }
  }

  async releaseBatch(items: StockReservationRequest[]): Promise<void> {
    for (const item of items) {
      await this.invRepo.releaseReservation(item.variantId, item.quantity);
    }
  }

  async restockVariant(variantId: string, quantity: number) {
    return this.invRepo.addStock(variantId, quantity);
  }
}

export const inventoryService = new InventoryService();
