# Loukify Project Structure

## 📋 Overview

This document outlines the complete database schema and API structure for the Loukify e-commerce platform with support for multiple pages: Home, Products, Orders, Customers, Settings, Analytics, and Online Store (Templates).

## 🗂️ Database Schema

### Tables

1. **sellers** - Seller profiles
2. **store_templates** - Store templates with subdomains and settings
3. **products** - Product catalog
4. **customers** - Customer information
5. **orders** - Order information
6. **order_items** - Individual items in orders

### Page-to-Table Mapping

| Page | Table(s) | Key Fields |
|------|----------|------------|
| **Home Page** | `store_templates` | `subdomain`, `store_name`, `domain` |
| **Products Page** | `products` | `name`, `category`, `price`, `stock`, `image_urls` |
| **Orders Page** | `orders`, `order_items` | `order_id`, `customer_id`, `total_price`, `created_at` |
| **Customers Page** | `customers` | `customer_name`, `customer_email`, `customer_phone`, `customer_location` |
| **Settings Page** | `store_templates` | `store_name`, `store_email`, `store_address`, `store_phone` |
| **Analytics Page** | Aggregated from multiple tables | Summary statistics |
| **Online Store** | `store_templates` | Template selection and customization |

## 🚀 API Endpoints

### Home Page (Store Templates)

- `GET /api/store-templates` - List all stores with subdomains
- `GET /api/store-templates/:id` - Get single store
- `POST /api/store-templates` - Create new store
- `PUT /api/store-templates/:id` - Update store
- `PUT /api/store-templates/:id/settings` - Update store settings
- `DELETE /api/store-templates/:id` - Delete store

### Products Page

- `GET /api/products` - List products with summary statistics
- `GET /api/products/summary` - Get product statistics only
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Summary Statistics:**
- Total Products
- Total Value (inventory value: price × stock)
- Categories Count
- Low Stock Count

### Orders Page

- `GET /api/orders` - List orders with summary statistics
- `GET /api/orders/summary` - Get order statistics only
- `GET /api/orders/:id` - Get single order with items
- `POST /api/orders` - Create order with items
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

**Summary Statistics:**
- Total Orders
- Total Revenue
- Status Counts (pending, processing, completed, etc.)

### Customers Page

- `GET /api/customers` - List customers with summary statistics
- `GET /api/customers/summary` - Get customer statistics only
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

**Summary Statistics:**
- Total Customers

### Settings Page

- `PUT /api/store-templates/:id/settings` - Update store settings
  - `store_name`
  - `store_email`
  - `store_address`
  - `store_phone`

### Analytics Page

Analytics can be built by aggregating data from:
- `GET /api/products/summary` - Product analytics
- `GET /api/orders/summary` - Order analytics
- `GET /api/customers/summary` - Customer analytics

## 📊 Database Schema Details

### store_templates Table

**Fields:**
- `id` (UUID) - Primary key
- `seller_id` (UUID) - Foreign key to sellers
- `store_name` (TEXT) - Store name
- `domain` (TEXT) - Domain name
- `subdomain` (TEXT, UNIQUE) - Subdomain for store
- `store_email` (TEXT) - Store email (Settings)
- `store_address` (TEXT) - Store address (Settings)
- `store_phone` (TEXT) - Store phone (Settings)
- Theme customization fields
- Header customization fields
- Product section customization fields
- About section customization fields
- Footer customization fields

### products Table

**Fields:**
- `id` (UUID) - Primary key
- `seller_id` (UUID) - Foreign key to sellers
- `template_id` (UUID) - Foreign key to store_templates
- `name` (TEXT) - Product name
- `description` (TEXT) - Product description
- `category` (TEXT) - Product category
- `price` (NUMERIC) - Product price
- `currency` (TEXT) - Currency code
- `sku` (TEXT) - Stock Keeping Unit
- `stock` (INTEGER) - Stock quantity
- `image_urls` (JSONB) - Array of image URLs
- `is_active` (BOOLEAN) - Active status

### orders Table

**Fields:**
- `id` (UUID) - Primary key
- `order_id` (TEXT) - Human-readable order ID
- `seller_id` (UUID) - Foreign key to sellers
- `customer_id` (UUID) - Foreign key to customers
- `template_id` (UUID) - Foreign key to store_templates
- `total_price` (NUMERIC) - Total order price
- `currency` (TEXT) - Currency code
- `status` (TEXT) - Order status (pending, processing, completed, cancelled, refunded)
- `payment_status` (TEXT) - Payment status
- `shipping_address` (TEXT) - Shipping address
- `created_at` (TIMESTAMP) - Order date

### customers Table

**Fields:**
- `id` (UUID) - Primary key
- `seller_id` (UUID) - Foreign key to sellers
- `customer_name` (TEXT) - Customer name
- `customer_email` (TEXT) - Customer email
- `customer_phone` (TEXT) - Customer phone
- `customer_location` (TEXT) - Customer location
- `customer_address` (TEXT) - Customer address
- `customer_city` (TEXT) - Customer city
- `customer_country` (TEXT) - Customer country
- `customer_postal_code` (TEXT) - Postal code

### order_items Table

**Fields:**
- `id` (UUID) - Primary key
- `order_id` (UUID) - Foreign key to orders
- `product_id` (UUID) - Foreign key to products
- `quantity` (INTEGER) - Item quantity
- `price` (NUMERIC) - Price at time of order
- `product_name` (TEXT) - Product name snapshot
- `product_sku` (TEXT) - Product SKU snapshot

## 🔒 Security

All tables have Row Level Security (RLS) enabled. Sellers can only access their own data:
- Own products
- Own customers
- Own orders
- Own store templates

## 📝 Migration Guide

### For New Databases

Run `schema/complete_schema.sql` in Supabase SQL Editor.

### For Existing Databases

1. Run `schema/migrate_store_templates.sql` to add subdomain and settings fields
2. Run `schema/customers.sql` to create customers table
3. Run `schema/orders.sql` to create orders table
4. Run `schema/order_items.sql` to create order_items table

## 🧪 Testing

All endpoints require authentication via JWT token in the `Authorization` header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Example: Get Products

```bash
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Example: Create Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "customer-uuid",
    "order_items": [
      {
        "product_id": "product-uuid",
        "quantity": 2,
        "price": 25.00,
        "product_name": "Product Name",
        "product_sku": "SKU-001"
      }
    ],
    "status": "pending"
  }'
```

## 📚 Next Steps

1. Run the database migrations in Supabase
2. Test all API endpoints
3. Integrate with frontend
4. Add analytics aggregations
5. Add payment processing integration
6. Add email notifications

## 🐛 Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Ensure user is authenticated and has seller role
2. **Foreign Key Errors**: Ensure related records exist (customer, product, etc.)
3. **Unique Constraint Errors**: Check for duplicate subdomains, SKUs, or emails
4. **Missing Columns**: Run migration scripts for existing databases

### Debug Mode

Set `NODE_ENV=development` in `.env` to see detailed error messages.






