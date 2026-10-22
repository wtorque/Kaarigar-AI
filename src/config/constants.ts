/**
 * Domain constants, enums, and system configurations for Kaarigar AI
 */

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  ARTISAN: 'ARTISAN',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_STATUSES = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING: 'PENDING',
} as const;

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

export const ARTISAN_STATUSES = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const;

export type ArtisanStatus = (typeof ARTISAN_STATUSES)[keyof typeof ARTISAN_STATUSES];

export const PRODUCT_STATUSES = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
} as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[keyof typeof PRODUCT_STATUSES];

export const CATALOGUE_JOB_STATUSES = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type CatalogueJobStatus = (typeof CATALOGUE_JOB_STATUSES)[keyof typeof CATALOGUE_JOB_STATUSES];

export const ORDER_STATUSES = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAYMENT_CONFIRMED: 'PAYMENT_CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const PAYMENT_STATUSES = {
  CREATED: 'CREATED',
  PROCESSING: 'PROCESSING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];

export const CURRENCY = {
  INR: 'INR',
  DEFAULT: 'INR',
  MINOR_UNIT_FACTOR: 100, // 1 INR = 100 paise
} as const;

export const INVENTORY_RESERVATION_TTL_SECONDS = 15 * 60; // 15 minutes

export const QUEUE_NAMES = {
  CATALOGUE_PROCESSING: 'catalogue-processing',
  IMAGE_PROCESSING: 'image-processing',
  NOTIFICATIONS: 'notifications',
  INVENTORY_CLEANUP: 'inventory-cleanup',
} as const;

export const REDIS_KEYS = {
  PRODUCT_CACHE_PREFIX: 'cache:product:',
  CATEGORY_CACHE_PREFIX: 'cache:category:',
  INVENTORY_RESERVATION_PREFIX: 'inv:reserve:',
  RATE_LIMIT_PREFIX: 'rl:',
  IDEMPOTENCY_PREFIX: 'idempotency:',
} as const;
