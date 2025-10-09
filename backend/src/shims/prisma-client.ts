// Runtime shim for '@prisma/client' to unblock build after migrating to Supabase.
// Provides minimal enums/constants used across the codebase.

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum SubscriptionStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  TRIAL = 'TRIAL',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum SubscriptionPlan {
  STANDARD = 'STANDARD',
  PRO = 'PRO',
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

// Export a loose Prisma namespace to satisfy type references
export const Prisma: any = {};

export enum DeliveryCompany {
  YALIDINE = 'YALIDINE',
  ZR_EXPRESS = 'ZR_EXPRESS',
  JET_EXPRESS = 'JET_EXPRESS',
}
