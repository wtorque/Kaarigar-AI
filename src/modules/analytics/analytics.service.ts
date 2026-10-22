import { prisma } from '../../infrastructure/postgres/client.js';
import { OrderStatus } from '@prisma/client';

export class AnalyticsService {
  async getPlatformOverview() {
    const validOrderStatuses: OrderStatus[] = [
      OrderStatus.PAYMENT_CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ];

    const [
      revenueAggregate,
      totalOrders,
      totalArtisans,
      pendingVerifications,
      totalProducts,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { status: { in: validOrderStatuses } },
        _sum: { totalAmountMinor: true },
      }),
      prisma.order.count(),
      prisma.artisanProfile.count({ where: { status: 'VERIFIED' } }),
      prisma.artisanProfile.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { status: 'PUBLISHED' } }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
    ]);

    const gmvMinor = revenueAggregate._sum.totalAmountMinor || 0;

    return {
      gmvMinor,
      gmvFormattedINR: `₹${(gmvMinor / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      totalOrders,
      verifiedArtisansCount: totalArtisans,
      pendingVerificationQueueCount: pendingVerifications,
      publishedProductsCount: totalProducts,
      recentAuditLogs,
    };
  }
}

export const analyticsService = new AnalyticsService();
