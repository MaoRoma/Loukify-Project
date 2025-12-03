# Frontend-Backend Integration Guide

## Overview
This document explains all the changes made to integrate the frontend (Next.js) with the backend (Express.js) API.

## Changes Made

### 1. **API Configuration File** (`Frontend/src/lib/api/config.ts`)
**What it does:**
- Centralized API configuration for all backend requests
- Automatically adds authentication tokens from localStorage
- Provides easy-to-use functions for all API endpoints (products, customers, orders, settings, templates)
- Handles errors consistently across the application

**Why it's important:**
- Single source of truth for API URLs
- Easy to update if backend URL changes
- Consistent error handling
- Reusable across all components

### 2. **Port Configuration**
**Backend (`server.js`):**
- Changed from port 3000 to **port 3001** to avoid conflict with Next.js (which runs on port 3000)

**Frontend:**
- Configured to connect to `http://localhost:3001` (backend)
- Frontend runs on port 3000 (Next.js default)

### 3. **CORS Configuration** (`server.js`)
**What changed:**
- Updated CORS to allow requests from `http://localhost:3000` (frontend)
- Added support for credentials and proper headers

**Why:**
- Browsers block cross-origin requests by default
- CORS allows the frontend to make API calls to the backend

### 4. **Environment Variables**
**Frontend `.env.local` (create this file):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Note:** `.env.local` is gitignored, so you need to create it manually in the `Frontend/` directory.

### 5. **Component Updates**

#### **AddProductCard.tsx**
- **Before:** Only logged to console
- **After:** 
  - Calls `api.products.create()` to save products to database
  - Shows loading state while saving
  - Displays error messages if save fails
  - Navigates to products page on success

#### **TableCustomer.tsx**
- **Before:** Used hardcoded customer data
- **After:**
  - Fetches real customers from API using `api.customers.getAll()`
  - Shows loading state
  - Displays error messages
  - Filters customers based on search query

#### **StateProduct.tsx**
- **Before:** Showed hardcoded statistics (4 products, 1 category, etc.)
- **After:**
  - Calculates real statistics from API data:
    - Total Products: Count of all products
    - Total Value: Sum of all product prices
    - Categories: Count of distinct categories
    - Low Stock: Count of inactive/out_of_stock products

#### **TableProduct.tsx**
- **Before:** Used hardcoded product list
- **After:**
  - Fetches products from API
  - Edit functionality calls `api.products.update()`
  - Delete functionality calls `api.products.delete()`
  - Shows product images if available
  - Displays product status badges

#### **TableOrder.tsx**
- **Before:** Used hardcoded order data
- **After:**
  - Fetches orders from API
  - Enriches orders with customer information
  - Displays order details in dialog
  - Print receipt functionality works with real data

#### **ProfileSetting.tsx**
- **Before:** Only logged to console
- **After:**
  - Fetches existing settings on component mount
  - Saves settings using `api.settings.create()` or `api.settings.update()`
  - Shows success/error messages
  - Includes store name, description, and URL fields

### 6. **Root Package.json Scripts**
Added convenient scripts to run both frontend and backend:
- `npm run dev:backend` - Run backend only
- `npm run dev:frontend` - Run frontend only
- `npm run dev:all` - Run both (requires two terminals)
- `npm run install:all` - Install dependencies for both

## How to Use

### Setup (First Time)
1. **Install backend dependencies:**
   ```bash
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd Frontend
   npm install
   cd ..
   ```

3. **Create frontend environment file:**
   ```bash
   cd Frontend
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
   cd ..
   ```

4. **Set up backend environment:**
   - Create `.env` file in root directory
   - Add your Supabase credentials (see `config/supabase.js`)

### Running the Application

**Option 1: Run separately (recommended for development)**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

**Option 2: Run both (requires manual terminal management)**
```bash
npm run dev:all
```

### Testing the Integration

1. **Start backend:** `npm run dev:backend` (should see "Server running on port 3001")
2. **Start frontend:** `npm run dev:frontend` (should see "Ready on http://localhost:3000")
3. **Open browser:** Navigate to `http://localhost:3000`
4. **Test features:**
   - Add a product → Check if it appears in the products table
   - View customers → Should show real data from database
   - View orders → Should show real orders
   - Update settings → Should save to database

## API Endpoints Available

All endpoints are prefixed with `/api`:

- **Products:** `/api/products` (GET, POST, PUT, DELETE)
- **Customers:** `/api/customers` (GET, POST, PUT, DELETE)
- **Orders:** `/api/orders` (GET, POST, PUT, DELETE)
- **Settings:** `/api/settings` (GET, POST, PUT, DELETE)
- **Templates:** `/api/templates` (GET, POST, PUT, DELETE)

## Common Issues & Solutions

### Issue: "Failed to fetch" or CORS errors
**Solution:** 
- Make sure backend is running on port 3001
- Check CORS configuration in `server.js`
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### Issue: "Cannot connect to API"
**Solution:**
- Check if backend server is running
- Verify backend is on port 3001 (check console output)
- Check network tab in browser DevTools for actual error

### Issue: "401 Unauthorized" errors
**Solution:**
- Authentication tokens need to be stored in localStorage
- Check if `auth_token` is set after login
- Verify authentication middleware in backend routes

### Issue: Data not showing up
**Solution:**
- Check browser console for errors
- Verify database has data (check Supabase dashboard)
- Check network tab to see if API calls are successful
- Verify API response format matches component expectations

## Next Steps

1. **Authentication:** Implement login/logout functionality to set `auth_token` in localStorage
2. **Error Handling:** Add global error handler for API failures
3. **Loading States:** Add skeleton loaders for better UX
4. **Image Upload:** Implement actual image upload for products (currently placeholder)
5. **Order Items:** Add order_items table and relationship if needed
6. **Real-time Updates:** Consider adding Supabase real-time subscriptions for live updates

## File Structure

```
Loukify-project/
├── server.js                    # Backend server (port 3001)
├── routes/                      # API route handlers
├── config/                      # Supabase configuration
├── Frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   └── api/
│   │   │       └── config.ts   # API configuration (NEW)
│   │   └── components/
│   │       └── admin/           # Updated components
│   └── .env.local              # Frontend environment (CREATE THIS)
└── package.json                # Root package.json (UPDATED)
```

## Summary

All frontend components now connect to the backend API instead of using hardcoded data. The integration is complete and ready for testing. Make sure to:

1. ✅ Create `.env.local` in Frontend directory
2. ✅ Run backend on port 3001
3. ✅ Run frontend on port 3000
4. ✅ Test each feature to ensure data flows correctly

The application is now fully integrated and ready for development!

