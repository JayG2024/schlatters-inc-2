import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { quickbooks } = req.query;
  
  if (!Array.isArray(quickbooks)) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  
  const [resource, action] = quickbooks;
  
  try {
    switch (resource) {
      case 'invoices':
        return handleInvoices(req, res, action);
      case 'customers':
        return handleCustomers(req, res, action);
      case 'payments':
        return handlePayments(req, res, action);
      case 'sync':
        return handleSync(req, res);
      default:
        return res.status(404).json({ error: 'Resource not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleInvoices(req: VercelRequest, res: VercelResponse, action?: string) {
  if (req.method === 'GET') {
    // TODO: Fetch invoices from QuickBooks
    return res.status(200).json({ invoices: [] });
  }
  
  if (req.method === 'POST' && action === 'create') {
    // TODO: Create invoice in QuickBooks
    return res.status(201).json({ message: 'Invoice created' });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleCustomers(req: VercelRequest, res: VercelResponse, action?: string) {
  if (req.method === 'GET') {
    // TODO: Fetch customers from QuickBooks
    return res.status(200).json({ customers: [] });
  }
  
  if (req.method === 'POST' && action === 'sync') {
    // TODO: Sync customers with QuickBooks
    return res.status(200).json({ message: 'Customers synced' });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handlePayments(req: VercelRequest, res: VercelResponse, action?: string) {
  if (req.method === 'GET') {
    // TODO: Fetch payments from QuickBooks
    return res.status(200).json({ payments: [] });
  }
  
  if (req.method === 'POST' && action === 'record') {
    // TODO: Record payment in QuickBooks
    return res.status(201).json({ message: 'Payment recorded' });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleSync(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // TODO: Implement full QuickBooks sync
  return res.status(200).json({ message: 'Sync initiated' });
}