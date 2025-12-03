# Backend Server Setup Guide

## Problem: "Endpoint not found" Errors

### Root Cause
The backend server is **not running** or **crashing on startup** because:
1. Missing `.env` file with Supabase credentials
2. Server can't connect to database
3. Server crashes silently

## Solution: Complete Setup

### Step 1: Create `.env` File

Create a `.env` file in the root directory (`/Users/apple/Desktop/Loukify-project/.env`) with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Optional: Development auth bypass
ALLOW_DEV_AUTH_BYPASS=true
DEV_USER_ID=00000000-0000-0000-0000-000000000000
DEV_USER_EMAIL=dev@sandbox.local
DEV_USER_ROLE=seller
```

**How to get Supabase credentials:**
1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`
   - **anon public key** → `SUPABASE_ANON_KEY`

### Step 2: Stop All Running Servers

```bash
# Kill all node processes on port 3001
lsof -ti:3001 | xargs kill -9

# Or kill all node processes (be careful!)
pkill -f "node.*server.js"
```

### Step 3: Start Backend Server

```bash
cd /Users/apple/Desktop/Loukify-project
npm run dev:backend
```

**You should see:**
```
🚀 Server running on port 3001
📚 API Documentation: http://localhost:3001
🏥 Health Check: http://localhost:3001/health
```

### Step 4: Verify Backend is Running

Open a new terminal and test:
```bash
curl http://localhost:3001/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "...",
  "environment": "development"
}
```

### Step 5: Test API Endpoints

```bash
# Test products endpoint (should work in dev mode without auth)
curl http://localhost:3001/api/products
```

**Expected response:**
```json
{
  "success": true,
  "data": [...]
}
```

### (Optional) Dev Auth Bypass Explained

During early development you might not have Supabase Auth wired up. Set `ALLOW_DEV_AUTH_BYPASS=true` (and optionally `DEV_USER_ID`, `DEV_USER_EMAIL`, `DEV_USER_ROLE`) in `.env` to let the backend pretend every request comes from a fixed developer account. **Never enable this in production.** When you finish integrating your real authentication, remove the bypass variables so the API requires valid Supabase access tokens again.

## Troubleshooting

### Error: "Missing required Supabase environment variables"
- **Solution:** Create `.env` file with all required variables (see Step 1)

### Error: "Cannot connect to database"
- **Solution:** Check Supabase credentials are correct
- Verify Supabase project is active

### Error: "Port 3001 already in use"
- **Solution:** 
  ```bash
  lsof -ti:3001 | xargs kill -9
  ```

### Server starts but endpoints return 404
- **Solution:** Check server logs for errors
- Verify routes are registered in `server.js`
- Make sure you're accessing `http://localhost:3001` (not 3000)

## Quick Start Commands

```bash
# Terminal 1 - Backend
cd /Users/apple/Desktop/Loukify-project
npm run dev:backend

# Terminal 2 - Frontend (after backend is running)
cd /Users/apple/Desktop/Loukify-project/Frontend
npm run dev
```

## Important Notes

1. **Backend MUST run before frontend** - Frontend depends on backend API
2. **Development mode** - Authentication is bypassed in dev mode (no token needed)
3. **Port 3001** - Backend runs on 3001, frontend on 3000
4. **Environment variables** - Required for Supabase connection

## Verification Checklist

- [ ] `.env` file exists with Supabase credentials
- [ ] Backend server starts without errors
- [ ] `curl http://localhost:3001/health` returns success
- [ ] `curl http://localhost:3001/api/products` returns data (or empty array)
- [ ] Frontend can connect to backend (check browser console)

