-- Migration: Remove unique constraint on customer_email to allow same email multiple times
-- This allows customers to place multiple orders with the same email
-- Run this SQL in Supabase SQL Editor

-- Step 1: Remove the old global unique constraint on customer_email
DROP INDEX IF EXISTS idx_customers_email_unique;

-- Step 2: Create a new unique constraint scoped to store_id + customer_email
-- This allows the same email in different stores, but prevents exact duplicates in the same store
-- However, we'll allow multiple orders from the same email, so we'll just remove the constraint entirely
-- If you want to prevent exact duplicates (same email + same store), uncomment the line below:
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_store_email_unique 
-- ON customers(store_id, customer_email) 
-- WHERE store_id IS NOT NULL;

-- Note: We're removing the unique constraint entirely to allow customers to place multiple orders
-- The same customer can now place multiple orders with the same email address

