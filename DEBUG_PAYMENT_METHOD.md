# Debugging Payment Method Image Issue

## Current Problem
The console shows `payment_method_image is missing from store data`, which means the API route isn't finding the payment method image.

## Step-by-Step Debugging

### Step 1: Verify Image Was Uploaded

1. **Log in to your admin panel**
2. **Go to Settings → Store tab**
3. **Check the Payment Method section**:
   - Do you see an image preview?
   - If YES → Image was uploaded
   - If NO → You need to upload an image first

### Step 2: Verify Image Was Saved to Database

1. **Go to Supabase Dashboard**
2. **Open SQL Editor**
3. **Run this query** (replace `your-email@example.com` with your actual email):
   ```sql
   SELECT 
     id,
     email_address,
     store_name,
     payment_method_image,
     created_at
   FROM settings
   WHERE email_address = 'your-email@example.com'
   ORDER BY created_at DESC
   LIMIT 1;
   ```

4. **Check the results**:
   - Does `payment_method_image` have a value?
   - If YES → Image is saved ✅
   - If NO → Image wasn't saved (see Step 3)

### Step 3: Add settings_id Column (CRITICAL - DO THIS FIRST!)

**IMPORTANT**: The `settings_id` column doesn't exist in your `store_templates` table yet. You MUST run this migration first:

1. **In Supabase SQL Editor, run this migration**:
   ```sql
   -- Add settings_id column to store_templates table (if it doesn't exist)
   ALTER TABLE store_templates 
   ADD COLUMN IF NOT EXISTS settings_id UUID REFERENCES settings(id) ON DELETE SET NULL;

   -- Create index for the foreign key
   CREATE INDEX IF NOT EXISTS idx_store_templates_settings_id ON store_templates(settings_id);
   ```

2. **After running the migration, verify Settings Are Linked**:
   ```sql
   SELECT 
     st.id as store_template_id,
     st.store_subdomain,
     st.settings_id,
     st.user_id,
     s.id as settings_id_from_settings,
     s.email_address,
     s.payment_method_image
   FROM store_templates st
   LEFT JOIN settings s ON s.id = st.settings_id
   WHERE st.store_subdomain = 'your-subdomain';
   ```
   (Replace `your-subdomain` with your actual subdomain, e.g., `kit`)

3. **Check the results**:
   - Is `settings_id` NULL?
   - Does `payment_method_image` have a value in the `settings` table?
   - If `settings_id` is NULL but `payment_method_image` exists → We need to link them (see Step 4)

### Step 4: Link Existing Settings to Store Templates (If Needed)

If `settings_id` is NULL but you have a `payment_method_image` in settings, run this to automatically link them:

```sql
-- Link store_templates to settings based on user email
UPDATE store_templates 
SET settings_id = (
    SELECT s.id 
    FROM settings s 
    WHERE EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = store_templates.user_id 
        AND au.email = s.email_address
    )
    ORDER BY s.created_at DESC
    LIMIT 1
)
WHERE settings_id IS NULL;
```

This will automatically link each store template to the settings record that matches the user's email.

### Step 5: Check Server Logs (Vercel)

The API route logs are server-side, so you need to check Vercel logs:

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to "Deployments" tab**
4. **Click on the latest deployment**
5. **Click "Functions" tab**
6. **Look for logs with `[Payment Method]` prefix**
7. **Check what the logs say**:
   - `✅ Found via settings_id` → Image was found ✅
   - `✅ Found via user email (fallback)` → Image was found via fallback ✅
   - `❌ No payment method image found` → Image wasn't found ❌
   - `⚠️ No settings_id` → Settings aren't linked ⚠️
   - `❌ No settings found` → Settings don't exist ❌

### Step 6: Re-upload Image (If Needed)

If the image wasn't saved properly:

1. **Go to Settings → Store tab**
2. **Remove the current image** (if any)
3. **Upload a new payment QR code image**
4. **Wait for the auto-save to complete** (check console for success message)
5. **Verify in Supabase** (Step 2) that the image URL is saved
6. **Refresh your store page** and check again

## Common Issues and Solutions

### Issue 1: Image Uploads But Doesn't Save
**Solution**: Check browser console for errors during upload. Make sure you're logged in and the auto-save function runs.

### Issue 2: Settings Exist But settings_id is NULL
**Solution**: Run the manual fix SQL query (Step 4) to link them.

### Issue 3: Image Exists But API Can't Find It
**Solution**: 
- Check that `email_address` in settings matches your user email
- Check that `user_id` in store_templates matches your user ID
- The fallback should work, but linking `settings_id` is better

### Issue 4: Multiple Settings Records
**Solution**: The query uses `ORDER BY created_at DESC LIMIT 1`, so it should get the latest one. But if you have multiple, you might want to delete old ones.

## Quick Test Query

**First, make sure you've run Step 3 to add the `settings_id` column!**

Then run this in Supabase SQL Editor to see everything at once:

```sql
-- Get store template info with payment method image status
SELECT 
  st.id as store_template_id,
  st.store_subdomain,
  st.settings_id,
  st.user_id,
  au.email as user_email,
  s.id as settings_record_id,
  s.email_address as settings_email,
  s.payment_method_image,
  CASE 
    WHEN st.settings_id IS NULL THEN '⚠️ Not linked'
    WHEN s.payment_method_image IS NULL THEN '❌ No image'
    WHEN s.payment_method_image = '' THEN '⚠️ Empty string'
    ELSE '✅ Has image'
  END as image_status
FROM store_templates st
LEFT JOIN auth.users au ON au.id = st.user_id
LEFT JOIN settings s ON (s.id = st.settings_id OR s.email_address = au.email)
WHERE st.store_subdomain = 'your-subdomain'
ORDER BY s.created_at DESC NULLS LAST
LIMIT 1;
```

(Replace `your-subdomain` with your actual subdomain, e.g., `kit`)

This will show you:
- If store template exists
- If settings_id is linked
- If user email matches settings email
- If payment_method_image exists
- The status of the image

## Next Steps

After running these checks:
1. **If image exists but isn't linked**: Run the manual fix SQL
2. **If image doesn't exist**: Re-upload it in Settings
3. **If everything looks correct**: Check Vercel server logs for API route errors

