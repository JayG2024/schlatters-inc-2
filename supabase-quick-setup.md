# Quick Supabase Setup Checklist

## 1. Project Creation ✓
- [ ] Created project at https://supabase.com
- [ ] Project name: schlatters-inc
- [ ] Saved database password
- [ ] Project is running (green status)

## 2. Get API Keys ✓
From Settings → API, copy:
- [ ] Project URL: ________________________
- [ ] anon public key: ____________________

## 3. Local Setup
Run this command and paste your values:
```bash
npm run setup:supabase
```

## 4. Database Setup
1. Go to SQL Editor in Supabase
2. Click "New query"
3. Copy ALL content from: `supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"
5. You should see "Success. No rows returned"

## 5. Create Admin User
In SQL Editor, run:
```sql
-- First, check if the profiles table exists
SELECT * FROM public.profiles LIMIT 1;
```

## 6. Test Login
1. Run `npm run dev`
2. Go to http://localhost:5173
3. Try logging in!

## Troubleshooting
- If tables don't exist: Make sure you ran the migration
- If login fails: Check browser console for errors
- If "Missing environment variables": Run setup:supabase again