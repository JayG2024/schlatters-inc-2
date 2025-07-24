-- Enhanced metrics tracking for dashboard KPIs

-- Add fields to subscriptions table for enhanced tracking
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS prior_year_credit DECIMAL(10,2) DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS credit_applied BOOLEAN DEFAULT FALSE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS emergency_calls_count INTEGER DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS emergency_revenue DECIMAL(10,2) DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS lifetime_value DECIMAL(10,2) DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS churn_date TIMESTAMP;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS churn_reason TEXT;

-- Add fields to invoices table for enhanced tracking
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS days_overdue INTEGER DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS aging_bucket VARCHAR(10) CHECK (aging_bucket IN ('0-30', '31-60', '61-90', '90+'));
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS reminders_sent INTEGER DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS last_reminder_date TIMESTAMP;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_recovery_date TIMESTAMP;

-- Add fields to clients table for payment methods
ALTER TABLE clients ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS card_last4 VARCHAR(4);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS card_expiry VARCHAR(7);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS card_expired BOOLEAN DEFAULT FALSE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS conversion_date TIMESTAMP;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS conversion_from VARCHAR(50);

-- Create table for text messages tracking
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
  agent_id UUID REFERENCES users(id),
  automated BOOLEAN DEFAULT FALSE,
  message_type VARCHAR(50) CHECK (message_type IN ('support', 'reminder', 'follow-up', 'marketing')),
  related_invoice_id UUID REFERENCES invoices(id),
  related_call_id UUID REFERENCES calls(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create table for reminder tracking
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

-- Create table for automation rules
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('payment-reminder', 'renewal-reminder', 'thank-you', 'follow-up')),
  trigger_event VARCHAR(100) NOT NULL,
  trigger_timing INTEGER NOT NULL, -- days before/after event
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

-- Create table for daily metrics snapshots
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
CREATE INDEX idx_text_messages_client_id ON text_messages(client_id);
CREATE INDEX idx_text_messages_sent_at ON text_messages(sent_at);
CREATE INDEX idx_reminders_client_id ON reminders(client_id);
CREATE INDEX idx_reminders_scheduled_date ON reminders(scheduled_date);
CREATE INDEX idx_reminders_status ON reminders(status);
CREATE INDEX idx_daily_metrics_date ON daily_metrics(date);

-- Create function to update invoice aging
CREATE OR REPLACE FUNCTION update_invoice_aging() RETURNS TRIGGER AS $$
BEGIN
  -- Calculate days overdue
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update invoice aging
CREATE TRIGGER update_invoice_aging_trigger
  BEFORE INSERT OR UPDATE OF due_date, status ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_aging();

-- Create function to calculate daily metrics
CREATE OR REPLACE FUNCTION calculate_daily_metrics(p_date DATE) RETURNS VOID AS $$
DECLARE
  v_metrics RECORD;
BEGIN
  -- Delete existing metrics for the date
  DELETE FROM daily_metrics WHERE date = p_date;
  
  -- Insert calculated metrics
  INSERT INTO daily_metrics (
    date,
    active_subscriptions,
    annual_subscription_revenue,
    unpaid_invoices_count,
    unpaid_invoice_value,
    total_support_calls,
    texts_sent,
    texts_received
  )
  SELECT
    p_date,
    COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'active'),
    COALESCE(SUM(s.monthly_rate * 12) FILTER (WHERE s.status = 'active'), 0),
    COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'overdue'),
    COALESCE(SUM(i.balance) FILTER (WHERE i.status = 'overdue'), 0),
    COUNT(DISTINCT c.id) FILTER (WHERE DATE(c.start_time) = p_date),
    COUNT(DISTINCT tm.id) FILTER (WHERE tm.direction = 'outbound' AND DATE(tm.sent_at) = p_date),
    COUNT(DISTINCT tm.id) FILTER (WHERE tm.direction = 'inbound' AND DATE(tm.sent_at) = p_date)
  FROM subscriptions s
  CROSS JOIN invoices i
  CROSS JOIN calls c
  CROSS JOIN text_messages tm
  WHERE DATE(s.created_at) <= p_date
    AND DATE(i.created_at) <= p_date
    AND DATE(c.created_at) <= p_date
    AND DATE(tm.created_at) <= p_date;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON text_messages TO authenticated;
GRANT ALL ON reminders TO authenticated;
GRANT ALL ON automation_rules TO authenticated;
GRANT ALL ON daily_metrics TO authenticated;