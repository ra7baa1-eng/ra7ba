-- Temporarily remove descriptionAr column from Tenant to unblock registration
-- This column is not used in registration flow and can be added back later safely

DO $$ 
BEGIN
    -- Check if column exists, if yes drop it
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'Tenant' 
        AND column_name = 'descriptionAr'
    ) THEN
        ALTER TABLE "Tenant" DROP COLUMN "descriptionAr";
        RAISE NOTICE 'Column descriptionAr removed from Tenant table';
    ELSE
        RAISE NOTICE 'Column descriptionAr does not exist in Tenant table';
    END IF;
END $$;
