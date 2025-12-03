-- Orders Table Schema
-- Compatible with Supabase (PostgreSQL)
-- Stores order information

-- Drop existing orders and order_items tables if they exist
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Order Information
    order_id TEXT NOT NULL UNIQUE, -- Human-readable order ID (e.g., "ORD-2024-001")
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE RESTRICT,
    total_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    date TIMESTAMP WITH TIME ZONE DEFAULT now(), -- Order date

    -- Order items snapshot (JSON array)
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

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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
