import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email: string, password: string, metadata?: any) => {
  return await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: metadata
    }
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Type definitions for our tables
export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone: string;
  alternate_phone?: string;
  quickbooks_id?: string;
  is_subscriber: boolean;
  subscription_status?: string;
  total_revenue: number;
  outstanding_balance: number;
  lifetime_value: number;
  last_contact_date?: string;
  last_contact_type?: string;
  total_calls: number;
  total_messages: number;
  purchase_count: number;
  notes?: string;
  tags?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  client_id: string;
  plan_name: string;
  status: string;
  hours_included: number;
  hours_used: number;
  hours_remaining: number;
  monthly_rate: number;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  last_payment_date?: string;
  next_billing_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Call {
  id: string;
  call_id: string;
  client_id?: string;
  phone_number: string;
  direction: string;
  status: string;
  started_at: string;
  answered_at?: string;
  ended_at?: string;
  duration?: number;
  billable_minutes?: number;
  rate?: number;
  total_charge?: number;
  recording_url?: string;
  has_transcript: boolean;
  agent_id?: string;
  created_at: string;
}

// Helper functions
export const clientsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        subscription:subscriptions(*)
      `)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        subscription:subscriptions(*),
        calls(*),
        messages(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(client: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const callsApi = {
  async getLiveCalls() {
    const { data, error } = await supabase
      .from('live_calls')
      .select('*')
      .order('started_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getCallHistory(limit = 50) {
    const { data, error } = await supabase
      .from('calls')
      .select(`
        *,
        client:clients(name, company)
      `)
      .order('started_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

export const subscriptionsApi = {
  async getActive() {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        client:clients(name, company, phone)
      `)
      .eq('status', 'active')
      .order('end_date');
    
    if (error) throw error;
    return data;
  }
};

// Real-time subscriptions
export const realtimeSubscriptions = {
  subscribeToLiveCalls(callback: (payload: any) => void) {
    return supabase
      .channel('live-calls')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'live_calls' 
      }, callback)
      .subscribe();
  },

  subscribeToMessages(clientId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`messages-${clientId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `client_id=eq.${clientId}`
      }, callback)
      .subscribe();
  }
};