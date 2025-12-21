# Customer Email Multiple Orders Fix

## Problem
Customers couldn't use the same email address to place multiple orders. When trying to place a second order with the same email, they got an error: "Customer with this email already exists".

## Solution
Changed the system to use a "get or create" pattern that allows customers to place multiple orders with the same email address.

## What Was Changed

### 1. Database Migration (`schema/migrate_remove_customer_email_unique.sql`)
- **Removed**: Global unique constraint on `customer_email`
- **Result**: Same email can now be used multiple times to place orders
- **Note**: Customers are still scoped to stores (via `store_id`), so multi-tenancy is maintained

### 2. Backend Route (`routes/customers.js`)
- **Updated**: `POST /api/customers` endpoint
- **New Behavior**:
  - Checks if customer with email already exists for this store
  - If exists: Updates customer info (if changed) and reuses the customer
  - If not exists: Creates a new customer record
  - Returns existing customer ID so multiple orders can be linked to the same customer

### 3. Frontend Checkout (`CheckoutPageStore.tsx`)
- **Updated**: `handlePlaceOrder` function
- **New Behavior**:
  - Calls the backend API which handles customer reuse automatically
  - Logs whether customer was reused or created
  - No changes needed in the checkout flow - it just works!

## How It Works Now

### Customer Places First Order:
1. Customer fills checkout form with email: `customer@example.com`
2. Backend creates new customer record
3. Order is created and linked to this customer
4. ✅ Order placed successfully

### Customer Places Second Order (Same Email):
1. Customer fills checkout form with same email: `customer@example.com`
2. Backend finds existing customer with this email
3. Backend updates customer info if it changed (name, address, phone)
4. Backend returns the existing customer ID
5. Order is created and linked to the same customer
6. ✅ Order placed successfully - same customer, multiple orders!

## Database Migration Required

**IMPORTANT**: You must run this SQL in Supabase before deploying:

```sql
-- Remove the unique constraint on customer_email
DROP INDEX IF EXISTS idx_customers_email_unique;
```

Run this in Supabase SQL Editor:
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the SQL from `schema/migrate_remove_customer_email_unique.sql`
3. Click Run

## Benefits

✅ **Customers can place multiple orders** with the same email  
✅ **Customer info is updated** if they provide new information  
✅ **Same customer record is reused** for multiple orders (better analytics)  
✅ **Multi-tenancy maintained** - same email can exist in different stores  
✅ **No breaking changes** - existing functionality still works  

## Testing

1. **Place first order**:
   - Go to checkout
   - Enter email: `test@example.com`
   - Place order
   - ✅ Should succeed

2. **Place second order with same email**:
   - Go to checkout again
   - Enter same email: `test@example.com`
   - Place order
   - ✅ Should succeed (no error about email existing)

3. **Verify in database**:
   - Check `customers` table - should see one customer record
   - Check `orders` table - should see multiple orders linked to same `customer_id`

## Notes

- The same customer can now place unlimited orders
- Customer information (name, address, phone) is updated if it changes
- Each order is still a separate record in the `orders` table
- Customer analytics will show total orders per customer correctly
- Multi-tenancy is maintained - customers are scoped to stores via `store_id`

