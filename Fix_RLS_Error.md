# 🔧 Fix: "new row violates row-level security policy" Error

## ❌ The Problem

You're seeing this error:
```
new row violates row-level security policy for table "store_templates"
```

**Why this happens:**
- Your Next.js API routes are trying to insert/update data in Supabase
- Supabase has Row Level Security (RLS) enabled on the `store_templates` table
- The code was falling back to using the **anon key** instead of the **service role key**
- The anon key is subject to RLS policies, which blocks the operation

## ✅ The Solution

You need to set the **`SUPABASE_SERVICE_ROLE_KEY`** environment variable in Vercel. The service role key **bypasses RLS policies**, allowing server-side operations to work.

## 📋 Step-by-Step Fix

### Step 1: Get Your Service Role Key

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Find the **"service_role"** key (it's a long JWT token)
5. **⚠️ IMPORTANT**: This key is **secret** - never expose it in client-side code!

### Step 2: Add to Vercel Environment Variables

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `loukify-project-frontend`
3. Go to **Settings** → **Environment Variables**
4. Click **Add New** or find existing `SUPABASE_SERVICE_ROLE_KEY`
5. Set:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Paste your service role key from Supabase
   - **Environment**: Select **Production**, **Preview**, and **Development** (all three)
6. Click **Save**

### Step 3: Verify All Environment Variables

Make sure you have these set in Vercel:

✅ **Required:**
- `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service_role key ⚠️ **THIS IS THE MISSING ONE!**

✅ **Optional (if using Railway backend):**
- `NEXT_PUBLIC_API_URL` = `https://loukify-project-production.up.railway.app`

### Step 4: Redeploy

1. Go to **Deployments** tab in Vercel
2. Click the **three dots (⋯)** on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 5: Test

1. Visit your site: `https://loukify.website` or `https://loukify-project-frontend.vercel.app`
2. Log in to your account
3. Go to **Customize Store**
4. Make some changes
5. Click **Save Draft** or **Public**
6. ✅ Should work without errors now!

## 🔍 How It Works

**Before (Broken):**
```typescript
// Falls back to anon key if service role key is missing
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// ❌ Anon key is subject to RLS → Operation blocked
```

**After (Fixed):**
```typescript
// Only uses service role key (no fallback)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// ✅ Service role key bypasses RLS → Operation succeeds
```

## 🚨 Security Note

- **Service Role Key** = Full database access, bypasses RLS
  - ✅ Use in **server-side code only** (Next.js API routes)
  - ❌ **NEVER** expose in client-side code
  - ❌ **NEVER** commit to Git
  - ✅ Store in environment variables only

- **Anon Key** = Limited access, respects RLS
  - ✅ Safe for client-side code
  - ✅ Can be public (starts with `NEXT_PUBLIC_`)

## 🐛 Still Not Working?

1. **Check Vercel logs:**
   - Go to **Deployments** → Click on latest deployment → **View Function Logs**
   - Look for error messages about missing environment variables

2. **Verify the key is correct:**
   - In Supabase, go to **Settings** → **API**
   - Copy the service_role key again
   - Make sure there are no extra spaces or line breaks

3. **Check environment scope:**
   - Make sure `SUPABASE_SERVICE_ROLE_KEY` is set for **Production**, **Preview**, AND **Development**

4. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

## ✅ Success Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
- [ ] Value is correct (no typos, no extra spaces)
- [ ] Set for all environments (Production, Preview, Development)
- [ ] Frontend has been redeployed after adding the variable
- [ ] Can save store templates without errors
- [ ] Can publish store without errors

