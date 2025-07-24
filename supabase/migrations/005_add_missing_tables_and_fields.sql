-- Add missing tables and fields for enhanced dashboard metrics

-- Create subscriptions table (missing from your current schema)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL DEFAULT 'Pro Tech Service',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expiring', 'expired', 'cancelled')),
  hours_included INTEGER NOT NULL DEFAULT 10,
  hours_used DECIMAL(5,2) DEFAULT 0,
  hours_remaining DECIMAL(5,2) DEFAULT 10,
  monthly_rate DECIMAL(10,2) NOT NULL DEFAULT 125.00,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  last_payment_date DATE,
  next_billing_date DATE,
  -- New fields for enhanced tracking
  prior_year_credit DECIMAL(10,2) DEFAULT 0,
  credit_applied BOOLEAN DEFAULT FALSE,
  emergency_calls_count INTEGER DEFAULT 0,
  emergency_revenue DECIMAL(10,2) DEFAULT 0,
  lifetime_value DECIMAL(10,2) DEFAULT 0,
  churn_date TIMESTAMP,
  churn_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create other missing tables
CREATE TABLE IF NOT EXISTS call_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id TEXT,
  client_id UUID REFERENCES clients(id),
  transcript_text TEXT,
  transcript_segments JSONB,
  summary TEXT,
  sentiment_overall TEXT,
  keywords TEXT[],
  action_items TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS call_charges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  call_id TEXT,
  duration INTEGER NOT NULL,
  rate DECIMAL(10,2) NOT NULL,
  total_charge DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  invoice_id TEXT,
  invoice_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS live_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id TEXT UNIQUE NOT NULL,
  client_name TEXT,
  client_company TEXT,
  phone_number TEXT NOT NULL,
  is_subscriber BOOLEAN DEFAULT false,
  subscription_hours_remaining DECIMAL(5,2),
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  agent_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quickbooks_id TEXT UNIQUE,
  client_id UUID REFERENCES clients(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT,
  reference_number TEXT,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to existing tables
-- Add to invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS days_overdue INTEGER DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS aging_bucket VARCHAR(10) CHECK (aging_bucket IN ('0-30', '31-60', '61-90', '90+'));
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS reminders_sent INTEGER DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS last_reminder_date TIMESTAMP;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_recovery_date TIMESTAMP;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Add to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS card_last4 VARCHAR(4);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS card_expiry VARCHAR(7);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS card_expired BOOLEAN DEFAULT FALSE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS conversion_date TIMESTAMP;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS conversion_from VARCHAR(50);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS is_subscriber BOOLEAN DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add to calls table
ALTER TABLE calls ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS direction TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS duration INTEGER;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS from_number TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS to_number TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS has_transcript BOOLEAN DEFAULT false;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS agent_id TEXT;

-- Add to messages table  
ALTER TABLE messages ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS direction TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS from_number TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS to_number TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Create new tables for enhanced metrics
CREATE TABLE IF NOT EXISTS text_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  direction VARCHAR(10) CHECK (direction IN ('inbound', 'outbound')),
  phone_number VARCHAR(20),
  message TEXT,
  sent_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  response_received_at TIMESTAMP,
  agent_id UUID,
  automated BOOLEAN DEFAULT FALSE,
  message_type VARCHAR(50) CHECK (message_type IN ('support', 'reminder', 'follow-up', 'marketing')),
  related_invoice_id UUID REFERENCES invoices(id),
  related_call_id UUID REFERENCES calls(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) CHECK (type IN ('payment', 'renewal', 'follow-up', 'expired-card')),
  client_id UUID REFERENCES clients(id),
  scheduled_date TIMESTAMP NOT NULL,
  sent_date TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('scheduled', 'sent', 'failed', 'cancelled')),
  method VARCHAR(20) CHECK (method IN ('email', 'sms', 'both')),
  template_name VARCHAR(100),
  related_invoice_id UUID REFERENCES invoices(id),
  related_subscription_id UUID REFERENCES subscriptions(id),
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  replied_at TIMESTAMP,
  payment_made_at TIMESTAMP,
  response_time_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('payment-reminder', 'renewal-reminder', 'thank-you', 'follow-up')),
  trigger_event VARCHAR(100) NOT NULL,
  trigger_timing INTEGER NOT NULL,
  trigger_condition TEXT,
  action_type VARCHAR(20) CHECK (action_type IN ('email', 'sms', 'both')),
  template_name VARCHAR(100),
  active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMP,
  total_sent INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  -- Financial metrics
  active_subscriptions INTEGER DEFAULT 0,
  annual_subscription_revenue DECIMAL(10,2) DEFAULT 0,
  prior_year_credit_issued DECIMAL(10,2) DEFAULT 0,
  emergency_addon_revenue DECIMAL(10,2) DEFAULT 0,
  daily_invoiced_amount DECIMAL(10,2) DEFAULT 0,
  avg_revenue_per_ticket DECIMAL(10,2) DEFAULT 0,
  customer_conversion_rate DECIMAL(5,2) DEFAULT 0,
  churn_rate DECIMAL(5,2) DEFAULT 0,
  -- Billing metrics
  unpaid_invoices_count INTEGER DEFAULT 0,
  unpaid_invoice_value DECIMAL(10,2) DEFAULT 0,
  avg_overdue_days DECIMAL(5,1) DEFAULT 0,
  expired_cards_percentage DECIMAL(5,2) DEFAULT 0,
  lapsed_subscriptions INTEGER DEFAULT 0,
  renewal_reminders_sent_percentage DECIMAL(5,2) DEFAULT 0,
  payment_recovery_rate DECIMAL(5,2) DEFAULT 0,
  -- Support metrics
  total_support_calls INTEGER DEFAULT 0,
  avg_call_duration_minutes DECIMAL(5,1) DEFAULT 0,
  max_call_duration_minutes DECIMAL(5,1) DEFAULT 0,
  billable_calls_ratio DECIMAL(5,2) DEFAULT 0,
  daily_support_volume INTEGER DEFAULT 0,
  support_cost_vs_revenue DECIMAL(5,2) DEFAULT 0,
  -- Communication metrics
  texts_sent INTEGER DEFAULT 0,
  texts_received INTEGER DEFAULT 0,
  text_to_call_ratio DECIMAL(5,2) DEFAULT 0,
  avg_time_to_first_response_minutes DECIMAL(5,1) DEFAULT 0,
  automated_reminder_effectiveness DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_client_id ON subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_text_messages_client_id ON text_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_text_messages_sent_at ON text_messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_reminders_client_id ON reminders(client_id);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_date ON reminders(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(date);

-- Create function to update invoice aging
CREATE OR REPLACE FUNCTION update_invoice_aging() RETURNS TRIGGER AS $$
BEGIN
  -- Only calculate if due_date exists
  IF NEW.due_date IS NOT NULL THEN
    NEW.days_overdue := GREATEST(0, EXTRACT(DAY FROM NOW() - NEW.due_date)::INTEGER);
    
    -- Set aging bucket
    IF NEW.days_overdue = 0 THEN
      NEW.aging_bucket := NULL;
    ELSIF NEW.days_overdue <= 30 THEN
      NEW.aging_bucket := '0-30';
    ELSIF NEW.days_overdue <= 60 THEN
      NEW.aging_bucket := '31-60';
    ELSIF NEW.days_overdue <= 90 THEN
      NEW.aging_bucket := '61-90';
    ELSE
      NEW.aging_bucket := '90+';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update invoice aging
DROP TRIGGER IF EXISTS update_invoice_aging_trigger ON invoices;
CREATE TRIGGER update_invoice_aging_trigger
  BEFORE INSERT OR UPDATE OF due_date, status ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_aging();

-- Grant permissions
GRANT ALL ON subscriptions TO authenticated;
GRANT ALL ON call_transcripts TO authenticated;
GRANT ALL ON call_charges TO authenticated;
GRANT ALL ON live_calls TO authenticated;
GRANT ALL ON payments TO authenticated;
GRANT ALL ON text_messages TO authenticated;
GRANT ALL ON reminders TO authenticated;
GRANT ALL ON automation_rules TO authenticated;
GRANT ALL ON daily_metrics TO authenticated;

-- Enable RLS on new tables
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for new tables
CREATE POLICY "Allow authenticated read subscriptions" ON subscriptions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert subscriptions" ON subscriptions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update subscriptions" ON subscriptions FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read text_messages" ON text_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert text_messages" ON text_messages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update text_messages" ON text_messages FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read reminders" ON reminders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert reminders" ON reminders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update reminders" ON reminders FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read automation_rules" ON automation_rules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert automation_rules" ON automation_rules FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update automation_rules" ON automation_rules FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read daily_metrics" ON daily_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert daily_metrics" ON daily_metrics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update daily_metrics" ON daily_metrics FOR UPDATE TO authenticated USING (true);