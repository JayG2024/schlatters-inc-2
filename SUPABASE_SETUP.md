# Supabase Setup Guide for Schlatter's Inc

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Set project details:
   - Name: `schlatters-inc`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
6. Click "Create Project" and wait for setup

## 2. Get Your API Keys

Once your project is created:

1. Go to Settings → API
2. Copy these values:
   - **Project URL**: `https://[YOUR-PROJECT-REF].supabase.co`
   - **Anon/Public Key**: (safe for client-side)
   - **Service Role Key**: (keep secret, server-side only)

## 3. Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## 4. Run Database Migrations

### Option A: Using Supabase Dashboard
1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run in the SQL editor

### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref [YOUR-PROJECT-REF]

# Run migrations
supabase db push
```

## 5. Configure Authentication

1. In Supabase Dashboard, go to Authentication → Providers
2. Enable Email provider (enabled by default)
3. Configure email templates:
   - Go to Authentication → Email Templates
   - Customize confirmation, reset password emails

4. Set up redirect URLs:
   - Add `http://localhost:5173/*` for development
   - Add `https://your-netlify-domain.netlify.app/*` for production

## 6. Enable Storage (for documents)

1. Go to Storage in Supabase Dashboard
2. Create buckets:
   - `documents` - for client documents
   - `call-recordings` - for call recordings
3. Set policies for each bucket

## 7. Test the Connection

Run the development server:
```bash
npm run dev
```

The app should now connect to Supabase. Check the console for any errors.

## 8. Add Sample Admin User

Run this SQL in the Supabase SQL Editor:

```sql
-- Create an admin user (you'll need to confirm the email)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@schlattersinc.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- Update their profile to admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@schlattersinc.com';
```

## 9. Deploy to Netlify

Add environment variables in Netlify:
1. Go to Site settings → Environment variables
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Security Notes

- Never commit `.env.local` to git
- Keep service role key secret
- Use Row Level Security (RLS) policies
- Enable 2FA on your Supabase account

## Next Steps

1. Test authentication flow
2. Create initial admin user
3. Configure email settings
4. Set up real-time subscriptions
5. Configure backup policies