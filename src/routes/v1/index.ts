import { FastifyInstance } from 'fastify';
import { healthRoutes } from './health.js';
import { userRoutes } from '../../modules/users/user.routes.js';
import { artisanRoutes } from '../../modules/artisans/artisan.routes.js';
import { categoryRoutes } from '../../modules/categories/category.routes.js';
import { productRoutes } from '../../modules/products/product.routes.js';
import { catalogueRoutes } from '../../modules/catalogue/catalogue.routes.js';
import { cartRoutes } from '../../modules/carts/cart.routes.js';
import { wishlistRoutes } from '../../modules/wishlist/wishlist.routes.js';
import { orderRoutes } from '../../modules/orders/order.routes.js';
import { paymentRoutes } from '../../modules/payments/payment.routes.js';
import { notificationRoutes } from '../../modules/notifications/notification.routes.js';
import { adminRoutes } from '../../modules/admin/admin.routes.js';
import { searchRoutes } from '../../modules/search/search.routes.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function v1Routes(fastify: FastifyInstance<any, any, any, any, any>) {
  await fastify.register(healthRoutes);
  await fastify.register(userRoutes);
  await fastify.register(artisanRoutes);
  await fastify.register(categoryRoutes);
  await fastify.register(productRoutes);
  await fastify.register(catalogueRoutes);
  await fastify.register(cartRoutes);
  await fastify.register(wishlistRoutes);
  await fastify.register(orderRoutes);
  await fastify.register(paymentRoutes);
  await fastify.register(notificationRoutes);
  await fastify.register(adminRoutes);
  await fastify.register(searchRoutes);
}
