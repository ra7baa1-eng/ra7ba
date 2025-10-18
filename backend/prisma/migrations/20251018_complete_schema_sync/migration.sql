-- Complete Schema Sync Migration
-- This migration ensures production database matches Prisma schema

-- ==============================================
-- 1. ADD MISSING ENUM VALUES FIRST
-- ==============================================

-- Add FREE to SubscriptionPlan if not exists
DO $$ BEGIN
  ALTER TYPE "SubscriptionPlan" ADD VALUE IF NOT EXISTS 'FREE';
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Add STANDARD to SubscriptionPlan if not exists
DO $$ BEGIN
  ALTER TYPE "SubscriptionPlan" ADD VALUE IF NOT EXISTS 'STANDARD';
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Add PRO to SubscriptionPlan if not exists
DO $$ BEGIN
  ALTER TYPE "SubscriptionPlan" ADD VALUE IF NOT EXISTS 'PRO';
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Add YALIDINE to DeliveryCompany if not exists
DO $$ BEGIN
  ALTER TYPE "DeliveryCompany" ADD VALUE IF NOT EXISTS 'YALIDINE';
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Add ZR_EXPRESS to DeliveryCompany if not exists
DO $$ BEGIN
  ALTER TYPE "DeliveryCompany" ADD VALUE IF NOT EXISTS 'ZR_EXPRESS';
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Add JET_EXPRESS to DeliveryCompany if not exists
DO $$ BEGIN
  ALTER TYPE "DeliveryCompany" ADD VALUE IF NOT EXISTS 'JET_EXPRESS';
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- ==============================================
-- 2. NOW UPDATE DATA TO USE NEW ENUM VALUES
-- ==============================================

-- Update DeliveryCompany enum (remove ECOLOG, keep YALIDINE, ZR_EXPRESS, JET_EXPRESS)
DO $$ BEGIN
  -- Only update if ECOLOG exists
  UPDATE "Order" SET "deliveryCompany" = 'YALIDINE'::"DeliveryCompany" WHERE "deliveryCompany"::text = 'ECOLOG';
EXCEPTION WHEN OTHERS THEN
  -- If enum doesn't have ECOLOG, continue
  NULL;
END $$;

-- Update SubscriptionPlan enum (convert BASIC/PREMIUM to FREE)
DO $$ BEGIN
  UPDATE "Subscription" SET "plan" = 'FREE'::"SubscriptionPlan" WHERE "plan"::text IN ('BASIC', 'PREMIUM');
  UPDATE "Payment" SET "plan" = 'FREE'::"SubscriptionPlan" WHERE "plan"::text IN ('BASIC', 'PREMIUM');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Update SubscriptionStatus enum (remove PAST_DUE)
DO $$ BEGIN
  UPDATE "Subscription" SET "status" = 'EXPIRED'::"SubscriptionStatus" WHERE "status" = 'PAST_DUE'::"SubscriptionStatus";
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Update TenantStatus enum (remove CANCELLED)
DO $$ BEGIN
  UPDATE "Tenant" SET "status" = 'SUSPENDED'::"TenantStatus" WHERE "status" = 'CANCELLED'::"TenantStatus";
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- ==============================================
-- 2. ADD MISSING COLUMNS TO PRODUCT
-- ==============================================

-- SEO fields
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "seoKeywords" TEXT;

-- Shipping and dimensions
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "weight" DECIMAL(10,2);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "weightUnit" TEXT DEFAULT 'kg';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "length" DECIMAL(10,2);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "width" DECIMAL(10,2);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "height" DECIMAL(10,2);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "dimensionUnit" TEXT DEFAULT 'cm';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "shippingFee" DECIMAL(10,2);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "freeShipping" BOOLEAN DEFAULT false;

-- Stock management
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "lowStockAlert" INTEGER;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "allowBackorder" BOOLEAN DEFAULT false;

-- JSON fields
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "bulkPricing" JSONB DEFAULT '[]';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "badges" JSONB DEFAULT '[]';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "relatedProducts" JSONB DEFAULT '[]';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "crossSellProducts" JSONB DEFAULT '[]';

-- Ensure stock column exists
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "stock" INTEGER DEFAULT 0;

-- Ensure comparePrice column exists
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "comparePrice" DECIMAL(10,2);

-- ==============================================
-- 3. ADD MISSING COLUMNS TO TENANT
-- ==============================================

ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "checkoutConfig" JSONB;

-- ==============================================
-- 4. FIX PAYMENT TABLE
-- ==============================================

-- Remove old columns that don't exist in new schema
ALTER TABLE "Payment" DROP COLUMN IF EXISTS "months";
ALTER TABLE "Payment" DROP COLUMN IF EXISTS "submittedAt";

-- Ensure amount is correct type
ALTER TABLE "Payment" ALTER COLUMN "amount" TYPE DECIMAL(10,2);

-- ==============================================
-- 5. CREATE NOTIFICATION TABLE IF NOT EXISTS
-- ==============================================

CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT PRIMARY KEY,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "data" JSONB,
  "isRead" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Notification_isRead_idx" ON "Notification"("isRead");
CREATE INDEX IF NOT EXISTS "Notification_createdAt_idx" ON "Notification"("createdAt");

-- ==============================================
-- 6. CREATE PLANFEATUREFLAGS TABLE IF NOT EXISTS
-- ==============================================

CREATE TABLE IF NOT EXISTS "PlanFeatureFlags" (
  "id" TEXT PRIMARY KEY,
  "plan" "SubscriptionPlan" NOT NULL UNIQUE,
  "variantsEnabled" BOOLEAN DEFAULT false,
  "quantityDiscountsEnabled" BOOLEAN DEFAULT false,
  "checkoutCustomizationEnabled" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Insert default feature flags if not exists
INSERT INTO "PlanFeatureFlags" ("id", "plan", "variantsEnabled", "quantityDiscountsEnabled", "checkoutCustomizationEnabled")
VALUES 
  (gen_random_uuid(), 'FREE', true, true, true),
  (gen_random_uuid(), 'STANDARD', true, true, false),
  (gen_random_uuid(), 'PRO', true, true, true)
ON CONFLICT ("plan") DO NOTHING;

-- ==============================================
-- 7. ADD UNIQUE CONSTRAINT TO SETTING.KEY
-- ==============================================

CREATE UNIQUE INDEX IF NOT EXISTS "Setting_key_key" ON "Setting"("key");

-- ==============================================
-- 8. ENSURE ALL PRODUCT JSON FIELDS HAVE DEFAULTS
-- ==============================================

UPDATE "Product" SET "images" = '[]' WHERE "images" IS NULL OR "images" = 'null';
UPDATE "Product" SET "bulkPricing" = '[]' WHERE "bulkPricing" IS NULL OR "bulkPricing" = 'null';
UPDATE "Product" SET "badges" = '[]' WHERE "badges" IS NULL OR "badges" = 'null';
UPDATE "Product" SET "relatedProducts" = '[]' WHERE "relatedProducts" IS NULL OR "relatedProducts" = 'null';
UPDATE "Product" SET "crossSellProducts" = '[]' WHERE "crossSellProducts" IS NULL OR "crossSellProducts" = 'null';

-- ==============================================
-- DONE! Schema should now match Prisma
-- ==============================================
