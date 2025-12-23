# Store Subdomain Recovery Guide

## Problem
If your store shows "Store Not Found" after uploading a payment method image, it means the `store_subdomain` in your `store_templates` table was set to `NULL`.

## Solution

### Option 1: Re-publish Your Store (Recommended)
1. Go to your admin dashboard
2. Navigate to **Online Store** → **Customize**
3. Make any small change (or just click **Publish** again)
4. This will regenerate your subdomain

### Option 2: Manual Database Fix (If you have access to Supabase)
1. Go to your Supabase Dashboard
2. Navigate to **Table Editor** → `store_templates`
3. Find your store template (filter by your `user_id` or `store_name`)
4. Check the `store_subdomain` column
5. If it's `NULL`, update it with your original subdomain value (e.g., "haha")
6. Make sure `is_published` is `true`

### Option 3: Check Your Settings
1. Go to **Settings** → **Store**
2. Check the **Store URL** field
3. If it's empty, enter your subdomain (without the domain, just the subdomain part)
4. Click **Save Changes**
5. This should restore your subdomain

## Prevention
The code has been fixed to prevent this issue from happening again:
- When ONLY `payment_method_image` is updated, the `store_subdomain` is never touched
- The subdomain is only updated when you explicitly change the "Store URL" field
- Better error logging has been added to help diagnose issues

## Verification
After fixing, verify your store is accessible:
1. Check the console logs for `[Subdomain API]` messages
2. Visit your store URL: `https://your-subdomain.loukify.website`
3. The store should load without "Store Not Found" error

