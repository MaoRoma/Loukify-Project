# Subdomain Setup Guide for Vercel

This guide explains how to set up working subdomains for your Loukify stores on Vercel.

## Overview

When a user publishes their store with a subdomain (e.g., `mystore`), it creates a URL like `mystore.loukify.com`. This guide explains how to make these subdomains work on Vercel.

**Current Vercel Deployment**: `https://loukify-project-frontend.vercel.app/`

## Important Note

Vercel's default `.vercel.app` domains **do not support wildcard subdomains**. To enable subdomain functionality, you have two options:

1. **Recommended**: Add a custom domain (e.g., `loukify.com`) with wildcard DNS
2. **Temporary**: Use path-based routing for testing: `https://loukify-project-frontend.vercel.app/store/mystore`

## What Was Implemented

1. **Next.js Middleware** (`Frontend/src/middleware.ts`)
   - Detects subdomain requests
   - Routes subdomain requests to `/store/[subdomain]` page
   - Skips middleware for admin, auth, and API routes

2. **Public Store Page** (`Frontend/src/app/store/[subdomain]/page.tsx`)
   - Fetches store data by subdomain
   - Displays the store using the HomePage component
   - Shows error if store not found or not published

3. **Public Products API** (`routes/products.js`)
   - Added `/api/products/public` endpoint (no authentication required)
   - Returns only active products for public store pages

4. **Vercel Configuration** (`Frontend/vercel.json`)
   - Basic Vercel configuration for Next.js deployment

## Vercel Setup Steps

### Option 1: Custom Domain with Wildcard Subdomains (Recommended)

#### Step 1: Add Custom Domain in Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project: `loukify-project-frontend`
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter your main domain: `loukify.com` (or your custom domain)
6. Follow Vercel's instructions to verify domain ownership

#### Step 2: Add Wildcard Domain

1. In the same **Domains** section
2. Click **Add Domain** again
3. Enter wildcard domain: `*.loukify.com`
4. Vercel will automatically configure this for you

#### Step 3: Configure DNS Records

You need to configure DNS records with your domain registrar:

**For the main domain** (`loukify.com`):
- Add a CNAME record: `@` → `cname.vercel-dns.com`
- Or use Vercel's nameservers (recommended)

**For wildcard subdomains** (`*.loukify.com`):
- Add a CNAME record: `*` → `cname.vercel-dns.com`
- Or if using Vercel nameservers, this is handled automatically

**DNS Configuration Example** (varies by registrar):
```
Type    Name    Value
CNAME   @       cname.vercel-dns.com
CNAME   *       cname.vercel-dns.com
```

#### Step 4: Wait for DNS Propagation

- DNS changes can take 24-48 hours to propagate
- Vercel will show domain status in the dashboard
- Once verified, subdomains will work automatically

### Option 2: Path-Based Routing (Temporary Testing)

For immediate testing without a custom domain, you can use path-based routing:

**URL Format**: `https://loukify-project-frontend.vercel.app/store/[subdomain]`

**Example**: 
- Store with subdomain `mystore` → `https://loukify-project-frontend.vercel.app/store/mystore`
- Store with subdomain `shop` → `https://loukify-project-frontend.vercel.app/store/shop`

This works immediately without DNS configuration, but is not as user-friendly as true subdomains.

### Step 5: Update Store URLs (After Domain Setup)

Once your custom domain is configured, update the store URL generation in your code:

1. The backend already generates URLs like `mystore.loukify.com`
2. The middleware automatically detects and routes subdomains
3. No code changes needed - it works automatically!

### Step 6: Test the Subdomain

**With Custom Domain**:
1. Publish a store with a subdomain (e.g., `mystore`)
2. The subdomain URL will be: `https://mystore.loukify.com`
3. Visit the URL - it should display the public store

**With Path-Based Routing** (for testing):
1. Publish a store with a subdomain (e.g., `mystore`)
2. Visit: `https://loukify-project-frontend.vercel.app/store/mystore`
3. The store should display correctly

## How It Works

1. **User publishes store**: When a user clicks "Publish" with a subdomain, the backend saves `store_subdomain` in the database
2. **Subdomain request**: When someone visits `mystore.loukify.com`:
   - Vercel routes the request to your Next.js app
   - Middleware detects the subdomain (`mystore`)
   - Middleware rewrites the URL to `/store/mystore`
   - The store page fetches store data using the subdomain
   - The store is displayed using the HomePage component

## Troubleshooting

### Subdomain not working

1. **Check DNS**: Ensure wildcard DNS is configured correctly
   ```bash
   dig *.loukify.com
   ```

2. **Check Vercel domain**: Verify the domain is added in Vercel project settings

3. **Check middleware**: Verify middleware is detecting the subdomain correctly
   - Add console.log in middleware to debug

4. **Check store data**: Ensure the store is published and has a valid subdomain
   - Check database: `store_templates` table
   - Verify `is_published = true` and `store_subdomain` is set

### Store not found error

1. **Check subdomain format**: Subdomain should be lowercase, alphanumeric with hyphens only
2. **Check store status**: Store must be published (`is_published = true`)
3. **Check API endpoint**: Verify `/api/store-templates/subdomain/:subdomain` is working

### Products not showing

1. **Check products API**: Verify `/api/products/public` endpoint is accessible
2. **Check product status**: Only products with `product_status = 'active'` are shown
3. **Update HomePage component**: The current implementation uses hardcoded products - you may need to update it to use real products from the API

## Next Steps

1. **Product Integration**: Update the HomePage component to fetch and display real products from the API
2. **User-specific Products**: Link products to store owners (add `user_id` to products table)
3. **Custom Domain**: Allow users to connect their own custom domains
4. **SSL/HTTPS**: Vercel automatically provides SSL certificates for all subdomains

## Environment Variables

Make sure these are set in Vercel:

- `NEXT_PUBLIC_API_URL`: Your backend API URL
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify API endpoints are working
4. Check database for store data

