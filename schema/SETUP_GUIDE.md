# Products Table Setup Guide

## Quick Start

### Option 1: New Database Setup
If you're starting fresh, run the complete schema:

```sql
-- Run this in Supabase SQL Editor
-- File: complete_schema.sql
```

### Option 2: Update Existing Table
If you already have a products table, run the migration:

```sql
-- Run this in Supabase SQL Editor
-- File: migrate_products_table.sql
```

## What's Changed

### ✅ New Features

1. **Enhanced Constraints**
   - Product name cannot be empty or whitespace
   - Category cannot be empty if provided (must be NULL or valid text)

2. **Optimized Indexes**
   - Composite indexes for common dashboard queries
   - Filtered indexes for better performance
   - Indexes for seller + active, seller + category, seller + template

3. **Better Defaults**
   - `image_urls` defaults to empty array `[]`
   - Existing NULL `image_urls` are updated to `[]`

### 📊 Dashboard Workflow Support

The updated schema supports:

- **Summary Statistics**: Total products, total value, categories count, low stock
- **Product Listing**: Filtering by seller, template, category, active status
- **Fast Queries**: Optimized indexes for common query patterns

## Verification

After running the schema/migration, verify with:

```sql
-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'products';

-- Check constraints
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'products'::regclass;
```

## API Endpoints

After updating the schema, your API endpoints will work with:

- `GET /api/products` - Returns summary + products list
- `GET /api/products/summary` - Returns summary statistics only
- `POST /api/products` - Create product (requires category)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Need Help?

See `README.md` for detailed documentation.






