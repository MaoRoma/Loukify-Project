# Frontend Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the `Frontend/` directory with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How to Get Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Example `.env.local` File

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTc4OTIwMCwiZXhwIjoxOTYxMzY1MjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Important Notes

- The `.env.local` file should be in the `Frontend/` directory (not the root)
- All variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Never commit `.env.local` to version control (it's already in `.gitignore`)
- After adding/updating environment variables, restart your Next.js dev server

## Verification

After setting up the environment variables:

1. Restart your frontend dev server:
   ```bash
   cd Frontend
   npm run dev
   ```

2. Check the browser console - you should NOT see warnings about missing Supabase variables

3. Try logging in - authentication should work now!

