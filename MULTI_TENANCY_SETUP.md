# Multi-Tenancy Setup Guide

## ✅ What Was Done

Multi-tenancy has been implemented for **products**, **customers**, and **orders** to ensure each store has completely isolated data. Here's what changed:

### 1. Database Migrations

Three migration SQL files were created:

- **`schema/migrate_add_store_id_to_products.sql`** (already existed)
- **`schema/migrate_add_store_id_to_customers.sql`** (NEW)
- **`schema/migrate_add_store_id_to_orders.sql`** (NEW)

Each migration:
- Adds a `store_id` column (UUID, references `store_templates(id)`)
- Creates an index for faster filtering
- Includes example RLS policies (commented out)

### 2. Backend Route Updates

#### `routes/customers.js`
- ✅ Added `getStoreForUser()` helper function
- ✅ Added `GET /api/customers/summary` endpoint for analytics
- ✅ All endpoints now filter by `store_id`:
  - `GET /api/customers` - only returns customers for the authenticated user's store
  - `GET /api/customers/:id` - verifies customer belongs to user's store
  - `POST /api/customers` - automatically sets `store_id` to user's store
  - `PUT /api/customers/:id` - only updates customers in user's store
  - `DELETE /api/customers/:id` - only deletes customers from user's store

#### `routes/orders.js`
- ✅ Added `getStoreForUser()` helper function
- ✅ Added `GET /api/orders/summary` endpoint for analytics
- ✅ All endpoints now filter by `store_id`:
  - `GET /api/orders` - only returns orders for the authenticated user's store
  - `GET /api/orders/:id` - verifies order belongs to user's store
  - `POST /api/orders` - automatically sets `store_id` and verifies customer belongs to same store
  - `PUT /api/orders/:id` - only updates orders in user's store, verifies customer if updated
  - `DELETE /api/orders/:id` - only deletes orders from user's store

#### `routes/products.js`
- ✅ Already updated in previous changes
- ✅ All endpoints filter by `store_id`
- ✅ `GET /api/products/summary` endpoint exists

### 3. Frontend API Updates

#### `Frontend/src/lib/api/config.ts`
- ✅ Added `products.getSummary()` method
- ✅ Added `customers.getSummary()` method
- ✅ Added `orders.getSummary()` method
- ✅ Updated `orders.create()` to accept `order_items` parameter

**Note:** The frontend components (`TableCustomer.tsx`, `TableOrder.tsx`, `StateProduct.tsx`) already use `api.customers.getAll()`, `api.orders.getAll()`, and `api.products.getAll()`, which will automatically work with store isolation since the backend now filters by `store_id`.

---

## 🚀 What You Need to Do

### Step 1: Run Database Migrations

You **MUST** run these SQL migrations in Supabase before deploying the backend changes:

1. **Open Supabase Dashboard** → Your Project → **SQL Editor**

2. **Run `migrate_add_store_id_to_customers.sql`**:
   ```sql
   ALTER TABLE customers
   ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES store_templates(id);
   
   CREATE INDEX IF NOT EXISTS idx_customers_store_id ON customers(store_id);
   ```

3. **Run `migrate_add_store_id_to_orders.sql`**:
   ```sql
   ALTER TABLE orders
   ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES store_templates(id);
   
   CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);
   ```

