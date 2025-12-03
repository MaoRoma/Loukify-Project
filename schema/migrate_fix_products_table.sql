-- Migration: Fix products table to match backend expectations
-- This script adds all missing columns that the backend expects
-- Safe to run multiple times (idempotent)
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Add product_category column
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'product_category'
    ) THEN
        ALTER TABLE products 
        ADD COLUMN product_category TEXT;
        
        RAISE NOTICE '✅ Added product_category column';
    ELSE
        RAISE NOTICE 'ℹ️  product_category column already exists';
    END IF;
END $$;

-- ============================================
-- STEP 2: Add product_status column
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'product_status'
    ) THEN
        ALTER TABLE products 
        ADD COLUMN product_status TEXT DEFAULT 'active';
        
        -- Update existing rows to default status
        UPDATE products SET product_status = 'active' WHERE product_status IS NULL;
        
        -- Make it NOT NULL after update
        ALTER TABLE products 
        ALTER COLUMN product_status SET NOT NULL;
        
        RAISE NOTICE '✅ Added product_status column';
    ELSE
        RAISE NOTICE 'ℹ️  product_status column already exists';
    END IF;
END $$;

-- ============================================
-- STEP 3: Add product_image column
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'product_image'
    ) THEN
        ALTER TABLE products 
        ADD COLUMN product_image TEXT;
        
        RAISE NOTICE '✅ Added product_image column';
    ELSE
        RAISE NOTICE 'ℹ️  product_image column already exists';
    END IF;
END $$;

-- ============================================
-- STEP 4: Add updated_at column if missing
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE products 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
        
        RAISE NOTICE '✅ Added updated_at column';
    ELSE
        RAISE NOTICE 'ℹ️  updated_at column already exists';
    END IF;
END $$;

-- ============================================
-- STEP 5: Add constraints
-- ============================================

-- Add status_valid constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conrelid = 'products'::regclass
        AND conname = 'status_valid'
    ) THEN
        ALTER TABLE products 
        ADD CONSTRAINT status_valid 
        CHECK (product_status IN ('active', 'inactive', 'out_of_stock'));
        
        RAISE NOTICE '✅ Added status_valid constraint';
    ELSE
        RAISE NOTICE 'ℹ️  status_valid constraint already exists';
    END IF;
END $$;

-- ============================================
-- STEP 6: Create indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(product_category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(product_status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- ============================================
-- STEP 7: Create/Update trigger for updated_at
-- ============================================

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'update_products_updated_at'
    ) THEN
        CREATE TRIGGER update_products_updated_at
        BEFORE UPDATE ON products
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
        
        RAISE NOTICE '✅ Created updated_at trigger';
    ELSE
        RAISE NOTICE 'ℹ️  updated_at trigger already exists';
    END IF;
END $$;

-- ============================================
-- STEP 8: Verify all columns exist
-- ============================================
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'products' 
ORDER BY ordinal_position;

