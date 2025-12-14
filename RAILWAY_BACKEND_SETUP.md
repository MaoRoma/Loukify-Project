# Railway Backend Setup Guide

## ✅ Your Backend is Deployed on Railway!

Your backend is successfully deployed at: **`loukify-project-production.up.railway.app`**

## 🔧 Configure Vercel to Use Railway Backend

To make your frontend use the Railway backend, you need to set the environment variable in Vercel:

### Step 1: Add Environment Variable in Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `loukify-project-frontend`
3. **Go to**: **Settings** → **Environment Variables**
4. **Add new variable**:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://loukify-project-production.up.railway.app`
   - **Environment**: Select **Production**, **Preview**, and **Development** (all three)
   - Click **Save**

### Step 2: Redeploy Frontend

After adding the environment variable:

1. Go to **Deployments** tab in Vercel
2. Click the **three dots (⋯)** on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 3: Verify It Works

1. Visit your site: `https://loukify.website` or `https://loukify-project-frontend.vercel.app`
2. Open browser console (F12)
3. Try logging in or accessing the dashboard
4. You should **NOT** see any "Failed to fetch" or "404" errors
5. API calls should now go to: `https://loukify-project-production.up.railway.app/api/...`

## 🔍 How It Works

The frontend code automatically detects if `NEXT_PUBLIC_API_URL` is set:

- **If set** (like `https://loukify-project-production.up.railway.app`):
  - ✅ Uses your Railway backend for all API calls
  - ✅ All requests go to: `https://loukify-project-production.up.railway.app/api/...`

- **If NOT set**:
  - ⚠️ Falls back to Next.js API routes (direct Supabase calls)
  - ⚠️ This works but bypasses your Express backend

## 🚨 Important Notes

1. **Make sure Railway backend CORS is configured**:
   - Your `server.js` should allow requests from:
     - `https://loukify.website`
     - `https://loukify-project-frontend.vercel.app`
     - `*.vercel.app` (for preview deployments)

2. **Railway Environment Variables**:
   - Make sure your Railway backend has these environment variables set:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `SUPABASE_ANON_KEY`
     - `FRONTEND_URL=https://loukify.website`
     - `PORT` (Railway sets this automatically)

3. **Test the Backend Directly**:
   - Visit: `https://loukify-project-production.up.railway.app/api/health` (if you have a health endpoint)
   - Or: `https://loukify-project-production.up.railway.app/api/products/public`
   - Should return JSON data (not 404)

## ✅ Verification Checklist

- [ ] `NEXT_PUBLIC_API_URL` is set in Vercel environment variables
- [ ] Value is: `https://loukify-project-production.up.railway.app`
- [ ] Frontend has been redeployed after adding the variable
- [ ] Railway backend is online and accessible
- [ ] CORS is configured in Railway backend
- [ ] No console errors when using the app

## 🐛 Troubleshooting

### Still seeing "Failed to fetch" errors?

1. **Check Railway backend is running**:
   - Go to Railway dashboard
   - Check if deployment is "Active" and healthy

2. **Check CORS configuration**:
   - In `server.js`, make sure CORS allows your Vercel domain
   - See `BACKEND_DEPLOYMENT.md` for CORS setup

3. **Check environment variable**:
   - In Vercel, verify `NEXT_PUBLIC_API_URL` is set correctly
   - Make sure it doesn't have trailing slash: `https://loukify-project-production.up.railway.app` (not `...railway.app/`)

4. **Check browser console**:
   - Look for the actual error message
   - Check Network tab to see which URL is being called

### Backend returns 404?

- Make sure your Railway backend has the correct routes
- Check `server.js` has all the API routes defined
- Verify the backend is using the correct port (Railway sets `PORT` automatically)

