# Frontend Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the `Frontend/` directory with the following variables:

```env
# Backend API URL (optional - only if using separate backend)
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role Key (REQUIRED for server-side operations)
# This bypasses RLS policies - NEVER expose in client-side code!
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## How to Get Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (secret) → Use for `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **REQUIRED!**

## Example `.env.local` File

```env
# Backend API URL (optional)
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTc4OTIwMCwiZXhwIjoxOTYxMzY1MjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Service Role Key (REQUIRED - bypasses RLS)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ1Nzg5MjAwLCJleHAiOjE5NjEzNjUyMDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Important Notes

- The `.env.local` file should be in the `Frontend/` directory (not the root)
- Variables starting with `NEXT_PUBLIC_` are accessible in the browser
- `SUPABASE_SERVICE_ROLE_KEY` does NOT start with `NEXT_PUBLIC_` (it's server-side only)
- Never commit `.env.local` to version control (it's already in `.gitignore`)
- **After adding/updating environment variables, you MUST restart your Next.js dev server**
- Vercel environment variables only work in production - for local development, use `.env.local`

## Verification

After setting up the environment variables:

1. Restart your frontend dev server:
   ```bash
   cd Frontend
   npm run dev
   ```

2. Check the browser console - you should NOT see warnings about missing Supabase variables

3. Try logging in - authentication should work now!

