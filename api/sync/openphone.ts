import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface OpenPhoneCall {
  id: string;
  phoneNumberId: string;
  direction: 'inbound' | 'outbound';
  status: string;
  from: string;
  to: string;
  createdAt: string;
  updatedAt: string;
  answeredAt?: string;
  completedAt?: string;
  duration?: number;
  recording?: {
    id: string;
    url: string;
    duration: number;
  };
}

interface OpenPhoneMessage {
  id: string;
  phoneNumberId: string;
  direction: 'inbound' | 'outbound';
  status: string;
  from: string;
  to: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchFromOpenPhone(endpoint: string, apiKey: string) {
  const response = await fetch(`https://api.openphone.com/v1${endpoint}`, {
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`OpenPhone API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function syncCalls(apiKey: string, limit = 100) {
  try {
    console.log('Syncing calls from OpenPhone...');
    const response = await fetchFromOpenPhone(`/calls?limit=${limit}`, apiKey);
    const calls: OpenPhoneCall[] = response.data || [];

    if (calls.length === 0) {
      console.log('No calls to sync');
      return { synced: 0, errors: [] };
    }

    let synced = 0;
    const errors: any[] = [];

    for (const call of calls) {
      try {
        // Determine the customer phone number
        const phoneNumber = call.direction === 'inbound' ? call.from : call.to;
        const clientName = `Customer ${phoneNumber}`;

        // Check if client exists
        const { data: existingClient } = await supabase
          .from('clients')
          .select('id')
          .eq('phone', phoneNumber)
          .single();

        let clientId: string;

        if (existingClient) {
          clientId = existingClient.id;
        } else {
          // Create a new client
          const { data: newClient, error: clientError } = await supabase
            .from('clients')
            .insert({
              name: clientName,
              phone: phoneNumber,
              email: `${phoneNumber.replace(/\D/g, '')}@placeholder.com`,
              subscription_plan: 'Basic',
              subscription_status: 'active',
              created_at: new Date().toISOString()
            })
            .select()
            .single();

          if (clientError) throw clientError;
          clientId = newClient.id;
        }

        // Insert call record
        const { error: callError } = await supabase
          .from('calls')
          .upsert({
            id: call.id,
            client_id: clientId,
            start_time: call.createdAt,
            end_time: call.completedAt || call.createdAt,
            duration: call.duration || 0,
            status: call.status,
            direction: call.direction,
            from_number: call.from,
            to_number: call.to,
            recording_url: call.recording?.url,
            created_at: call.createdAt,
            updated_at: call.updatedAt
          }, {
            onConflict: 'id'
          });

        if (callError) throw callError;
        synced++;

      } catch (error) {
        console.error(`Error syncing call ${call.id}:`, error);
        errors.push({ callId: call.id, error });
      }
    }

    console.log(`Synced ${synced} calls with ${errors.length} errors`);
    return { synced, errors };

  } catch (error) {
    console.error('Error syncing calls:', error);
    throw error;
  }
}

async function syncMessages(apiKey: string, limit = 100) {
  try {
    console.log('Syncing messages from OpenPhone...');
    const response = await fetchFromOpenPhone(`/messages?limit=${limit}`, apiKey);
    const messages: OpenPhoneMessage[] = response.data || [];

    if (messages.length === 0) {
      console.log('No messages to sync');
      return { synced: 0, errors: [] };
    }

    let synced = 0;
    const errors: any[] = [];

    for (const message of messages) {
      try {
        // Determine the customer phone number
        const phoneNumber = message.direction === 'inbound' ? message.from : message.to;
        const clientName = `Customer ${phoneNumber}`;

        // Check if client exists
        const { data: existingClient } = await supabase
          .from('clients')
          .select('id')
          .eq('phone', phoneNumber)
          .single();

        let clientId: string;

        if (existingClient) {
          clientId = existingClient.id;
        } else {
          // Create a new client
          const { data: newClient, error: clientError } = await supabase
            .from('clients')
            .insert({
              name: clientName,
              phone: phoneNumber,
              email: `${phoneNumber.replace(/\D/g, '')}@placeholder.com`,
              subscription_plan: 'Basic',
              subscription_status: 'active',
              created_at: new Date().toISOString()
            })
            .select()
            .single();

          if (clientError) throw clientError;
          clientId = newClient.id;
        }

        // Insert message record
        const { error: messageError } = await supabase
          .from('messages')
          .upsert({
            id: message.id,
            client_id: clientId,
            content: message.body,
            direction: message.direction,
            status: message.status === 'delivered' ? 'sent' : message.status,
            from_number: message.from,
            to_number: message.to,
            created_at: message.createdAt,
            updated_at: message.updatedAt
          }, {
            onConflict: 'id'
          });

        if (messageError) throw messageError;
        synced++;

      } catch (error) {
        console.error(`Error syncing message ${message.id}:`, error);
        errors.push({ messageId: message.id, error });
      }
    }

    console.log(`Synced ${synced} messages with ${errors.length} errors`);
    return { synced, errors };

  } catch (error) {
    console.error('Error syncing messages:', error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENPHONE_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenPhone API key not configured' });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase configuration missing' });
  }

  try {
    console.log('Starting OpenPhone sync...');
    
    // Get phone numbers first
    const phoneNumbersResponse = await fetchFromOpenPhone('/phone-numbers', apiKey);
    const phoneNumbers = phoneNumbersResponse.data || [];

    // Sync calls and messages
    const callsResult = await syncCalls(apiKey);
    const messagesResult = await syncMessages(apiKey);

    const summary = {
      success: true,
      phoneNumbers: phoneNumbers.length,
      calls: {
        synced: callsResult.synced,
        errors: callsResult.errors.length
      },
      messages: {
        synced: messagesResult.synced,
        errors: messagesResult.errors.length
      },
      timestamp: new Date().toISOString()
    };

    console.log('Sync completed:', summary);
    return res.status(200).json(summary);

  } catch (error: any) {
    console.error('Sync error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to sync OpenPhone data' 
    });
  }
}