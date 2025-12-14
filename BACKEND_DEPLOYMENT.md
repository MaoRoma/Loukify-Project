# Backend Deployment Guide

## Problem
Your frontend is deployed on Vercel, but the backend Express server is not deployed. This causes "404 Not Found" errors when the frontend tries to call API endpoints like `/api/settings`.

## Solution: Deploy Backend to Railway (Recommended)

Railway is the easiest way to deploy Node.js/Express backends.

### Step 1: Deploy Backend to Railway

1. **Sign up for Railway**: https://railway.app
2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your `Loukify-Project` repository

3. **Configure Deployment**:
   - Railway will auto-detect it's a Node.js project
   - Set **Root Directory** to: `/` (root of repo)
   - Set **Start Command** to: `npm start` or `node server.js`
   - Set **Port** to: `3001` (or use Railway's PORT env var)

4. **Add Environment Variables** in Railway:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_ANON_KEY=your_anon_key
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://loukify.website
   ```

5. **Deploy**:
   - Railway will automatically deploy
   - Once deployed, Railway will give you a URL like: `https://your-project.railway.app`

### Step 2: Configure Vercel Environment Variables

1. **Go to Vercel Dashboard**:
   - Select your project: `loukify-project-frontend`
   - Go to **Settings** → **Environment Variables**

2. **Add Environment Variable**:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your Railway backend URL (e.g., `https://your-project.railway.app`)
   - **Environment**: Production, Preview, Development (select all)
   - Click **Save**

3. **Redeploy**:
   - Go to **Deployments**
   - Click the three dots on the latest deployment
   - Click **Redeploy**

### Step 3: Update CORS in Backend

In your `server.js`, make sure CORS allows your Vercel domain:

```javascript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://loukify.website',
    'https://*.loukify.website',
    'https://loukify-project-frontend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Alternative: Deploy to Render

1. **Sign up**: https://render.com
2. **Create New Web Service**:
   - Connect GitHub repo
   - Select `Loukify-Project`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node

3. **Add Environment Variables** (same as Railway)

4. **Deploy** and get your Render URL

5. **Set `NEXT_PUBLIC_API_URL` in Vercel** to your Render URL

## Quick Test

After deployment:

1. Test backend: Visit `https://your-backend-url.railway.app/health`
2. Should return: `{"success": true, "message": "Server is running"}`

3. Test from frontend:
   - Visit `https://loukify.website`
   - Check browser console - API errors should be gone
   - Settings page should load

## Troubleshooting

- **Still getting 404**: Make sure `NEXT_PUBLIC_API_URL` is set in Vercel and you've redeployed
- **CORS errors**: Update CORS in `server.js` to include your Vercel domain
- **Backend not starting**: Check Railway/Render logs for errors

