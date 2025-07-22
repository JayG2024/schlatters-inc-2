# Vercel Deployment Guide for Schlatter's Inc.

## Quick Deploy Steps

1. **Visit Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your `JayG2024/schlatters-inc` repository
   - Click "Import"

3. **Configure Environment Variables**
   Add these in the Vercel dashboard during setup:
   
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   QUICKBOOKS_CLIENT_ID=your_quickbooks_client_id
   QUICKBOOKS_CLIENT_SECRET=your_quickbooks_client_secret
   OPENPHONE_API_KEY=your_openphone_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GMAIL_API_KEY=your_gmail_api_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically detect Vite and use your `vercel.json` config

## Post-Deployment

1. **Update OAuth Redirect URLs**
   - Google OAuth: Add `https://your-app.vercel.app/api/auth/google/callback`
   - QuickBooks OAuth: Add `https://your-app.vercel.app/api/auth/quickbooks/callback`

2. **Test Your Functions**
   - Visit `https://your-app.vercel.app/api/auth/google` to test Google OAuth
   - Check other endpoints in `/api/*`

## Automatic Deployments
- Every push to `main` branch will trigger a new deployment
- Pull requests get preview deployments

## Need Help?
- Check deployment logs in Vercel dashboard
- Verify all environment variables are set
- Ensure Supabase project is configured correctly