# Payment Images Table Setup Guide

## ✅ What Has Been Fixed

1. **Backend (`routes/settings.js`)**:
   - All payment image saves now use the `upsertPaymentImage` helper function
   - Properly deactivates old images before inserting new ones
   - Enhanced error handling and logging
   - Saves to `payment_images` table when you upload and save payment method images

2. **Frontend API Route (`Frontend/src/app/api/store-templates/subdomain/[subdomain]/route.ts`)**:
   - **PRIMARY**: Fetches from `payment_images` table first
   - **FALLBACK 1**: Falls back to `settings` table via `settings_id`
   - **FALLBACK 2**: Falls back to `settings` table via user email
   - Proper error handling if table doesn't exist yet

## 🔧 Required Setup Steps

### Step 1: Create the `payment_images` Table in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `schema/migrate_add_payment_images.sql`
4. Click **Run** to execute the migration
5. Verify the table was created:
   - Go to **Table Editor**
   - You should see a new table called `payment_images`

### Step 2: Test the Implementation

1. **Upload a Payment Method Image**:
   - Go to **Settings** → **Store** tab
   - Scroll to **Payment Method** section
   - Click **Upload New Image** or **Choose File**
   - Select your QR code image
   - Click **Save Payment Method** button

2. **Verify in Database**:
   - Go to Supabase → **Table Editor** → `payment_images`
   - You should see a new row with:
     - `image_url`: Your uploaded image URL
     - `is_active`: `true`
     - `store_template_id`: Your store template ID
     - `user_id`: Your user ID

3. **Test on Checkout Page**:
   - Visit your public store (e.g., `https://your-subdomain.loukify.website`)
   - Add a product to cart
   - Go to checkout
   - Click the **ABA Bank** button
   - The payment QR code image should display

## 🔍 Debugging

### If payment image doesn't show:

1. **Check Browser Console**:
   - Look for `[Payment Method] PRIMARY SUCCESS` message
   - If you see `payment_images table does not exist yet`, run the migration

2. **Check Supabase Logs**:
   - Go to Supabase → **Logs** → **Postgres Logs**
   - Look for any errors related to `payment_images` table

3. **Check Database**:
   - Verify `payment_images` table exists
   - Check if there's a row with `is_active = true` for your store
   - Verify `image_url` is not null or empty

### Console Messages to Look For:

- ✅ `[upsertPaymentImage] ✅ Successfully saved payment image to payment_images table`
- ✅ `[Payment Method] ✅ PRIMARY SUCCESS: Found via payment_images table`
- ⚠️ `[Payment Method] ⚠️ payment_images table does not exist yet` → Run migration
- ❌ `[Payment Method] ❌ Error fetching payment_images` → Check database connection

## 📋 How It Works

### Saving Payment Image:
```
User uploads image → Supabase Storage → Image URL saved to:
1. payment_images table (PRIMARY - new dedicated table)
2. settings.payment_method_image (for backward compatibility)
```

### Fetching Payment Image:
```
1. Query payment_images table by store_template_id WHERE is_active = true
   ↓ (if not found)
2. Query settings table by settings_id
   ↓ (if not found)
3. Query settings table by user email
   ↓ (if not found)
4. Return null (no payment method configured)
```

## 🎯 Key Features

- ✅ Only one active payment image per store template
- ✅ Automatic deactivation of old images when new one is uploaded
- ✅ Backward compatible with existing `settings.payment_method_image`
- ✅ Proper error handling and logging
- ✅ Multi-tenancy (each store has isolated payment images)

