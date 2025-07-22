-- Create table for QuickBooks OAuth tokens
CREATE TABLE IF NOT EXISTS quickbooks_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  realm_id TEXT UNIQUE NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  refresh_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE quickbooks_tokens ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read tokens
CREATE POLICY "Authenticated users can read tokens" ON quickbooks_tokens
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only service role can insert/update tokens
CREATE POLICY "Service role can manage tokens" ON quickbooks_tokens
  FOR ALL USING (auth.role() = 'service_role');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quickbooks_tokens_updated_at 
  BEFORE UPDATE ON quickbooks_tokens
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();