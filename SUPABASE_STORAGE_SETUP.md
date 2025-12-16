# Supabase Storage Setup for Product Images

## ✅ You've Created the Bucket!

You've already created the `product_image` bucket in Supabase. Now we need to make sure it's configured correctly.

## 🔧 Required Configuration

### Step 1: Make Bucket Public

1. Go to Supabase Dashboard → **Storage**
2. Click on your `product_image` bucket
3. Go to **Settings** tab
4. Make sure **Public bucket** is **enabled** (toggle ON)
   - This allows images to be accessed via public URLs

### Step 2: Check RLS Policies (Important!)

1. In your `product_image` bucket, go to **Policies** tab
2. You should see policies that allow uploads

**If there are NO policies or uploads are blocked:**

Create a policy to allow authenticated users to upload:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product_image' AND
  auth.role() = 'authenticated'
);

-- Allow public read access (for displaying images)
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product_image');
```

**Or use Supabase Dashboard:**
1. Go to **Storage** → `product_image` → **Policies**
2. Click **New Policy**
3. Select **For full customization** → **Create policy from scratch**
4. Policy name: `Allow authenticated uploads`
5. Allowed operation: `INSERT`
6. Target roles: `authenticated`
7. USING expression: `bucket_id = 'product_image'`
8. WITH CHECK expression: `bucket_id = 'product_image'`
9. Click **Review** → **Save policy**

5. Create another policy for public read:
   - Policy name: `Allow public read`
   - Allowed operation: `SELECT`
   - Target roles: `public`
   - USING expression: `bucket_id = 'product_image'`

### Step 3: Verify Bucket Settings

Make sure:
- ✅ Bucket name is exactly: `product_image` (singular, lowercase with underscore)
- ✅ Public bucket: **Enabled**
- ✅ File size limit: At least 10MB (or "Unset")
- ✅ Allowed MIME types: `image/*` or "Any"

## 🧪 Test Upload

After configuring:

1. Try uploading an image in your product form
2. Check browser console for any errors
3. If upload succeeds, check Supabase Storage → `product_image` bucket to see the file

## 🐛 Common Issues

### Error: "Bucket not found"
- **Solution**: Make sure bucket name is exactly `product_image` (check spelling)

### Error: "new row violates row-level security"
- **Solution**: Create RLS policies as shown above

### Error: "Upload failed"
- **Solution**: 
  1. Check browser console for detailed error
  2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
  3. Make sure bucket is public
  4. Check RLS policies allow uploads

### Images upload but don't display
- **Solution**: Make sure bucket has public read policy

## ✅ Verification Checklist

- [ ] Bucket `product_image` exists in Supabase Storage
- [ ] Bucket is set to **Public**
- [ ] RLS policy allows authenticated users to INSERT
- [ ] RLS policy allows public users to SELECT (read)
- [ ] File size limit is at least 10MB
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
- [ ] Can upload images successfully
- [ ] Images display in store after upload

