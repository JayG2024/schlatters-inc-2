-- Enable Row Level Security on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- Clients table policies
-- Admins can see all clients
CREATE POLICY "Admins can view all clients" ON clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Clients can only see their own record
CREATE POLICY "Clients can view own record" ON clients
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE email = clients.email
    )
  );

-- Only admins can insert/update/delete clients
CREATE POLICY "Only admins can manage clients" ON clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Calls table policies
-- Admins can see all calls
CREATE POLICY "Admins can view all calls" ON calls
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Clients can see their own calls
CREATE POLICY "Clients can view own calls" ON calls
  FOR SELECT USING (
    client_id IN (
      SELECT clients.id FROM clients 
      JOIN profiles ON profiles.email = clients.email 
      WHERE profiles.id = auth.uid()
    )
  );

-- Only admins can manage calls
CREATE POLICY "Only admins can manage calls" ON calls
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Messages table policies
-- Admins can see all messages
CREATE POLICY "Admins can view all messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Clients can see their own messages
CREATE POLICY "Clients can view own messages" ON messages
  FOR SELECT USING (
    client_id IN (
      SELECT clients.id FROM clients 
      JOIN profiles ON profiles.email = clients.email 
      WHERE profiles.id = auth.uid()
    )
  );

-- Only admins can manage messages
CREATE POLICY "Only admins can manage messages" ON messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Subscriptions table policies
-- Admins can see all subscriptions
CREATE POLICY "Admins can view all subscriptions" ON subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Clients can see their own subscriptions
CREATE POLICY "Clients can view own subscriptions" ON subscriptions
  FOR SELECT USING (
    client_id IN (
      SELECT clients.id FROM clients 
      JOIN profiles ON profiles.email = clients.email 
      WHERE profiles.id = auth.uid()
    )
  );

-- Only admins can manage subscriptions
CREATE POLICY "Only admins can manage subscriptions" ON subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Similar policies for other tables...
-- Invoices
CREATE POLICY "Admins can view all invoices" ON invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Clients can view own invoices" ON invoices
  FOR SELECT USING (
    client_id IN (
      SELECT clients.id FROM clients 
      JOIN profiles ON profiles.email = clients.email 
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can manage invoices" ON invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Support tickets - clients can create and view their own
CREATE POLICY "Admins can view all tickets" ON support_tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Clients can view own tickets" ON support_tickets
  FOR SELECT USING (
    client_id IN (
      SELECT clients.id FROM clients 
      JOIN profiles ON profiles.email = clients.email 
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Clients can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (
    client_id IN (
      SELECT clients.id FROM clients 
      JOIN profiles ON profiles.email = clients.email 
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update/delete tickets" ON support_tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete tickets" ON support_tickets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;