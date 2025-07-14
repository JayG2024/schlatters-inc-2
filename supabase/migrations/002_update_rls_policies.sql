-- Update RLS policies to allow all operations for now
-- In production, you should restrict these based on user authentication

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated read" ON clients;
DROP POLICY IF EXISTS "Allow authenticated insert" ON clients;
DROP POLICY IF EXISTS "Allow authenticated update" ON clients;

-- Create new policies for clients table
CREATE POLICY "Allow all read" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON clients FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON clients FOR DELETE USING (true);

-- Add policies for other tables
CREATE POLICY "Allow all read" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON subscriptions FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON subscriptions FOR DELETE USING (true);

CREATE POLICY "Allow all read" ON calls FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON calls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON calls FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON calls FOR DELETE USING (true);

CREATE POLICY "Allow all read" ON live_calls FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON live_calls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON live_calls FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON live_calls FOR DELETE USING (true);

CREATE POLICY "Allow all read" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON messages FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON messages FOR DELETE USING (true);

CREATE POLICY "Allow all read" ON call_transcripts FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON call_transcripts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON call_transcripts FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON call_transcripts FOR DELETE USING (true);

CREATE POLICY "Allow all read" ON call_charges FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON call_charges FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON call_charges FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON call_charges FOR DELETE USING (true);

CREATE POLICY "Allow all read" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON invoices FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON invoices FOR DELETE USING (true);

CREATE POLICY "Allow all read" ON payments FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON payments FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON payments FOR DELETE USING (true);

CREATE POLICY "Allow all read" ON documents FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON documents FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON documents FOR DELETE USING (true);