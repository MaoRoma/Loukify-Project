-- Store Templates Table Schema
-- Links sellers to their customized templates
-- Stores customizations and published status

CREATE TABLE IF NOT EXISTS store_templates (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Link to seller/user (from Supabase auth.users)
    user_id UUID NOT NULL, -- References auth.users(id) - the seller/store owner
    
    -- Link to base template (optional - if they started from a template)
    base_template_id UUID,
    
    -- Store name/identifier (can link to settings table via store_name or email)
    store_name TEXT,
    
    -- Customized Template Parts (stored as JSONB)
    theme_part JSONB DEFAULT '{}'::jsonb,
    header_part JSONB DEFAULT '{}'::jsonb,
    section_part JSONB DEFAULT '[]'::jsonb,
    footer_part JSONB DEFAULT '{}'::jsonb,
    
    -- Publication Status
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Store URL/Subdomain (for public access)
    store_subdomain TEXT,
    store_domain TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Constraints
    CONSTRAINT store_name_not_empty CHECK (store_name IS NULL OR length(trim(store_name)) > 0),
    CONSTRAINT subdomain_format CHECK (store_subdomain IS NULL OR store_subdomain ~ '^[a-z0-9-]+$')
);

CREATE INDEX IF NOT EXISTS idx_store_templates_user_id ON store_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_store_templates_base_template_id ON store_templates(base_template_id);
CREATE INDEX IF NOT EXISTS idx_store_templates_subdomain ON store_templates(store_subdomain);
CREATE INDEX IF NOT EXISTS idx_store_templates_published ON store_templates(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_store_templates_created_at ON store_templates(created_at DESC);

DROP TRIGGER IF EXISTS update_store_templates_updated_at ON store_templates;

CREATE TRIGGER update_store_templates_updated_at
    BEFORE UPDATE ON store_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE store_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own store templates"
    ON store_templates FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own store templates"
    ON store_templates FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own store templates"
    ON store_templates FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own store templates"
    ON store_templates FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Public can view published stores"
    ON store_templates FOR SELECT
    TO anon, authenticated
    USING (is_published = true);
