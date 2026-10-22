import { prisma } from '../../infrastructure/postgres/client.js';
import { OrderStatus, Prisma } from '@prisma/client';

export class OrderRepository {
  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        shippingAddress: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { where: { isPrimary: true }, take: 1 },
                  },
                },
              },
            },
            artisan: {
              select: { id: true, businessName: true, craftTitle: true, clusterRegion: true },
            },
          },
        },
        payments: true,
      },
    });
  }

  async findByIdempotencyKey(key: string) {
    return prisma.order.findUnique({
      where: { idempotencyKey: key },
      include: {
        shippingAddress: true,
        items: true,
        payments: true,
      },
    });
  }

  async findMany(params: {
    userId?: string;
    artisanId?: string;
    status?: OrderStatus;
    page: number;
    limit: number;
  }) {
    const { userId, artisanId, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (artisanId) {
      where.items = {
        some: { artisanId },
      };
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          shippingAddress: true,
          items: true,
          payments: { select: { id: true, status: true, provider: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createOrderWithItems(data: {
    userId: string;
    shippingAddressId: string;
    orderNumber: string;
    subtotalMinor: number;
    taxMinor: number;
    shippingFeeMinor: number;
    totalAmountMinor: number;
    idempotencyKey?: string;
    items: Array<{
      variantId: string;
      artisanId: string;
      productTitle: string;
      variantTitle: string;
      unitPriceMinor: number;
      quantity: number;
      totalAmountMinor: number;
    }>;
  }) {
    return prisma.order.create({
      data: {
        userId: data.userId,
        shippingAddressId: data.shippingAddressId,
        orderNumber: data.orderNumber,
        subtotalMinor: data.subtotalMinor,
        taxMinor: data.taxMinor,
        shippingFeeMinor: data.shippingFeeMinor,
        totalAmountMinor: data.totalAmountMinor,
        idempotencyKey: data.idempotencyKey,
        status: OrderStatus.PENDING_PAYMENT,
        items: {
          create: data.items.map((i) => ({
            variantId: i.variantId,
            artisanId: i.artisanId,
            productTitle: i.productTitle,
            variantTitle: i.variantTitle,
            unitPriceMinor: i.unitPriceMinor,
            quantity: i.quantity,
            totalAmountMinor: i.totalAmountMinor,
          })),
        },
      },
      include: {
        items: true,
        shippingAddress: true,
      },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }
}

export const orderRepository = new OrderRepository();
