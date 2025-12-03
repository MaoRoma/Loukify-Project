-- Migration: Add foreign key relationship between store_templates and settings
-- This creates a proper database relationship for data integrity

-- Add settings_id column to store_templates table
ALTER TABLE store_templates 
ADD COLUMN settings_id UUID REFERENCES settings(id) ON DELETE SET NULL;

-- Create index for the foreign key
CREATE INDEX IF NOT EXISTS idx_store_templates_settings_id ON store_templates(settings_id);

-- Update existing store_templates to link with settings based on user_id
-- This matches templates with settings for the same user
UPDATE store_templates 
SET settings_id = (
    SELECT s.id 
    FROM settings s 
    WHERE EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = store_templates.user_id 
        AND au.email = s.email_address
    )
    LIMIT 1
)
WHERE settings_id IS NULL;

-- Alternative update if you prefer matching by store_name
-- UPDATE store_templates 
-- SET settings_id = (
--     SELECT s.id 
--     FROM settings s 
--     WHERE s.store_name = store_templates.store_name
--     LIMIT 1
-- )
-- WHERE settings_id IS NULL AND store_name IS NOT NULL;