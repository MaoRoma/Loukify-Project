-- Products Table Schema
-- Compatible with Supabase (PostgreSQL)
-- Stores product information

-- Drop existing products table if it exists (to recreate with new structure)
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Product Information
    product_name TEXT NOT NULL,
    product_description TEXT,
    product_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    product_category TEXT,
    product_status TEXT NOT NULL DEFAULT 'active', -- active, inactive, out_of_stock
    product_image TEXT, -- URL or path to product image
    product_sku TEXT, -- Stock Keeping Unit
    product_barcode TEXT, -- Product barcode
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Constraints
    CONSTRAINT price_non_negative CHECK (product_price >= 0),
    CONSTRAINT status_valid CHECK (product_status IN ('active', 'inactive', 'out_of_stock')),
    CONSTRAINT name_not_empty CHECK (length(trim(product_name)) > 0)
);

-- Indexes
CREATE INDEX idx_products_category ON products(product_category);
CREATE INDEX idx_products_status ON products(product_status);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_sku ON products(product_sku) WHERE product_sku IS NOT NULL;
CREATE INDEX idx_products_barcode ON products(product_barcode) WHERE product_barcode IS NOT NULL;

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies (assuming seller_id will be added later or managed via auth)
-- For now, allow authenticated users to manage products
CREATE POLICY "Users can view products"
    ON products FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert products"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update products"
    ON products FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Users can delete products"
    ON products FOR DELETE
    TO authenticated
    USING (true);
