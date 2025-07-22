import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// QuickBooks API configuration
const getQuickBooksConfig = () => {
  const clientId = process.env.QUICKBOOKS_CLIENT_ID;
  const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;
  const realmId = process.env.QUICKBOOKS_REALM_ID;
  const accessToken = process.env.QUICKBOOKS_ACCESS_TOKEN;
  const refreshToken = process.env.QUICKBOOKS_REFRESH_TOKEN;
  const environment = process.env.QUICKBOOKS_ENVIRONMENT || 'sandbox';
  
  const baseUrl = environment === 'production' 
    ? 'https://quickbooks.api.intuit.com' 
    : 'https://sandbox-quickbooks.api.intuit.com';
    
  return {
    clientId,
    clientSecret,
    realmId,
    accessToken,
    refreshToken,
    baseUrl
  };
};

// Make authenticated QuickBooks API request
async function makeQuickBooksRequest(
  endpoint: string, 
  accessToken: string, 
  realmId: string,
  baseUrl: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${baseUrl}/v3/company/${realmId}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`QuickBooks API error: ${response.status} - ${error}`);
  }

  return await response.json();
}

// Sync customers from QuickBooks
async function syncCustomers(config: any) {
  try {
    console.log('Syncing customers from QuickBooks...');
    
    const query = encodeURIComponent('SELECT * FROM Customer WHERE Active = true MAXRESULTS 100');
    const result = await makeQuickBooksRequest(
      `/query?query=${query}`,
      config.accessToken,
      config.realmId,
      config.baseUrl
    );
    
    const customers = result.QueryResponse?.Customer || [];
    console.log(`Found ${customers.length} customers in QuickBooks`);
    
    let synced = 0;
    const errors: any[] = [];
    
    for (const customer of customers) {
      try {
        // Check if client exists by QuickBooks ID
        const { data: existingClient } = await supabase
          .from('clients')
          .select('id')
          .eq('quickbooks_id', customer.Id)
          .single();
        
        const clientData = {
          quickbooks_id: customer.Id,
          name: customer.DisplayName || customer.CompanyName || 'Unknown',
          email: customer.PrimaryEmailAddr?.Address || `customer${customer.Id}@placeholder.com`,
          phone: customer.PrimaryPhone?.FreeFormNumber || '',
          balance: customer.Balance || 0,
          quickbooks_sync_token: customer.SyncToken,
          subscription_plan: 'Basic',
          subscription_status: customer.Active ? 'active' : 'inactive',
          updated_at: new Date().toISOString()
        };
        
        if (existingClient) {
          // Update existing client
          const { error } = await supabase
            .from('clients')
            .update(clientData)
            .eq('id', existingClient.id);
            
          if (error) throw error;
        } else {
          // Create new client
          const { error } = await supabase
            .from('clients')
            .insert({
              ...clientData,
              created_at: new Date().toISOString()
            });
            
          if (error) throw error;
        }
        
        synced++;
      } catch (error) {
        console.error(`Error syncing customer ${customer.DisplayName}:`, error);
        errors.push({ customerId: customer.Id, name: customer.DisplayName, error });
      }
    }
    
    return { synced, errors: errors.length, details: errors };
    
  } catch (error) {
    console.error('Error syncing customers:', error);
    throw error;
  }
}

// Sync invoices from QuickBooks
async function syncInvoices(config: any) {
  try {
    console.log('Syncing invoices from QuickBooks...');
    
    const query = encodeURIComponent('SELECT * FROM Invoice MAXRESULTS 100');
    const result = await makeQuickBooksRequest(
      `/query?query=${query}`,
      config.accessToken,
      config.realmId,
      config.baseUrl
    );
    
    const invoices = result.QueryResponse?.Invoice || [];
    console.log(`Found ${invoices.length} invoices in QuickBooks`);
    
    let synced = 0;
    const errors: any[] = [];
    
    for (const invoice of invoices) {
      try {
        // Get client by QuickBooks customer ID
        const { data: client } = await supabase
          .from('clients')
          .select('id')
          .eq('quickbooks_id', invoice.CustomerRef.value)
          .single();
        
        if (!client) {
          console.warn(`Client not found for QuickBooks customer ${invoice.CustomerRef.value}`);
          continue;
        }
        
        const invoiceData = {
          quickbooks_id: invoice.Id,
          client_id: client.id,
          invoice_number: invoice.DocNumber,
          amount: invoice.TotalAmt,
          balance: invoice.Balance,
          due_date: invoice.DueDate,
          issue_date: invoice.TxnDate,
          status: invoice.Balance > 0 ? 'pending' : 'paid',
          quickbooks_sync_token: invoice.SyncToken,
          updated_at: new Date().toISOString()
        };
        
        // Check if invoice exists
        const { data: existingInvoice } = await supabase
          .from('invoices')
          .select('id')
          .eq('quickbooks_id', invoice.Id)
          .single();
        
        if (existingInvoice) {
          // Update existing invoice
          const { error } = await supabase
            .from('invoices')
            .update(invoiceData)
            .eq('id', existingInvoice.id);
            
          if (error) throw error;
        } else {
          // Create new invoice
          const { error } = await supabase
            .from('invoices')
            .insert({
              ...invoiceData,
              created_at: new Date().toISOString()
            });
            
          if (error) throw error;
        }
        
        synced++;
      } catch (error) {
        console.error(`Error syncing invoice ${invoice.DocNumber}:`, error);
        errors.push({ invoiceId: invoice.Id, number: invoice.DocNumber, error });
      }
    }
    
    return { synced, errors: errors.length, details: errors };
    
  } catch (error) {
    console.error('Error syncing invoices:', error);
    throw error;
  }
}

