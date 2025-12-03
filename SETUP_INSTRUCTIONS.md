# Setup Instructions - Loukify Database

## 🚀 Quick Start

### Step 1: Run the Complete Schema in Supabase

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Open the file: `schema/complete_schema.sql`
4. **Copy the entire contents** of the file
5. **Paste** into the Supabase SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for success message ✅

This will:
- ✅ Drop old tables (if they exist)
- ✅ Create 5 new tables: `customers`, `products`, `orders`, `settings`, `templates`
- ✅ Set up all indexes, triggers, and RLS policies

### Step 2: Verify Tables Were Created

Run this query in Supabase SQL Editor to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('customers', 'products', 'orders', 'settings', 'templates')
ORDER BY table_name;
```

You should see all 5 tables listed.

## 📊 Database Tables Structure

### 1. **customers** Table
- `customer_id` (UUID, Primary Key)
- `customer_name` (TEXT)
- `customer_email` (TEXT, Unique)
- `customer_phone` (TEXT)
- `customer_location` (TEXT)

### 2. **products** Table
- `id` (UUID, Primary Key)
- `product_name` (TEXT)
- `product_description` (TEXT)
- `product_price` (NUMERIC)
- `product_category` (TEXT)
- `product_status` (TEXT: active/inactive/out_of_stock)
- `product_image` (TEXT - URL)

### 3. **orders** Table
- `id` (UUID, Primary Key)
- `order_id` (TEXT, Unique - e.g., "ORD-2024-001")
- `customer_id` (UUID, Foreign Key → customers.customer_id)
- `total_price` (NUMERIC)
- `date` (TIMESTAMP)

### 4. **settings** Table
- `id` (UUID, Primary Key)
- `first_name` (TEXT)
- `last_name` (TEXT)
- `email_address` (TEXT, Unique)
- `phone_number` (TEXT)
- `store_name` (TEXT)
- `store_description` (TEXT)
- `store_url` (TEXT)

### 5. **templates** Table
- `id` (UUID, Primary Key)
- `template_name` (TEXT)
- `theme_part` (JSONB)
- `header_part` (JSONB)
- `section_part` (JSONB)
- `footer_part` (JSONB)

## 🔌 API Endpoints

After running the schema, your API endpoints are ready:

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get single customer (by customer_id)
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Orders
- `GET /api/orders` - List all orders (with customer info)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Settings
- `GET /api/settings` - Get settings
- `GET /api/settings/:id` - Get single settings
- `POST /api/settings` - Create settings
- `PUT /api/settings/:id` - Update settings
- `DELETE /api/settings/:id` - Delete settings

### Templates
- `GET /api/templates` - List all templates
- `GET /api/templates/:id` - Get single template
- `POST /api/templates` - Create template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

## 📝 Example API Requests

### Create a Product
```bash
POST http://localhost:3000/api/products
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "product_name": "Traditional Cambodian Silk Scarf",
  "product_description": "Handwoven silk scarf",
  "product_price": 25.00,
  "product_category": "Accessories",
  "product_status": "active",
  "product_image": "https://example.com/image.jpg"
}
```

### Create a Customer
```bash
POST http://localhost:3000/api/customers
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "customer_location": "New York, USA"
}
```

### Create an Order
```bash
POST http://localhost:3000/api/orders
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "customer_id": "customer-uuid-here",
  "total_price": 50.00,
  "date": "2024-01-15T10:00:00Z"
}
```

### Create Settings
```bash
POST http://localhost:3000/api/settings
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email_address": "store@example.com",
  "phone_number": "+1234567890",
  "store_name": "My Store",
  "store_description": "A great store",
  "store_url": "https://mystore.com"
}
```

### Create Template
```bash
POST http://localhost:3000/api/templates
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "template_name": "Modern Theme",
  "theme_part": {
    "primary_color": "#FF5733",
    "secondary_color": "#33FF57",
    "font_family": "Arial"
  },
  "header_part": {
    "logo_url": "https://example.com/logo.png",
    "title": "My Store"
  },
  "section_part": {
    "layout": "grid",
    "columns": 3
  },
  "footer_part": {
    "background_color": "#000000",
    "text_color": "#FFFFFF"
  }
}
```

## ⚠️ Important Notes

1. **Customer_ID Consistency**: The `customer_id` in the `customers` table is the same field referenced in the `orders` table. This ensures data consistency.

2. **Order ID Generation**: When creating orders, if you don't provide an `order_id`, the API will auto-generate one like "ORD-1234567890-ABC123".

3. **Foreign Key Constraint**: You cannot delete a customer if they have orders. You must delete the orders first, or the database will prevent deletion.

4. **Authentication**: All endpoints require a JWT token in the Authorization header:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

5. **RLS Policies**: All tables have Row Level Security enabled. Currently set to allow all authenticated users. You may want to customize this based on your needs.

## 🧪 Testing

1. Start your server:
   ```bash
   npm run dev
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:3000/health
   ```

3. Test creating a customer (with auth token):
   ```bash
   curl -X POST http://localhost:3000/api/customers \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"customer_name":"Test","customer_email":"test@example.com"}'
   ```

## 🐛 Troubleshooting

### "relation does not exist"
- Make sure you ran `complete_schema.sql` in Supabase SQL Editor

### "foreign key constraint violation"
- When creating an order, make sure the `customer_id` exists in the customers table first

### "duplicate key value violates unique constraint"
- Email addresses must be unique in customers and settings tables
- Order IDs must be unique

### "permission denied"
- Check your RLS policies
- Make sure you're authenticated with a valid JWT token

## ✅ Next Steps

1. ✅ Run `complete_schema.sql` in Supabase
2. ✅ Verify tables were created
3. ✅ Start your server: `npm run dev`
4. ✅ Test API endpoints
5. ✅ Integrate with your frontend

Your database is now ready to use! 🎉

