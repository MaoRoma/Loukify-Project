#!/bin/bash

# Script to help set up Frontend environment variables
# This script will create a .env.local file with the required variables

echo "🔧 Setting up Frontend environment variables..."
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled. Existing .env.local file preserved."
        exit 1
    fi
fi

# Get Supabase URL
echo "📝 Please enter your Supabase credentials:"
echo "   (You can find these in your Supabase project: Settings → API)"
echo ""

read -p "NEXT_PUBLIC_SUPABASE_URL: " SUPABASE_URL
read -p "NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY

# Default API URL
API_URL="http://localhost:3001"
read -p "NEXT_PUBLIC_API_URL [default: $API_URL]: " INPUT_API_URL
API_URL=${INPUT_API_URL:-$API_URL}

# Create .env.local file
cat > .env.local << EOF
# Backend API URL
NEXT_PUBLIC_API_URL=$API_URL

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EOF

echo ""
echo "✅ Created .env.local file!"
echo ""
echo "📋 Contents:"
cat .env.local
echo ""
echo "🚀 Next steps:"
echo "   1. Restart your Next.js dev server (npm run dev)"
echo "   2. Try logging in again"
echo ""

