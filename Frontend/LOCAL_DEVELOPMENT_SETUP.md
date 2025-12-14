# 🚨 Quick Fix: Local Development Environment Variables

## The Problem

You're seeing this error when running locally:
```
Backend not configured. Missing SUPABASE_SERVICE_ROLE_KEY environment variable.
```

**Why?** You're running on `localhost:3000`, but Vercel environment variables only work when deployed to Vercel, not locally!

## ✅ The Solution (2 minutes)

### Step 1: Create `.env.local` File

1. Go to your `Frontend/` directory
2. Create a new file called `.env.local` (if it doesn't exist)
3. Add these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Service Role Key (REQUIRED - bypasses RLS)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Step 2: Get Your Values from Supabase

1. Go to: https://app.supabase.com
2. Select your project
3. Go to: **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **This is the one you're missing!**

### Step 3: Restart Your Dev Server

**CRITICAL:** After creating/updating `.env.local`, you MUST restart your server:

1. Stop your current dev server (press `Ctrl+C` or `Cmd+C`)
2. Start it again:
   ```bash
   cd Frontend
   npm run dev
   ```

### Step 4: Test

1. Visit: `http://localhost:3000`
2. Try to save or publish your store template
3. ✅ Should work now!

## 📋 Complete `.env.local` Example

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTc4OTIwMCwiZXhwIjoxOTYxMzY1MjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Service Role Key (REQUIRED)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ1Nzg5MjAwLCJleHAiOjE5NjEzNjUyMDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Backend API URL (only if using separate backend)
# NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🔍 Why This Happens

- **Vercel environment variables** = Only work when deployed to Vercel
- **`.env.local` file** = Works for local development (`localhost`)
- You need BOTH:
  - ✅ `.env.local` for local development
  - ✅ Vercel environment variables for production

## ⚠️ Important Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` does NOT start with `NEXT_PUBLIC_` (it's server-side only)
- Never commit `.env.local` to Git (it's already in `.gitignore`)
- The service role key has full database access - keep it secret!

## 🐛 Still Not Working?

1. **Check file location**: `.env.local` must be in `Frontend/` directory (not root)
2. **Check file name**: Must be exactly `.env.local` (not `.env` or `.env.local.txt`)
3. **Restart server**: Did you restart after creating the file?
4. **Check for typos**: Make sure variable names are exactly correct
5. **Check for spaces**: No spaces around the `=` sign

## ✅ Success Checklist

- [ ] `.env.local` file exists in `Frontend/` directory
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set (not just anon key)
- [ ] No spaces around `=` signs
- [ ] Dev server was restarted after creating file
- [ ] Can save/publish store templates without errors