// Sync payments from QuickBooks
async function syncPayments(config: any) {
  try {
    console.log('Syncing payments from QuickBooks...');
    
    const query = encodeURIComponent('SELECT * FROM Payment MAXRESULTS 100');
    const result = await makeQuickBooksRequest(
      `/query?query=${query}`,
      config.accessToken,
      config.realmId,
      config.baseUrl
    );
    
    const payments = result.QueryResponse?.Payment || [];
    console.log(`Found ${payments.length} payments in QuickBooks`);
    
    let synced = 0;
    const errors: any[] = [];
    
    for (const payment of payments) {
      try {
        // Get client by QuickBooks customer ID
        const { data: client } = await supabase
          .from('clients')
          .select('id')
          .eq('quickbooks_id', payment.CustomerRef.value)
          .single();
        
        if (!client) {
          console.warn(`Client not found for QuickBooks customer ${payment.CustomerRef.value}`);
          continue;
        }
        
        // Process linked transactions (usually invoices)
        for (const line of payment.Line || []) {
          for (const linkedTxn of line.LinkedTxn || []) {
            if (linkedTxn.TxnType === 'Invoice') {
              // Find the invoice
              const { data: invoice } = await supabase
                .from('invoices')
                .select('id')
                .eq('quickbooks_id', linkedTxn.TxnId)
                .single();
              
              if (invoice) {
                // Record the payment
                const { error } = await supabase
                  .from('payments')
                  .upsert({
                    quickbooks_id: payment.Id,
                    invoice_id: invoice.id,
                    client_id: client.id,
                    amount: line.Amount,
                    payment_date: payment.TxnDate,
                    payment_method: 'quickbooks',
                    transaction_id: payment.Id,
                    created_at: new Date().toISOString()
                  }, {
                    onConflict: 'quickbooks_id'
                  });
                
                if (error) throw error;
                synced++;
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error syncing payment ${payment.Id}:`, error);
        errors.push({ paymentId: payment.Id, error });
      }
    }
    
    return { synced, errors: errors.length, details: errors };
    
  } catch (error) {
    console.error('Error syncing payments:', error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const config = getQuickBooksConfig();
  
  if (!config.clientId || !config.clientSecret) {
    return res.status(500).json({ error: 'QuickBooks credentials not configured' });
  }
  
  if (!config.accessToken || !config.realmId) {
    return res.status(401).json({ 
      error: 'QuickBooks not connected',
      authUrl: `/api/auth/quickbooks`
    });
  }
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase configuration missing' });
  }
  
  try {
    console.log('Starting QuickBooks sync...');
    
    // Sync data in order: customers -> invoices -> payments
    const customersResult = await syncCustomers(config);
    const invoicesResult = await syncInvoices(config);
    const paymentsResult = await syncPayments(config);
    
    const summary = {
      success: true,
      customers: {
        synced: customersResult.synced,
        errors: customersResult.errors
      },
      invoices: {
        synced: invoicesResult.synced,
        errors: invoicesResult.errors
      },
      payments: {
        synced: paymentsResult.synced,
        errors: paymentsResult.errors
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('QuickBooks sync completed:', summary);
    return res.status(200).json(summary);
    
  } catch (error: any) {
    console.error('QuickBooks sync error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to sync QuickBooks data' 
    });
  }
}