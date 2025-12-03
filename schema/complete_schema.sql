-- Complete Schema for Loukify E-commerce Platform
-- Compatible with Supabase (PostgreSQL)
-- 
-- IMPORTANT: Run this file in Supabase SQL Editor
-- This will drop existing tables and create new ones with the correct structure
--
-- Order of creation:
-- 1. Customers (must be first for foreign key in orders)
-- 2. Products
-- 3. Orders (references customers)
-- 4. Settings
-- 5. Templates

-- ============================================
-- STEP 1: Drop existing tables (if they exist)
-- ============================================

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS store_templates CASCADE;

-- ============================================
-- STEP 2: Create Customers Table
-- ============================================

CREATE TABLE customers (
    -- Primary Key (Customer_ID)
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Customer Information
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_location TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Constraints
    CONSTRAINT customer_name_not_empty CHECK (length(trim(customer_name)) > 0),
    CONSTRAINT customer_email_not_empty CHECK (length(trim(customer_email)) > 0)
);

-- Indexes
CREATE INDEX idx_customers_email ON customers(customer_email);
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);

-- Unique constraint on email
CREATE UNIQUE INDEX idx_customers_email_unique ON customers(customer_email);

-- ============================================
-- STEP 3: Create Products Table
-- ============================================

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

-- ============================================
-- STEP 4: Create Orders Table
-- ============================================

CREATE TABLE orders (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Order Information
    order_id TEXT NOT NULL UNIQUE, -- Human-readable order ID (e.g., "ORD-2024-001")
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE RESTRICT,
    total_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    date TIMESTAMP WITH TIME ZONE DEFAULT now(), -- Order date

    -- Order items snapshot
    order_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Constraints
    CONSTRAINT total_price_non_negative CHECK (total_price >= 0),
    CONSTRAINT order_id_not_empty CHECK (length(trim(order_id)) > 0),
    CONSTRAINT order_items_is_array CHECK (jsonb_typeof(order_items) = 'array')
);

-- Indexes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_date ON orders(date DESC);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- STEP 5: Create Settings Table
-- ============================================

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

-- ============================================
-- STEP 6: Create Templates Table
-- ============================================

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

-- ============================================
-- STEP 7: Create Helper Functions and Triggers
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for all tables
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 8: Enable Row Level Security (RLS)
-- ============================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 9: Create RLS Policies
-- ============================================

-- Customers Policies
CREATE POLICY "Users can view customers"
    ON customers FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert customers"
    ON customers FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update customers"
    ON customers FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Users can delete customers"
    ON customers FOR DELETE
    TO authenticated
    USING (true);

-- Products Policies
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

-- Orders Policies
CREATE POLICY "Users can view orders"
    ON orders FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert orders"
    ON orders FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update orders"
    ON orders FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Users can delete orders"
    ON orders FOR DELETE
    TO authenticated
    USING (true);

-- Settings Policies
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

-- Templates Policies
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
