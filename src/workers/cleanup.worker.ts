import { prisma } from '../infrastructure/postgres/client.js';
import { inventoryService } from '../modules/inventory/inventory.service.js';
import { logger } from '../config/logger.js';
import { INVENTORY_RESERVATION_TTL_SECONDS } from '../config/constants.js';

export async function releaseExpiredReservations(): Promise<number> {
  const cutoff = new Date(Date.now() - INVENTORY_RESERVATION_TTL_SECONDS * 1000);

  const expiredOrders = await prisma.order.findMany({
    where: {
      status: 'PENDING_PAYMENT',
      createdAt: { lt: cutoff },
    },
    include: {
      items: true,
    },
    take: 50,
  });

  if (expiredOrders.length === 0) {
    return 0;
  }

  logger.info({ count: expiredOrders.length }, 'Releasing expired checkout reservations');

  let releasedCount = 0;
  for (const order of expiredOrders) {
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Release reserved stock
        const itemsToRelease = order.items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        }));
        await inventoryService.releaseBatch(itemsToRelease);

        // 2. Mark order as cancelled
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'CANCELLED' },
        });

        // 3. Create notification for customer
        await tx.notification.create({
          data: {
            userId: order.userId,
            type: 'ORDER_STATUS',
            title: 'Checkout Session Expired',
            message: `Checkout session for Order #${order.orderNumber} expired. Items have been returned to stock.`,
          },
        });
      });
      releasedCount++;
    } catch (err: unknown) {
      logger.error({ orderId: order.id, error: err instanceof Error ? err.message : String(err) }, 'Failed to release expired order');
    }
  }

  return releasedCount;
}
