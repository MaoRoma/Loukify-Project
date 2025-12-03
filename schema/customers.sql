-- Customers Table Schema
-- Compatible with Supabase (PostgreSQL)
-- Stores customer information

-- Drop existing customers table if it exists (to recreate with new structure)
DROP TABLE IF EXISTS customers CASCADE;

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

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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
