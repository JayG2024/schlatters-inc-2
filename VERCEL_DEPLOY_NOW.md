# Deploy to Vercel - Quick Steps

Your Project ID: `prj_yzS9P2g4KOt0nXx0rmLk1RKvKugA`

## Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to your project**: https://vercel.com/dashboard/prj_yzS9P2g4KOt0nXx0rmLk1RKvKugA

2. **In the Deployments tab**, click "Redeploy" on the latest deployment
   - Or if no deployments yet, it should auto-deploy from your GitHub repo

3. **Check Environment Variables** are set:
   ```
   VITE_SUPABASE_URL = https://nolxeuyvwbmlyzhjgkhr.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbHhldXl2d2JtbHl6aGpna2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5OTc1ODMsImV4cCI6MjA2NzU3MzU4M30.Y9UO4c4v_mo1EW1NRIXhE0cVz0k0gHzV-ysfdeMjpX0
   ```

## Option 2: Force Deploy via Git

Push any small change to trigger deployment:
```bash
git add .
git commit -m "Trigger Vercel deployment"
git push origin main
```

## Option 3: Manual Deploy with Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link to your project:
   ```bash
   vercel link --project=prj_yzS9P2g4KOt0nXx0rmLk1RKvKugA
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

## Check Deployment Status

1. Visit: https://vercel.com/dashboard
2. Find your project (should be "schlatters-inc-app" or similar)
3. Check the Deployments tab for status

## If Deployment Fails

Common issues:
- Missing environment variables (add them in Settings)
- Build errors (check logs in Vercel dashboard)
- GitHub connection issues (reconnect in Git settings)

## Your Live URL
Once deployed, your app will be at:
- `https://[your-project-name].vercel.app`
- Or custom domain if configured