#!/bin/bash

# Vercel Environment Variables Setup Script
# This script adds all necessary environment variables to your Vercel project

echo "🚀 Setting up Vercel environment variables..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found. Please install it with: npm i -g vercel"
    exit 1
fi

# Production environment variables
echo "Adding production environment variables..."

# Supabase Configuration
vercel env add VITE_SUPABASE_URL production < <(echo "https://nolxeuyvwbmlyzhjgkhr.supabase.co")
vercel env add VITE_SUPABASE_ANON_KEY production < <(echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbHhldXl2d2JtbHl6aGpna2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5OTc1ODMsImV4cCI6MjA2NzU3MzU4M30.Y9UO4c4v_mo1EW1NRIXhE0cVz0k0gHzV-ysfdeMjpX0")
vercel env add SUPABASE_SERVICE_KEY production < <(echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbHhldXl2d2JtbHl6aGpna2hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk5NzU4MywiZXhwIjoyMDY3NTczNTgzfQ.hSteAewUtVFvrXF6VS7KYT7L3wlZJs59SICCGkoR8B4")

# Webhook Configuration
vercel env add SKIP_WEBHOOK_VERIFICATION production < <(echo "true")

# Also add to preview and development environments
echo "Adding to preview and development environments..."

# Supabase Configuration
vercel env add VITE_SUPABASE_URL preview development < <(echo "https://nolxeuyvwbmlyzhjgkhr.supabase.co")
vercel env add VITE_SUPABASE_ANON_KEY preview development < <(echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbHhldXl2d2JtbHl6aGpna2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5OTc1ODMsImV4cCI6MjA2NzU3MzU4M30.Y9UO4c4v_mo1EW1NRIXhE0cVz0k0gHzV-ysfdeMjpX0")
vercel env add SUPABASE_SERVICE_KEY preview development < <(echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbHhldXl2d2JtbHl6aGpna2hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk5NzU4MywiZXhwIjoyMDY3NTczNTgzfQ.hSteAewUtVFvrXF6VS7KYT7L3wlZJs59SICCGkoR8B4")
vercel env add SKIP_WEBHOOK_VERIFICATION preview development < <(echo "true")

echo "✅ Environment variables added successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Run the database migration in Supabase SQL Editor"
echo "2. Deploy to Vercel with: vercel --prod"
echo ""
echo "🔗 Your webhook URLs will be:"
echo "   OpenPhone: https://schlatters-inc.vercel.app/api/webhooks/openphone"
echo "   QuickBooks: https://schlatters-inc.vercel.app/api/webhooks/quickbooks"