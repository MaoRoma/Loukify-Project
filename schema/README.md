# Database Schema Documentation

This directory contains SQL schema files for the Loukify e-commerce platform.

## 📁 Files Overview

### Core Schema Files

1. **`sellers.sql`** - Seller profiles table
2. **`store_templates.sql`** - Store templates/designs table
3. **`products.sql`** - Products table (optimized for dashboard workflow)
4. **`complete_schema.sql`** - Complete schema with all tables in correct order

### Migration Files

5. **`migrate_products_table.sql`** - Migration script to update existing products table

## 🚀 Setup Instructions

### For New Databases

If you're setting up a fresh database, use the complete schema:

1. Open your Supabase SQL Editor
2. Copy and paste the contents of `complete_schema.sql`
3. Run the script
4. Verify tables are created: `sellers`, `store_templates`, `products`

### For Existing Databases

If you already have a products table and want to optimize it:

1. Open your Supabase SQL Editor
2. Copy and paste the contents of `migrate_products_table.sql`
3. Run the script
4. Verify indexes and constraints are added

## 📊 Products Table Schema

### Fields

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | UUID | Primary key | Yes (auto-generated) |
| `seller_id` | UUID | Foreign key to sellers table | Yes |
| `template_id` | UUID | Foreign key to store_templates table | Yes |
| `name` | TEXT | Product name | Yes |
| `description` | TEXT | Product description | No |
| `category` | TEXT | Product category | No |
| `price` | NUMERIC(10,2) | Product price | Yes (default: 0.00) |
| `currency` | TEXT | Currency code | Yes (default: 'USD') |
| `sku` | TEXT | Stock Keeping Unit | No (unique per seller) |
| `stock` | INTEGER | Stock quantity | Yes (default: 0) |
| `image_urls` | JSONB | Array of image URLs | No (default: []) |
| `is_active` | BOOLEAN | Product active status | Yes (default: true) |
| `created_at` | TIMESTAMP | Creation timestamp | Yes (auto-generated) |
| `updated_at` | TIMESTAMP | Last update timestamp | Yes (auto-updated) |

### Constraints

- `price_non_negative`: Price must be >= 0
- `stock_non_negative`: Stock must be >= 0
- `name_not_empty`: Name cannot be empty or whitespace
- `category_not_empty_when_provided`: If category is provided, it cannot be empty
- `sku_unique_per_seller`: SKU must be unique per seller (if provided)

### Indexes

The products table is optimized for the dashboard workflow with the following indexes:

#### Composite Indexes (for common query patterns)
- `idx_products_seller_active`: Fast filtering of active products by seller
- `idx_products_seller_category`: Fast category filtering by seller
- `idx_products_seller_template`: Fast template filtering by seller
- `idx_products_seller_created`: Fast sorting by creation date per seller

#### Single Column Indexes
- `idx_products_seller_id`: Foreign key index
- `idx_products_template_id`: Foreign key index
- `idx_products_active`: Filter by active status
- `idx_products_category`: Filter by category (filtered for non-null)
- `idx_products_stock`: Filter by stock level (filtered for stock > 0)
- `idx_products_created_at`: Sort by creation date

#### Unique Indexes
- `idx_products_sku_per_seller`: Ensures SKU uniqueness per seller

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Products Table
- **SELECT**: Sellers can view their own products
- **INSERT**: Sellers can create products for themselves
- **UPDATE**: Sellers can update their own products
- **DELETE**: Sellers can delete their own products

All policies use `auth.uid() = seller_id` to ensure data isolation.

## 🎯 Dashboard Workflow Optimization

The products table is optimized for the dashboard workflow that requires:

1. **Summary Statistics**:
   - Total products count
   - Total inventory value (sum of price × stock)
   - Categories count
   - Low stock count

2. **Product Listing**:
   - Filter by seller
   - Filter by template
   - Filter by category
   - Filter by active status
   - Sort by creation date

3. **Performance**:
   - Composite indexes for common query patterns
   - Filtered indexes to reduce index size
   - Proper foreign key indexes

## 🔄 Migration Guide

### From Old Schema to New Schema

If you have an existing products table without the optimizations:

1. **Backup your data** (always!)
2. Run `migrate_products_table.sql` in Supabase SQL Editor
3. Verify indexes are created: Check the output at the end of the script
4. Test your API endpoints to ensure everything works

### What the Migration Does

1. Adds default value for `image_urls` column
2. Updates NULL `image_urls` to empty arrays
3. Adds new constraints (name_not_empty, category_not_empty_when_provided)
4. Creates optimized composite indexes
5. Creates filtered indexes for better performance
6. Updates category index to be filtered

## 📝 Example Queries

### Get all products for a seller
```sql
SELECT * FROM products 
WHERE seller_id = 'your-seller-id' 
ORDER BY created_at DESC;
```

### Get summary statistics
```sql
SELECT 
    COUNT(*) as total_products,
    SUM(price * stock) as total_value,
    COUNT(DISTINCT category) as categories_count,
    COUNT(*) FILTER (WHERE stock < 20) as low_stock_count
FROM products
WHERE seller_id = 'your-seller-id';
```

### Get products by category
```sql
SELECT * FROM products 
WHERE seller_id = 'your-seller-id' 
AND category = 'Accessories'
AND is_active = true;
```

## ⚠️ Important Notes

1. **Always backup** before running migration scripts
2. **Test in development** first before applying to production
3. **Index creation** may take time on large tables
4. **RLS policies** must match your authentication setup
5. **Foreign keys** require sellers and store_templates tables to exist first

## 🐛 Troubleshooting

### Migration fails with constraint violation
- Check if existing data violates new constraints
- Clean up invalid data before running migration
- Remove empty category strings or set them to NULL

### Indexes not being created
- Check if indexes already exist
- Verify you have proper permissions
- Check Supabase logs for errors

### RLS policies blocking queries
- Verify `auth.uid()` returns the correct user ID
- Check if user has seller role
- Ensure RLS policies match your use case

## 📚 Related Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)






