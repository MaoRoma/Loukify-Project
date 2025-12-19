-- Migration: Add payment_method_image to settings table
-- Run this SQL in Supabase (SQL Editor) before deploying the frontend changes.

-- Add payment_method_image column if missing
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS payment_method_image TEXT;

-- Add comment for documentation
COMMENT ON COLUMN settings.payment_method_image IS 'URL to the payment method QR code or image uploaded by the seller';

