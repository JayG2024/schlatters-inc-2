-- Add QuickBooks sync fields to existing tables
ALTER TABLE clients ADD COLUMN IF NOT EXISTS quickbooks_sync_token VARCHAR(50);

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS quickbooks_sync_token VARCHAR(50);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS issue_date DATE;

ALTER TABLE payments ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES invoices(id);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(100);

-- Create indexes for QuickBooks sync
CREATE INDEX IF NOT EXISTS idx_invoices_quickbooks_id ON invoices(quickbooks_id);
CREATE INDEX IF NOT EXISTS idx_payments_quickbooks_id ON payments(quickbooks_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);