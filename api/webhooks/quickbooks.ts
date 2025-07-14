import { VercelRequest, VercelResponse } from '../types';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// QuickBooks webhook verification token
const WEBHOOK_VERIFIER_TOKEN = process.env.QUICKBOOKS_WEBHOOK_TOKEN!;

// QuickBooks webhook event types
interface QuickBooksWebhookEvent {
  eventNotifications: Array<{
    realmId: string;
    dataChangeEvent: {
      entities: Array<{
        name: 'Customer' | 'Invoice' | 'Payment' | 'Estimate';
        id: string;
        operation: 'Create' | 'Update' | 'Delete' | 'Merge' | 'Void';
        lastUpdated: string;
      }>;
    };
  }>;
}

interface QuickBooksCustomer {
  Id: string;
  DisplayName: string;
  CompanyName?: string;
  PrimaryEmailAddr?: { Address: string };
  PrimaryPhone?: { FreeFormNumber: string };
  Mobile?: { FreeFormNumber: string };
  AlternatePhone?: { FreeFormNumber: string };
  Balance: number;
  Active: boolean;
  Notes?: string;
}

// Verify webhook signature
function verifyWebhookSignature(req: VercelRequest): boolean {
  const signature = req.headers['intuit-signature'] as string;
  if (!signature || !WEBHOOK_VERIFIER_TOKEN) {
    return false;
  }

  const hash = crypto
    .createHmac('sha256', WEBHOOK_VERIFIER_TOKEN)
    .update(JSON.stringify(req.body))
    .digest('base64');

  return signature === hash;
}

// Normalize phone number for comparison
function normalizePhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  return phone.replace(/\D/g, '');
}

// Get QuickBooks access token (implement OAuth flow)
async function getQuickBooksAccessToken(): Promise<string> {
  // TODO: Implement OAuth token refresh logic
  // This should retrieve the stored refresh token and get a new access token
  return process.env.QUICKBOOKS_ACCESS_TOKEN || '';
}

