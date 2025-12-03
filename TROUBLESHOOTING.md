# Troubleshooting Guide

## 404 Error: "Failed to load resource: the server responded with a status of 404"

### Common Causes & Solutions

#### 1. **Backend Server Not Running**
**Symptom:** 404 errors on all API endpoints

**Solution:**
```bash
# Make sure backend is running
cd /Users/apple/Desktop/Loukify-project
npm run dev:backend

# You should see:
# 🚀 Server running on port 3001
# 📚 API Documentation: http://localhost:3001
```

**Verify:**
- Open browser: http://localhost:3001/health
- Should return: `{"success":true,"message":"Server is running",...}`

#### 2. **Frontend Can't Connect to Backend**
**Symptom:** Network errors or "Failed to fetch"

**Check:**
1. Backend is running on port **3001** (not 3000)
2. Frontend `.env.local` exists with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
3. Restart frontend after creating `.env.local`:
   ```bash
   cd Frontend
   npm run dev
   ```

#### 3. **Authentication Issues**
**Symptom:** 401 Unauthorized errors

**Solution:**
- Development mode now allows requests without tokens
- Make sure `NODE_ENV` is not set to `production`
- If you see 401 errors, check browser console for token issues

#### 4. **Route Not Found (404)**
**Symptom:** Specific endpoint returns 404

**Check:**
1. Backend server logs show the request:
   ```
   2024-01-01T12:00:00.000Z - GET /api/products
   ```
2. Route is registered in `server.js`:
   ```javascript
   app.use('/api/products', productRoutes);
   ```
3. Route file exists in `routes/products.js`

### Quick Diagnostic Steps

1. **Test Backend Health:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Test Products Endpoint (with dev mode):**
   ```bash
   curl http://localhost:3001/api/products
   ```
   Should return JSON (may be 401 if auth required, but not 404)

3. **Check Frontend Environment:**
   ```bash
   cd Frontend
   cat .env.local
   ```
   Should show: `NEXT_PUBLIC_API_URL=http://localhost:3001`

4. **Check Browser Network Tab:**
   - Open DevTools → Network tab
   - Look for the failed request
   - Check the actual URL being called
   - Check response status and body

### Recent Fixes Applied

1. ✅ **Development Mode Bypass:** Authentication now allows requests without tokens in development
2. ✅ **Better Error Messages:** Frontend now shows clearer error messages
3. ✅ **Settings Route Fix:** Now returns array format for consistency

### Still Having Issues?

1. **Restart both servers:**
   ```bash
   # Terminal 1 - Backend
   cd /Users/apple/Desktop/Loukify-project
   npm run dev:backend

   # Terminal 2 - Frontend  
   cd /Users/apple/Desktop/Loukify-project/Frontend
   npm run dev
   ```

2. **Check server logs** for any error messages

3. **Verify database connection** - Check Supabase credentials in `.env`

4. **Clear browser cache** and hard refresh (Cmd+Shift+R on Mac)

