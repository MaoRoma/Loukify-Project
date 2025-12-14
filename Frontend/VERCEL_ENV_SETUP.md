# Vercel Environment Variables Setup

## Critical: Set These Environment Variables in Vercel

Your project now uses Next.js API routes that connect directly to Supabase. You **MUST** set these environment variables in Vercel for the project to work.

### Step 1: Go to Vercel Environment Variables

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select: `loukify-project-frontend`
3. Go to: **Settings** → **Environment Variables**

### Step 2: Add Required Variables

Add these environment variables (select **Production**, **Preview**, and **Development** for each):

#### 1. Supabase Configuration
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- **Environment**: Production, Preview, Development

- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Your Supabase anon/public key
- **Environment**: Production, Preview, Development

- **Name**: `SUPABASE_SERVICE_ROLE_KEY` (Optional but recommended)
- **Value**: Your Supabase service_role key (for admin operations)
- **Environment**: Production, Preview, Development

#### 2. Backend API (Optional - only if you deploy backend separately)
- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: Your backend API URL (e.g., `https://your-backend.railway.app`)
- **Environment**: Production, Preview, Development
- **Note**: If not set, the app will use Next.js API routes (recommended)

### Step 3: Where to Find Supabase Credentials

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 5: Verify It Works

1. Visit: `https://loukify.website`
2. Try to customize your store
3. Check browser console - API errors should be gone
4. Store name and subdomain should save properly

## Troubleshooting

### Still Getting 404/405 Errors?

1. **Check environment variables are set**: Go to Vercel → Settings → Environment Variables
2. **Verify Supabase credentials are correct**
3. **Redeploy after adding variables**: Environment variables only apply to new deployments
4. **Check browser console**: Look for specific error messages

### "Backend not configured" Error?

- Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Redeploy after adding variables

### Store Not Saving?

- Check if you're logged in (authentication required)
- Check browser console for specific errors
- Verify Supabase RLS policies allow your user to write to `store_templates` table

## What Changed?

✅ Created Next.js API routes that connect directly to Supabase
✅ No need for separate Express backend deployment
✅ Works fully on Vercel without additional services
✅ All store template operations (save, publish, get) now work

## Next Steps

1. ✅ Set environment variables in Vercel (see above)
2. ✅ Redeploy your project
3. ✅ Test store customization
4. ✅ Publish a store with subdomain
5. ✅ Test subdomain: `https://yourstore.loukify.website`

