import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Invoice {
  id: string;
  quickbooks_id?: string;
  client_id: string;
  invoice_number: string;
  amount: number;
  balance: number;
  due_date: string;
  issue_date?: string;
  status: string;
  client?: {
    name: string;
    email: string;
    phone: string;
  };
}

interface Payment {
  id: string;
  quickbooks_id?: string;
  client_id: string;
  invoice_id?: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  transaction_id?: string;
  client?: {
    name: string;
  };
}

interface QuickBooksStats {
  totalRevenue: number;
  outstandingInvoices: number;
  overdueInvoices: number;
  totalCustomers: number;
  recentPayments: number;
}

export function useQuickBooksData() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<QuickBooksStats>({
    totalRevenue: 0,
    outstandingInvoices: 0,
    overdueInvoices: 0,
    totalCustomers: 0,
    recentPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch invoices with client info
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          client:clients(name, email, phone)
        `)
        .order('due_date', { ascending: true })
        .limit(20);

      if (invoicesError) throw invoicesError;

      // Fetch recent payments with client info
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          client:clients(name)
        `)
        .order('payment_date', { ascending: false })
        .limit(10);

      if (paymentsError) throw paymentsError;

      // Calculate statistics
      const today = new Date();
      const totalRevenue = paymentsData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const outstandingInvoices = invoicesData?.filter(i => i.balance > 0).reduce((sum, i) => sum + i.balance, 0) || 0;
      const overdueInvoices = invoicesData?.filter(i => {
        return i.balance > 0 && new Date(i.due_date) < today;
      }).length || 0;

      // Get unique customers from QuickBooks
      const { count: customerCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .not('quickbooks_id', 'is', null);

      setInvoices(invoicesData || []);
      setPayments(paymentsData || []);
      setStats({
        totalRevenue,
        outstandingInvoices,
        overdueInvoices,
        totalCustomers: customerCount || 0,
        recentPayments: paymentsData?.length || 0
      });

    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching QuickBooks data:', err);
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    try {
      setSyncing(true);
      setError(null);

      const response = await fetch('/api/sync/quickbooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.authUrl) {
          // Need to authenticate first
          window.location.href = error.authUrl;
          return;
        }
        throw new Error(error.error || 'Failed to sync QuickBooks data');
      }

      const result = await response.json();
      console.log('QuickBooks sync result:', result);

      // Refresh data after sync
      await fetchData();

      return result;

    } catch (err: any) {
      setError(err.message);
      console.error('Error syncing QuickBooks data:', err);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions
    const invoicesSubscription = supabase
      .channel('invoices-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'invoices' 
      }, () => {
        fetchData();
      })
      .subscribe();

    const paymentsSubscription = supabase
      .channel('payments-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'payments' 
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      invoicesSubscription.unsubscribe();
      paymentsSubscription.unsubscribe();
    };
  }, []);

  return {
    invoices,
    payments,
    stats,
    loading,
    error,
    syncing,
    syncData,
    refetch: fetchData
  };
}

// Hook to get overdue invoices
export function useOverdueInvoices() {
  const [overdueInvoices, setOverdueInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverdueInvoices = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('invoices')
          .select(`
            *,
            client:clients(name, email, phone)
          `)
          .gt('balance', 0)
          .lt('due_date', today)
          .order('due_date', { ascending: true });

        if (error) throw error;

        setOverdueInvoices(data || []);
      } catch (error) {
        console.error('Error fetching overdue invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverdueInvoices();
  }, []);

  return { overdueInvoices, loading };
}