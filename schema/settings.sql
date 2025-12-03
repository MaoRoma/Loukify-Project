-- Settings Table Schema
-- Compatible with Supabase (PostgreSQL)
-- Stores store settings information

-- Drop existing settings table if it exists
DROP TABLE IF EXISTS settings CASCADE;

CREATE TABLE settings (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Personal Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email_address TEXT NOT NULL,
    phone_number TEXT,
    
    -- Store Information
    store_name TEXT NOT NULL,
    store_description TEXT,
    store_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Constraints
    CONSTRAINT first_name_not_empty CHECK (length(trim(first_name)) > 0),
    CONSTRAINT last_name_not_empty CHECK (length(trim(last_name)) > 0),
    CONSTRAINT email_address_not_empty CHECK (length(trim(email_address)) > 0),
    CONSTRAINT store_name_not_empty CHECK (length(trim(store_name)) > 0)
);

-- Indexes
CREATE INDEX idx_settings_email ON settings(email_address);
CREATE INDEX idx_settings_store_url ON settings(store_url);

-- Unique constraint on email
CREATE UNIQUE INDEX idx_settings_email_unique ON settings(email_address);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view settings"
    ON settings FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert settings"
    ON settings FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update settings"
    ON settings FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Users can delete settings"
    ON settings FOR DELETE
    TO authenticated
    USING (true);

