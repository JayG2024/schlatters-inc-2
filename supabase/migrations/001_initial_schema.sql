-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  alternate_phone TEXT,
  quickbooks_id TEXT UNIQUE,
  is_subscriber BOOLEAN DEFAULT false,
  subscription_status TEXT DEFAULT 'inactive',
  total_revenue DECIMAL(10,2) DEFAULT 0,
  outstanding_balance DECIMAL(10,2) DEFAULT 0,
  lifetime_value DECIMAL(10,2) DEFAULT 0,
  last_contact_date TIMESTAMPTZ,
  last_contact_type TEXT,
  total_calls INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  notes TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  hours_included INTEGER NOT NULL,
  hours_used DECIMAL(5,2) DEFAULT 0,
  hours_remaining DECIMAL(5,2),
  monthly_rate DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  last_payment_date DATE,
  next_billing_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calls table
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id),
  phone_number TEXT NOT NULL,
  direction TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  answered_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration INTEGER, -- seconds
  billable_minutes INTEGER,
  rate DECIMAL(10,2),
  total_charge DECIMAL(10,2),
  recording_url TEXT,
  has_transcript BOOLEAN DEFAULT false,
  agent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call transcripts table
CREATE TABLE call_transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id TEXT REFERENCES calls(call_id),
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

-- Messages table (SMS)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id TEXT UNIQUE NOT NULL,
  conversation_id TEXT,
  client_id UUID REFERENCES clients(id),
  phone_number TEXT NOT NULL,
  direction TEXT NOT NULL,
  body TEXT NOT NULL,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call charges table (pay-per-call)
CREATE TABLE call_charges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Live calls table (for real-time queue)
CREATE TABLE live_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quickbooks_id TEXT UNIQUE,
  client_id UUID REFERENCES clients(id),
  invoice_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  balance DECIMAL(10,2) DEFAULT 0,
  due_date DATE,
  created_date DATE,
  status TEXT DEFAULT 'pending',
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quickbooks_id TEXT UNIQUE,
  client_id UUID REFERENCES clients(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT,
  reference_number TEXT,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  tags TEXT[],
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_quickbooks_id ON clients(quickbooks_id);
CREATE INDEX idx_calls_client_id ON calls(client_id);
CREATE INDEX idx_calls_call_id ON calls(call_id);
CREATE INDEX idx_messages_client_id ON messages(client_id);
CREATE INDEX idx_subscriptions_client_id ON subscriptions(client_id);
CREATE INDEX idx_live_calls_status ON live_calls(status);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you'll need to adjust based on your auth setup)
-- For now, these allow authenticated users to see all data
CREATE POLICY "Allow authenticated read" ON clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON clients FOR UPDATE TO authenticated USING (true);

-- Repeat for other tables as needed...