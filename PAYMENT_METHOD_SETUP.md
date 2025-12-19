# Payment Method Image Setup Guide

## Overview
This feature allows sellers to upload a payment method image (e.g., QR code for ABA Bank) in the Settings page, which will then be displayed to customers at checkout.

## What Was Changed

### 1. Database Migration
- **File**: `schema/migrate_add_payment_method_image.sql`
- **Action**: Adds `payment_method_image` column to the `settings` table
- **Run this SQL in Supabase SQL Editor** before deploying

### 2. Store Settings Page
- **File**: `Frontend/src/components/admin/setting/StoreSetting.tsx`
- **Changes**:
  - Added "Payment Method" section with image upload UI
  - Added image preview functionality
  - Added ability to remove/replace uploaded image
  - Integrated with existing image upload API (`/api/storage/upload-image`)

### 3. Backend Settings Route
- **File**: `routes/settings.js`
- **Changes**:
  - Updated `POST /api/settings` to accept `payment_method_image`
  - Updated `PUT /api/settings/:id` to accept `payment_method_image`
  - Updated `PUT /api/settings/store` to accept `payment_method_image`

### 4. Store Template API
- **File**: `Frontend/src/app/api/store-templates/subdomain/[subdomain]/route.ts`
- **Changes**:
  - Fetches `payment_method_image` from settings when loading store by subdomain
  - Includes `payment_method_image` in the response for public store pages

### 5. Checkout Page
- **File**: `Frontend/src/components/admin/online-store/customize/preview/CheckoutPageStore.tsx`
- **Changes**:
  - Added `paymentMethodImage` prop
  - Displays uploaded payment method image if available
  - Falls back to default "ABA Bank" button if no image is uploaded

### 6. Public Store Page
- **File**: `Frontend/src/app/store/[subdomain]/page.tsx`
- **Changes**:
  - Added `payment_method_image` to `StoreTemplate` interface
  - Passes `payment_method_image` to `CheckoutPage` component

## Setup Instructions

### Step 1: Run Database Migration
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run the SQL from `schema/migrate_add_payment_method_image.sql`:
   ```sql
   ALTER TABLE settings
   ADD COLUMN IF NOT EXISTS payment_method_image TEXT;
   ```

### Step 2: Deploy Backend Changes
If you're using a separate backend (Railway/Express):
1. Deploy the updated `routes/settings.js` file
2. The backend will now accept and store `payment_method_image`

### Step 3: Deploy Frontend Changes
1. Commit and push all changes to GitHub
2. Vercel will automatically redeploy
3. The new Payment Method section will appear in Settings → Store tab

## How to Use

### For Sellers:
1. Go to **Settings** → **Store** tab
2. Scroll down to the **Payment Method** section
3. Click "Upload Payment Method Image" or drag and drop an image
4. Select your payment QR code image (e.g., ABA Bank QR code)
5. The image will be uploaded and previewed
6. Click **Save Changes** to save the image
7. The image will now appear in the checkout page for customers

### For Customers:
1. When customers reach the checkout page
2. They will see the uploaded payment method image in the "Payment Method" section
3. They can scan the QR code to complete payment
4. If no image is uploaded, they'll see a default "ABA Bank" button

## Technical Details

### Image Storage
- Images are uploaded to Supabase Storage bucket: `product_image`
- Images are publicly accessible via Supabase public URLs
- Maximum file size: 10MB
- Supported formats: JPG, PNG, GIF

### Data Flow
1. Seller uploads image → Stored in Supabase Storage
2. Image URL saved in `settings.payment_method_image`
3. When store is loaded by subdomain → Payment method image is fetched
4. Checkout page displays the image to customers

## Troubleshooting

### Image not showing in checkout?
- Check that the image was successfully uploaded (check Settings page)
- Verify the SQL migration was run
- Check browser console for errors
- Ensure the store template is published

### Image upload fails?
- Check that Supabase Storage bucket `product_image` exists
- Verify bucket has public access enabled
- Check RLS policies on the bucket
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel

### Payment method image not loading?
- Check that settings are linked to store template (via `settings_id`)
- Verify the image URL is valid and accessible
- Check network tab in browser dev tools

## Files Modified
- `schema/migrate_add_payment_method_image.sql` (NEW)
- `Frontend/src/components/admin/setting/StoreSetting.tsx`
- `routes/settings.js`
- `Frontend/src/app/api/store-templates/subdomain/[subdomain]/route.ts`
- `Frontend/src/components/admin/online-store/customize/preview/CheckoutPageStore.tsx`
- `Frontend/src/app/store/[subdomain]/page.tsx`

