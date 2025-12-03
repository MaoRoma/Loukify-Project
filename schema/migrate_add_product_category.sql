-- Migration: Add product_category column to products table
-- Safe to run multiple times (idempotent)
-- Run this in Supabase SQL Editor

-- Add product_category column if it doesn't exist
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
        
        RAISE NOTICE 'Added product_category column to products table';
    ELSE
        RAISE NOTICE 'product_category column already exists';
    END IF;
END $$;

-- Create index on product_category if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_products_category ON products(product_category);

-- Verify the column was added
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'products' 
AND column_name = 'product_category';

