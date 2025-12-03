-- Templates Table Schema
-- Compatible with Supabase (PostgreSQL)
-- Stores template customization (Theme, Header, Section, Footer)

-- Drop existing templates/store_templates tables if they exist
DROP TABLE IF EXISTS store_templates CASCADE;
DROP TABLE IF EXISTS templates CASCADE;

CREATE TABLE templates (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Template Name
    template_name TEXT NOT NULL,
    
    -- Theme Part (stored as JSONB for flexibility)
    theme_part JSONB DEFAULT '{}'::jsonb,
    -- Example structure: { primary_color, secondary_color, font_family, background_color, etc. }
    
    -- Header Part (stored as JSONB)
    header_part JSONB DEFAULT '{}'::jsonb,
    -- Example structure: { logo_url, title, menu_style, font_color, etc. }
    
    -- Section Part (stored as JSONB)
    section_part JSONB DEFAULT '{}'::jsonb,
    -- Example structure: { layout, card_style, columns, text_color, etc. }
    
    -- Footer Part (stored as JSONB)
    footer_part JSONB DEFAULT '{}'::jsonb,
    -- Example structure: { background_color, text_color, social_links, etc. }
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Constraints
    CONSTRAINT template_name_not_empty CHECK (length(trim(template_name)) > 0)
);

-- Indexes
CREATE INDEX idx_templates_name ON templates(template_name);
CREATE INDEX idx_templates_created_at ON templates(created_at DESC);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view templates"
    ON templates FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert templates"
    ON templates FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update templates"
    ON templates FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Users can delete templates"
    ON templates FOR DELETE
    TO authenticated
    USING (true);

