# Database Migration Instructions

## Problem: Missing Columns in Products Table

The error "Could not find the 'product_category' column" means your `products` table is missing columns that the backend expects.

## Quick Fix

### Option 1: Add Missing Columns Only (Recommended)

Run this in Supabase SQL Editor:

```sql
-- Add product_category column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_category TEXT;

-- Add product_status column (if missing)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_status TEXT DEFAULT 'active';

-- Update existing rows
UPDATE products SET product_status = 'active' WHERE product_status IS NULL;

-- Make it NOT NULL
ALTER TABLE products 
ALTER COLUMN product_status SET NOT NULL;

-- Add product_image column (if missing)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_image TEXT;

-- Add updated_at column (if missing)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(product_category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(product_status);
```

### Option 2: Run Complete Migration Script

1. Open Supabase SQL Editor
2. Copy and paste the contents of `schema/migrate_fix_products_table.sql`
3. Run the script
4. It will safely add all missing columns

## Expected Products Table Structure

After migration, your `products` table should have:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Yes | Primary key |
| `product_name` | TEXT | Yes | Product name |
| `product_description` | TEXT | No | Product description |
| `product_price` | NUMERIC(10,2) | Yes | Product price |
| `product_category` | TEXT | No | Product category |
| `product_status` | TEXT | Yes | active/inactive/out_of_stock |
| `product_image` | TEXT | No | Image URL |
| `created_at` | TIMESTAMP | Yes | Creation time |
| `updated_at` | TIMESTAMP | Yes | Last update time |

## Verify Migration

After running the migration, verify with:

```sql
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
```

You should see all columns listed above.

## If You Still Get Errors

1. **Check table name**: Make sure it's `products` (plural), not `product` (singular)
2. **Refresh Supabase cache**: Sometimes Supabase caches schema. Try:
   - Wait a few seconds
   - Refresh the page
   - Or restart your backend server
3. **Check RLS policies**: Make sure Row Level Security allows INSERT operations

## Next Steps

After fixing the products table, you may also need to fix:
- `customers` table (rename `customer_address` → `customer_location`)
- `store` table (rename to `settings`)
- `template` table (rename to `templates`)

See the main analysis document for details.

