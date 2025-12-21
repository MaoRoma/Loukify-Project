-- Migration: Add settings_id column to store_templates table
-- This links store templates to settings records for payment method images
-- Run this in Supabase SQL Editor

-- Step 1: Add settings_id column (if it doesn't exist)
ALTER TABLE store_templates 
ADD COLUMN IF NOT EXISTS settings_id UUID REFERENCES settings(id) ON DELETE SET NULL;

-- Step 2: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_store_templates_settings_id ON store_templates(settings_id);

-- Step 3: Link existing store_templates to settings based on user email
-- This automatically links templates to settings for the same user
UPDATE store_templates 
SET settings_id = (
    SELECT s.id 
    FROM settings s 
    WHERE EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = store_templates.user_id 
        AND au.email = s.email_address
    )
    ORDER BY s.created_at DESC
    LIMIT 1
)
WHERE settings_id IS NULL;

-- Verify the migration worked
SELECT 
    st.store_subdomain,
    st.settings_id,
    s.payment_method_image,
    CASE 
        WHEN st.settings_id IS NULL THEN '⚠️ Not linked'
        WHEN s.payment_method_image IS NULL THEN '❌ No image'
        WHEN s.payment_method_image = '' THEN '⚠️ Empty string'
        ELSE '✅ Has image'
    END as status
FROM store_templates st
LEFT JOIN settings s ON s.id = st.settings_id
ORDER BY st.created_at DESC;

