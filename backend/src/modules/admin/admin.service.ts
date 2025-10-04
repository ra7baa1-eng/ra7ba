import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { PaymentStatus, SubscriptionStatus, TenantStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Get all tenants with pagination
  async getAllTenants(page = 1, limit = 10, status?: TenantStatus) {
    // Ensure page and limit are valid numbers
    const validPage = Math.max(1, parseInt(String(page)) || 1);
    const validLimit = Math.max(1, Math.min(100, parseInt(String(limit)) || 10));
    const skip = (validPage - 1) * validLimit;
    
    const where = status ? { status } : {};
    
    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          subscription: {
            select: {
              plan: true,
              status: true,
              currentPeriodEnd: true,
            },
          },
          _count: {
            select: {
              products: true,
              orders: true,
            },
          },
        },
        skip,
        take: validLimit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenant.count({ where }),
    ]);

    return {
      data: tenants,
      meta: {
        total,
        page: validPage,
        limit: validLimit,
        totalPages: Math.ceil(total / validLimit),
      },
    };
  }

  // Get pending payment approvals
  async getPendingPayments() {
    return this.prisma.payment.findMany({
      where: { status: PaymentStatus.PENDING },
      include: {
        subscription: {
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                subdomain: true,
                owner: {
                  select: {
                    name: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Approve payment
  async approvePayment(paymentId: string, adminId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        subscription: {
          include: { tenant: true },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Calculate subscription period (1 month)
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    // Update payment, subscription, and tenant in transaction
    return this.prisma.$transaction(async (tx) => {
      // Approve payment
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.APPROVED,
          approvedBy: adminId,
          approvedAt: new Date(),
        },
      });

      // Update subscription
      await tx.subscription.update({
        where: { id: payment.subscription.id },
        data: {
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart,
          currentPeriodEnd,
        },
      });

      // Update tenant status
      await tx.tenant.update({
        where: { id: payment.subscription.tenantId },
        data: {
          status: TenantStatus.ACTIVE,
        },
      });

      return { message: 'Payment approved successfully' };
    });
  }

  // Reject payment
  async rejectPayment(paymentId: string, adminId: string, reason: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.REJECTED,
        approvedBy: adminId,
        approvedAt: new Date(),
        rejectionReason: reason,
      },
    });

    return { message: 'Payment rejected' };
  }

  // Platform statistics
  async getPlatformStats() {
    const [
      totalTenants,
      activeTenants,
      trialTenants,
      suspendedTenants,
      totalOrders,
      totalRevenue,
      recentOrders,
    ] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.tenant.count({ where: { status: TenantStatus.ACTIVE } }),
      this.prisma.tenant.count({ where: { status: TenantStatus.TRIAL } }),
      this.prisma.tenant.count({ where: { status: TenantStatus.SUSPENDED } }),
      this.prisma.order.count(),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.APPROVED },
        _sum: { amount: true },
      }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          tenant: {
            select: { name: true, subdomain: true },
          },
        },
      }),
    ]);

    return {
      tenants: {
        total: totalTenants,
        active: activeTenants,
        trial: trialTenants,
        suspended: suspendedTenants,
      },
      orders: {
        total: totalOrders,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
      },
      recentOrders,
    };
  }

  // Suspend tenant
  async suspendTenant(tenantId: string, reason: string) {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: TenantStatus.SUSPENDED },
    });

    return { message: 'Tenant suspended successfully' };
  }

  // Activate tenant
  async activateTenant(tenantId: string) {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: TenantStatus.ACTIVE },
    });

    return { message: 'Tenant activated successfully' };
  }

  // Ensure SUPER_ADMIN exists or reset its password
  async createOrResetAdminUser() {
    const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@ra7ba.com';
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123456';

    const existing = await this.prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
    const hashed = await bcrypt.hash(defaultPassword, 10);

    if (existing) {
      await this.prisma.user.update({
        where: { id: existing.id },
        data: { password: hashed, isActive: true, email: existing.email || defaultEmail },
      });
      return { message: 'Admin password reset to default and activated', email: existing.email || defaultEmail };
    }

    const created = await this.prisma.user.create({
      data: {
        email: defaultEmail,
        password: hashed,
        name: 'Ra7ba Admin',
        phone: '+213555000000',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
    return { message: 'Admin user created', email: created.email };
  }

  // Run feature schema fix (variants, bundles, plan flags, checkoutConfig)
  async applyFeatureSchemaFix() {
    // Ensure pgcrypto extension for gen_random_uuid()
    await this.prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    // Detect Product.id column type to align FKs (uuid or text)
    const prodTypeRow: any = await this.prisma.$queryRawUnsafe(
      `SELECT format_type(a.atttypid, a.atttypmod) AS col_type
       FROM pg_attribute a
       JOIN pg_class c ON a.attrelid = c.oid
       JOIN pg_namespace n ON c.relnamespace = n.oid
       WHERE n.nspname = 'public' AND c.relname = 'Product' AND a.attname = 'id' AND a.attnum > 0 AND NOT a.attisdropped
       LIMIT 1;`
    );
    let productIdType = 'TEXT';
    if (Array.isArray(prodTypeRow) && prodTypeRow[0] && prodTypeRow[0].col_type) {
      const t = String(prodTypeRow[0].col_type).toLowerCase();
      if (t.includes('uuid')) productIdType = 'UUID';
      else if (t.includes('character varying') || t.includes('varchar') || t.includes('text')) productIdType = 'TEXT';
    }

    const sql = `
DO $$
BEGIN
    -- 1) Tenant.checkoutConfig JSON column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'Tenant' AND column_name = 'checkoutConfig'
    ) THEN
        ALTER TABLE "Tenant" ADD COLUMN "checkoutConfig" JSONB;
        RAISE NOTICE 'Added column Tenant.checkoutConfig';
    END IF;

    -- 2) ProductOption table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'ProductOption'
    ) THEN
        CREATE TABLE "ProductOption" (
            id TEXT PRIMARY KEY,
            "productId" ${productIdType} NOT NULL,
            name TEXT NOT NULL,
            position INT NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL
        );
        RAISE NOTICE 'Created table ProductOption';
    END IF;

    -- 3) ProductOptionValue table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'ProductOptionValue'
    ) THEN
        CREATE TABLE "ProductOptionValue" (
            id TEXT PRIMARY KEY,
            "optionId" TEXT NOT NULL,
            value TEXT NOT NULL,
            position INT NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL
        );
        RAISE NOTICE 'Created table ProductOptionValue';
    END IF;

    -- 4) ProductVariant table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'ProductVariant'
    ) THEN
        CREATE TABLE "ProductVariant" (
            id TEXT PRIMARY KEY,
            "productId" ${productIdType} NOT NULL,
            sku TEXT,
            barcode TEXT,
            price DECIMAL(10,2),
            stock INT,
            "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
            options JSONB NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL
        );
        RAISE NOTICE 'Created table ProductVariant';
    END IF;

    -- 5) BundleOffer table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'BundleOffer'
    ) THEN
        CREATE TABLE "BundleOffer" (
            id TEXT PRIMARY KEY,
            "productId" ${productIdType} NOT NULL,
            "minQuantity" INT NOT NULL,
            "bundlePrice" DECIMAL(10,2) NOT NULL,
            "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL
        );
        RAISE NOTICE 'Created table BundleOffer';
    END IF;

    -- 6) PlanFeatureFlags table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'PlanFeatureFlags'
    ) THEN
        CREATE TABLE "PlanFeatureFlags" (
            id TEXT PRIMARY KEY,
            plan "SubscriptionPlan" NOT NULL UNIQUE,
            "variantsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
            "quantityDiscountsEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
            "checkoutCustomizationEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL
        );
        RAISE NOTICE 'Created table PlanFeatureFlags';
    END IF;

    -- 7) FKs and Indexes (create if missing)
    -- ProductOption.productId -> Product.id
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ProductOption_productId_fkey'
    ) THEN
        ALTER TABLE "ProductOption"
            ADD CONSTRAINT "ProductOption_productId_fkey"
            FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- ProductOptionValue.optionId -> ProductOption.id
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ProductOptionValue_optionId_fkey'
    ) THEN
        ALTER TABLE "ProductOptionValue"
            ADD CONSTRAINT "ProductOptionValue_optionId_fkey"
            FOREIGN KEY ("optionId") REFERENCES "ProductOption"(id) ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- ProductVariant.productId -> Product.id
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ProductVariant_productId_fkey'
    ) THEN
        ALTER TABLE "ProductVariant"
            ADD CONSTRAINT "ProductVariant_productId_fkey"
            FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- BundleOffer.productId -> Product.id
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'BundleOffer_productId_fkey'
    ) THEN
        ALTER TABLE "BundleOffer"
            ADD CONSTRAINT "BundleOffer_productId_fkey"
            FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- indexes
    CREATE INDEX IF NOT EXISTS "ProductOption_productId_idx" ON "ProductOption"("productId");
    CREATE INDEX IF NOT EXISTS "ProductOptionValue_optionId_idx" ON "ProductOptionValue"("optionId");
    CREATE INDEX IF NOT EXISTS "ProductVariant_productId_idx" ON "ProductVariant"("productId");
    CREATE INDEX IF NOT EXISTS "ProductVariant_isActive_idx" ON "ProductVariant"("isActive");
    CREATE INDEX IF NOT EXISTS "BundleOffer_productId_idx" ON "BundleOffer"("productId");
    CREATE INDEX IF NOT EXISTS "BundleOffer_isActive_idx" ON "BundleOffer"("isActive");

END $$;

-- Seed default feature flags for plans if missing
INSERT INTO "PlanFeatureFlags" (id, plan, "variantsEnabled", "quantityDiscountsEnabled", "checkoutCustomizationEnabled")
SELECT gen_random_uuid(), 'STANDARD', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM "PlanFeatureFlags" WHERE plan = 'STANDARD');

INSERT INTO "PlanFeatureFlags" (id, plan, "variantsEnabled", "quantityDiscountsEnabled", "checkoutCustomizationEnabled")
SELECT gen_random_uuid(), 'PRO', TRUE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM "PlanFeatureFlags" WHERE plan = 'PRO');
`;

    await this.prisma.$executeRawUnsafe(sql);
    return { message: 'Feature schema fix applied successfully' };
  }
}