// Fetch customer from QuickBooks API
async function fetchQuickBooksCustomer(customerId: string, realmId: string): Promise<QuickBooksCustomer | null> {
  const accessToken = await getQuickBooksAccessToken();
  
  try {
    const response = await fetch(
      `https://api.quickbooks.com/v3/company/${realmId}/customer/${customerId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.Customer;
  } catch (error) {
    return null;
  }
}

// Sync customer data
async function syncCustomer(customerId: string, realmId: string) {
  const qbCustomer = await fetchQuickBooksCustomer(customerId, realmId);
  if (!qbCustomer) return;

  // Try to find existing client by QuickBooks ID
  let { data: existingClient } = await supabase
    .from('clients')
    .select('*')
    .eq('quickbooks_id', qbCustomer.Id)
    .single();

  // If not found by QB ID, try to match by phone number
  if (!existingClient && qbCustomer.PrimaryPhone?.FreeFormNumber) {
    const normalizedPhone = normalizePhoneNumber(qbCustomer.PrimaryPhone.FreeFormNumber);
    const { data: phoneMatches } = await supabase
      .from('clients')
      .select('*');

    // Check each client's phone numbers
    if (phoneMatches) {
      existingClient = phoneMatches.find(client => {
        const clientPhone = normalizePhoneNumber(client.phone || '');
        const clientAltPhone = normalizePhoneNumber(client.alternate_phone || '');
        return clientPhone === normalizedPhone || clientAltPhone === normalizedPhone;
      });
    }
  }

  const clientData = {
    name: qbCustomer.DisplayName,
    company: qbCustomer.CompanyName || qbCustomer.DisplayName,
    email: qbCustomer.PrimaryEmailAddr?.Address,
    phone: qbCustomer.PrimaryPhone?.FreeFormNumber || qbCustomer.Mobile?.FreeFormNumber,
    alternate_phone: qbCustomer.AlternatePhone?.FreeFormNumber,
    quickbooks_id: qbCustomer.Id,
    quickbooks_sync_enabled: true,
    outstanding_balance: qbCustomer.Balance,
    status: qbCustomer.Active ? 'active' : 'inactive',
    notes: qbCustomer.Notes,
    last_quickbooks_sync: new Date().toISOString(),
  };

  if (existingClient) {
    // Update existing client
    await supabase
      .from('clients')
      .update(clientData)
      .eq('id', existingClient.id);
  } else {
    // Create new client
    await supabase
      .from('clients')
      .insert({
        ...clientData,
        created_at: new Date().toISOString(),
        total_revenue: 0,
        lifetime_value: 0,
        total_calls: 0,
        total_messages: 0,
        purchase_count: 0,
        tags: ['quickbooks-synced'],
      });
  }
}

// Handle invoice sync
async function syncInvoice(invoiceId: string, realmId: string) {
  const accessToken = await getQuickBooksAccessToken();
  
  try {
    const response = await fetch(
      `https://api.quickbooks.com/v3/company/${realmId}/invoice/${invoiceId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const invoice = data.Invoice;

    // Find client by QuickBooks customer ID
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('quickbooks_id', invoice.CustomerRef.value)
      .single();

    if (!client) {
      // Sync customer first if not found
      await syncCustomer(invoice.CustomerRef.value, realmId);
      return;
    }

    // Store invoice data
    await supabase
      .from('invoices')
      .upsert({
        quickbooks_id: invoice.Id,
        client_id: client.id,
        invoice_number: invoice.DocNumber,
        amount: invoice.TotalAmt,
        balance: invoice.Balance,
        due_date: invoice.DueDate,
        created_date: invoice.TxnDate,
        status: invoice.Balance > 0 ? 'pending' : 'paid',
        last_sync: new Date().toISOString(),
      });

    // Update client's outstanding balance
    await supabase
      .from('clients')
      .update({
        outstanding_balance: invoice.Balance,
      })
      .eq('id', client.id);
  } catch (error) {
    console.error('Error syncing invoice:', error);
  }
}

// Handle payment sync
async function syncPayment(paymentId: string, realmId: string) {
  const accessToken = await getQuickBooksAccessToken();
  
  try {
    const response = await fetch(
      `https://api.quickbooks.com/v3/company/${realmId}/payment/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    const payment = data.Payment;

    // Find client by QuickBooks customer ID
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('quickbooks_id', payment.CustomerRef.value)
      .single();

    if (!client) return;

    // Store payment data
    await supabase
      .from('payments')
      .upsert({
        quickbooks_id: payment.Id,
        client_id: client.id,
        amount: payment.TotalAmt,
        payment_date: payment.TxnDate,
        payment_method: payment.PaymentMethodRef?.name || 'Unknown',
        reference_number: payment.PaymentRefNum,
        last_sync: new Date().toISOString(),
      });

    // Update client's lifetime value
    const { data: totalPayments } = await supabase
      .from('payments')
      .select('amount')
      .eq('client_id', client.id);

    if (totalPayments) {
      const lifetimeValue = totalPayments.reduce((sum, p) => sum + p.amount, 0);
      await supabase
        .from('clients')
        .update({
          lifetime_value: lifetimeValue,
          total_revenue: lifetimeValue,
        })
        .eq('id', client.id);
    }
  } catch (error) {
    console.error('Error syncing payment:', error);
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle webhook verification
  if (req.method === 'GET') {
    // QuickBooks sends a verification request with a challenge parameter
    const challenge = req.query.challenge;
    if (challenge) {
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(challenge);
    }
    return res.status(400).json({ error: 'Invalid verification request' });
  }

  // Only accept POST for actual webhooks
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook signature
  if (!verifyWebhookSignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  try {
    const event = req.body as QuickBooksWebhookEvent;
    
    // Process each notification
    for (const notification of event.eventNotifications) {
      const { realmId, dataChangeEvent } = notification;
      
      for (const entity of dataChangeEvent.entities) {
        
        switch (entity.name) {
          case 'Customer':
            if (entity.operation !== 'Delete') {
              await syncCustomer(entity.id, realmId);
            }
            break;
            
          case 'Invoice':
            if (entity.operation !== 'Delete') {
              await syncInvoice(entity.id, realmId);
            }
            break;
            
          case 'Payment':
            if (entity.operation !== 'Delete') {
              await syncPayment(entity.id, realmId);
            }
            break;
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}