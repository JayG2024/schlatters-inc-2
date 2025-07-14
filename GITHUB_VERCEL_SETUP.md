# GitHub + Vercel Automatic Deployment Setup

## Quick Setup Steps:

### 1. Get Vercel Token
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Copy the token

### 2. Get Vercel IDs
Run this in your terminal:
```bash
cd /Users/jasongordon/Desktop/schlatters-inc
npx vercel link
```

Or find them manually:
- **Project ID**: `prj_yzS9P2g4KOt0nXx0rmLk1RKvKugA` (you already have this)
- **Org ID**: Check `.vercel/project.json` after running `vercel link`

### 3. Add GitHub Secrets
1. Go to your repo: https://github.com/JayG2024/schlatters-inc
2. Click Settings → Secrets and variables → Actions
3. Add these secrets:
   - `VERCEL_TOKEN` = Your token from step 1
   - `VERCEL_PROJECT_ID` = prj_yzS9P2g4KOt0nXx0rmLk1RKvKugA
   - `VERCEL_ORG_ID` = Your org ID from step 2

### 4. Push to Deploy
After adding secrets, any push to `main` branch will auto-deploy!

## Alternative: Direct Vercel Integration

1. Go to your [Vercel project settings](https://vercel.com/dashboard)
2. Click "Git" tab
3. Connect to GitHub repo
4. Vercel will auto-deploy on every push (easier method!)