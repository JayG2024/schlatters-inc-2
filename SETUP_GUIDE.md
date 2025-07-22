# Quick Setup Guide for Schlatter's Inc.

## Step 1: Add Environment Variables to Vercel

Run the setup script:
```bash
./setup-vercel-env.sh
```

Or manually add these in Vercel Dashboard (Settings → Environment Variables):

### Required Variables:
- `VITE_SUPABASE_URL`: `https://nolxeuyvwbmlyzhjgkhr.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbHhldXl2d2JtbHl6aGpna2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5OTc1ODMsImV4cCI6MjA2NzU3MzU4M30.Y9UO4c4v_mo1EW1NRIXhE0cVz0k0gHzV-ysfdeMjpX0`
- `SUPABASE_SERVICE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbHhldXl2d2JtbHl6aGpna2hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk5NzU4MywiZXhwIjoyMDY3NTczNTgzfQ.hSteAewUtVFvrXF6VS7KYT7L3wlZJs59SICCGkoR8B4`
- `SKIP_WEBHOOK_VERIFICATION`: `true`

## Step 2: Run Database Migration

1. Go to your Supabase Dashboard: https://app.supabase.io
2. Select your project
3. Navigate to SQL Editor (left sidebar)
4. Click "New Query"
5. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
6. Click "Run" to execute the migration

## Step 3: Deploy to Vercel

```bash
# Deploy to production
vercel --prod

# Or push to GitHub for automatic deployment
git add -A
git commit -m "Add production environment configuration"
git push origin main
```

## Step 4: Test the Application

1. Visit your deployed app
2. Try creating a new client
3. Check that data persists in Supabase

## Step 5: Configure Webhooks

### OpenPhone Webhook:
1. Log into OpenPhone: https://app.openphone.com
2. Go to Settings → Integrations → Webhooks
3. Add webhook URL: `https://schlatters-inc.vercel.app/api/webhooks/openphone`
4. Select events: Call Started, Call Ended, SMS Received

### QuickBooks Webhook (Later):
1. Create app at: https://developer.intuit.com
2. Configure webhook URL: `https://schlatters-inc.vercel.app/api/webhooks/quickbooks`
3. Add OAuth credentials to Vercel

## Troubleshooting

If buttons don't work:
1. Check browser console for errors
2. Verify environment variables in Vercel
3. Confirm database migration completed successfully
4. Check Vercel function logs: `vercel logs`

## Support URLs

- Supabase Dashboard: https://app.supabase.io
- Vercel Dashboard: https://vercel.com/dashboard
- Your App: https://schlatters-inc.vercel.app