4. **Verify `products` table has `store_id`** (if you haven't already):
   - Check if `migrate_add_store_id_to_products.sql` was already run
   - If not, run it as well

### Step 2: Update Existing Data (Important!)

After running the migrations, you need to assign `store_id` to existing records:

#### For Products:
```sql
-- Update existing products to belong to their creator's store
-- This assumes products have a user_id or seller_id column
-- Adjust based on your actual schema
UPDATE products p
SET store_id = (
  SELECT st.id 
  FROM store_templates st 
  WHERE st.user_id = p.user_id  -- Adjust column name as needed
  LIMIT 1
)
WHERE store_id IS NULL;
```

#### For Customers:
```sql
-- If customers were created by specific users, link them to those users' stores
-- Otherwise, you may need to manually assign or leave NULL (they won't show up until assigned)
UPDATE customers c
SET store_id = (
  SELECT st.id 
  FROM store_templates st 
  WHERE st.user_id = c.user_id  -- Adjust based on your schema
  LIMIT 1
)
WHERE store_id IS NULL;
```

#### For Orders:
```sql
-- Link orders to the store of the customer who placed them
UPDATE orders o
SET store_id = (
  SELECT c.store_id
  FROM customers c
  WHERE c.customer_id = o.customer_id
  LIMIT 1
)
WHERE store_id IS NULL;
```

**⚠️ Important:** If you have existing data without a clear way to determine which store it belongs to, you may need to:
- Manually assign `store_id` values
- Or delete old data and start fresh
- Or create a migration script based on your business logic

### Step 3: Deploy Backend Changes

1. **Commit and push** the updated route files:
   ```bash
   git add routes/customers.js routes/orders.js
   git commit -m "Add multi-tenancy support for customers and orders"
   git push
   ```

2. **Redeploy your backend** (Railway, Vercel, etc.)

### Step 4: Test Multi-Tenancy

1. **Create two test stores** with different user accounts:
   - Store 1: User A creates store, adds products, customers, orders
   - Store 2: User B creates store, adds products, customers, orders

2. **Verify isolation**:
   - Log in as User A → Should only see Store 1's data
   - Log in as User B → Should only see Store 2's data
   - Products, customers, and orders should be completely separate

3. **Test public store pages**:
   - Visit `store1.loukify.website` → Should only show Store 1's products
   - Visit `store2.loukify.website` → Should only show Store 2's products

---

## 📊 Analytics Endpoints

The following summary endpoints are now available for analytics (all filtered by store):

- `GET /api/products/summary` - Product statistics (total, active, inactive, total value, average price)
- `GET /api/customers/summary` - Customer statistics (total customers)
- `GET /api/orders/summary` - Order statistics (total orders, total revenue, average order value)

You can use these in your analytics components for better performance instead of fetching all records.

---

## 🔒 Security Notes

1. **RLS Policies**: The migration files include example RLS policies (commented out). Consider enabling them in Supabase for additional security:
   - Go to **Authentication** → **Policies**
   - Create policies that ensure users can only access data from their own store

2. **Backend Validation**: The backend routes now validate that:
   - All queries filter by `store_id`
   - New records are automatically assigned to the user's store
   - Updates/deletes only affect records from the user's store
   - Orders can only reference customers from the same store

---

## ✅ Verification Checklist

- [ ] Run `migrate_add_store_id_to_customers.sql` in Supabase
- [ ] Run `migrate_add_store_id_to_orders.sql` in Supabase
- [ ] Verify `products` table has `store_id` column
- [ ] Update existing data to assign `store_id` values
- [ ] Commit and push backend changes
- [ ] Redeploy backend
- [ ] Test with two different stores/users
- [ ] Verify data isolation works correctly
- [ ] Test public store pages show correct products

---

## 🐛 Troubleshooting

### "Store not found for this user"
- **Cause**: User hasn't created a store template yet
- **Fix**: User must create a store template first (via the customize store page)

### "Customer not found or does not belong to your store"
- **Cause**: Trying to create an order with a customer from a different store
- **Fix**: Ensure the customer was created by the same user/store

### Existing data not showing up
- **Cause**: Existing records have `store_id = NULL`
- **Fix**: Run the UPDATE SQL queries in Step 2 to assign `store_id` values

### Products/Customers/Orders showing from other stores
- **Cause**: Backend not filtering by `store_id` correctly
- **Fix**: 
  1. Verify migrations were run
  2. Check backend logs for errors
  3. Ensure backend is using the updated route files
  4. Verify `getStoreForUser()` is working correctly

---

## 📝 Summary

✅ **Products**: Isolated per store  
✅ **Customers**: Isolated per store  
✅ **Orders**: Isolated per store (and linked to customers from the same store)  
✅ **Analytics**: Summary endpoints available for all three  
✅ **Frontend**: Already compatible (uses existing API calls)  

**Next Steps**: Run migrations → Update existing data → Deploy → Test!

