# 🚨 Quick Fix: Supabase Environment Variables Error

## The Problem

You're seeing this error:
```
Uncaught Error: supabaseUrl is required.
Missing Supabase environment variables
```

This happens because the Supabase client needs your project credentials to work.

## The Solution (2 minutes)

### Step 1: Get Your Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project (or create one if you don't have one)
3. Click **Settings** (gear icon) → **API**
4. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (a long JWT token)

### Step 2: Create the Environment File

1. In your project, go to the `Frontend/` folder
2. Create a new file called `.env.local`
3. Add these lines (replace with YOUR actual values):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
```

**Example:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTc4OTIwMCwiZXhwIjoxOTYxMzY1MjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Restart Your Server

**IMPORTANT:** After creating/updating `.env.local`, you MUST restart your Next.js dev server:

1. Stop the current server (Ctrl+C or Cmd+C)
2. Start it again:
   ```bash
   cd Frontend
   npm run dev
   ```

### Step 4: Test

1. Go to `/auth/login`
2. Try logging in
3. The error should be gone! ✅

## Why This Happened

- The Supabase client needs your project URL and API key to connect
- These are stored in environment variables (`.env.local`)
- Without them, the client can't initialize, causing the error
- Next.js only reads `.env.local` when the server starts, so you need to restart

## Still Having Issues?

1. **Check file location**: `.env.local` must be in the `Frontend/` folder (not root)
2. **Check variable names**: They must start with `NEXT_PUBLIC_`
3. **Check for typos**: No extra spaces, quotes, or special characters
4. **Restart server**: Always restart after changing `.env.local`
5. **Check console**: Look for the exact error message

## Need More Help?

See `Frontend/ENV_SETUP.md` for detailed instructions.

