-- Alternative Migration: Add user_id to settings table
-- This creates a direct link from settings to the authenticated user

-- Add user_id column to settings table
ALTER TABLE settings 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for the foreign key
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);

-- Make user_id NOT NULL after adding the column
-- (You'll need to populate existing records first)
-- ALTER TABLE settings ALTER COLUMN user_id SET NOT NULL;

-- Add unique constraint to ensure one settings record per user
-- ALTER TABLE settings ADD CONSTRAINT settings_user_id_unique UNIQUE (user_id);