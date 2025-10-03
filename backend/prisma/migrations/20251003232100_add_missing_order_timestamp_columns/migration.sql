-- Add missing timestamp columns to Order table
-- Safe/idempotent migration - checks for column existence first

DO $$
BEGIN
    -- Add confirmedAt if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Order' AND column_name = 'confirmedAt'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "confirmedAt" TIMESTAMP(3);
        RAISE NOTICE 'Added column Order.confirmedAt';
    END IF;

    -- Add shippedAt if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Order' AND column_name = 'shippedAt'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "shippedAt" TIMESTAMP(3);
        RAISE NOTICE 'Added column Order.shippedAt';
    END IF;

    -- Add deliveredAt if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Order' AND column_name = 'deliveredAt'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "deliveredAt" TIMESTAMP(3);
        RAISE NOTICE 'Added column Order.deliveredAt';
    END IF;

    -- Add cancelledAt if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Order' AND column_name = 'cancelledAt'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "cancelledAt" TIMESTAMP(3);
        RAISE NOTICE 'Added column Order.cancelledAt';
    END IF;

    -- Add deliveryCompany if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Order' AND column_name = 'deliveryCompany'
    ) THEN
        -- First create the enum type if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'DeliveryCompany') THEN
            CREATE TYPE "DeliveryCompany" AS ENUM ('YALIDINE', 'ZR_EXPRESS', 'JET_EXPRESS');
            RAISE NOTICE 'Created enum DeliveryCompany';
        END IF;
        
        ALTER TABLE "Order" ADD COLUMN "deliveryCompany" "DeliveryCompany";
        RAISE NOTICE 'Added column Order.deliveryCompany';
    END IF;

    -- Add trackingNumber if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'Order' AND column_name = 'trackingNumber'
    ) THEN
        ALTER TABLE "Order" ADD COLUMN "trackingNumber" TEXT;
        RAISE NOTICE 'Added column Order.trackingNumber';
    END IF;

END $$;
