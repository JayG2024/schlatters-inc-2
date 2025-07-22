import { supabase } from '../lib/supabase';

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
  voicemail?: {
    id: string;
    url: string;
    duration: number;
    transcription?: string;
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
  media?: Array<{
    id: string;
    url: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface OpenPhonePhoneNumber {
  id: string;
  phoneNumber: string;
  status?: string;
  type?: string;
  [key: string]: any;
}

export class OpenPhoneSync {
  private apiKey: string;
  private baseUrl = 'https://api.openphone.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchFromOpenPhone(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`OpenPhone API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async findOrCreateClient(phoneNumber: string): Promise<string> {
    const clientName = `Customer ${phoneNumber}`;
    // Check if client exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('phone', phoneNumber)
      .single();

    if (existingClient) {
      return existingClient.id;
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
      return newClient.id;
    }
  }

  async syncCalls(limit = 100) {
    try {
      console.log('Syncing calls from OpenPhone...');
      const response = await this.fetchFromOpenPhone(`/calls?limit=${limit}`);
      const calls: OpenPhoneCall[] = response.data || [];

      if (calls.length === 0) {
        console.log('No calls to sync');
        return { synced: 0, errors: [] };
      }

      let synced = 0;
      const errors: any[] = [];

      for (const call of calls) {
        try {
          // First, try to find or create a client based on the phone number
          const phoneNumber = call.direction === 'inbound' ? call.from : call.to;
          const clientId = await this.findOrCreateClient(phoneNumber);

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

  async syncMessages(limit = 100) {
    try {
      console.log('Syncing messages from OpenPhone...');
      const response = await this.fetchFromOpenPhone(`/messages?limit=${limit}`);
      const messages: OpenPhoneMessage[] = response.data || [];

      if (messages.length === 0) {
        console.log('No messages to sync');
        return { synced: 0, errors: [] };
      }

      let synced = 0;
      const errors: any[] = [];

      for (const message of messages) {
        try {
          // First, try to find or create a client based on the phone number
          const phoneNumber = message.direction === 'inbound' ? message.from : message.to;
          const clientId = await this.findOrCreateClient(phoneNumber);

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

  async syncPhoneNumbers() {
    try {
      console.log('Syncing phone numbers from OpenPhone...');
      const response = await this.fetchFromOpenPhone('/phone-numbers');
      const phoneNumbers: OpenPhonePhoneNumber[] = response.data || [];

      if (phoneNumbers.length === 0) {
        console.log('No phone numbers to sync');
        return { synced: 0, errors: [] };
      }

      let synced = 0;
      const errors: any[] = [];

      for (const phoneNumberObj of phoneNumbers) {
        try {
          const { id, phoneNumber, status, type, ...rest } = phoneNumberObj;

          const { error: upsertError } = await supabase
            .from('live_calls')
            .upsert({
              call_id: id,
              phone_number: phoneNumber,
              status: status || 'active',
              ...rest,
              started_at: new Date().toISOString(),
            }, {
              onConflict: 'call_id'
            });

          if (upsertError) throw upsertError;
          synced++;
        } catch (error) {
          console.error(`Error syncing phone number`, error);
          errors.push({ phoneNumber: phoneNumberObj, error });
        }
      }

      console.log(`Synced ${synced} phone numbers with ${errors.length} errors`);
      return { synced, errors };

    } catch (error) {
      console.error('Error syncing phone numbers:', error);
      throw error;
    }
  }

  async performFullSync() {
    console.log('Starting full OpenPhone sync...');
    
    try {
      const phoneNumbers = await this.syncPhoneNumbers();
      const callsResult = await this.syncCalls();
      const messagesResult = await this.syncMessages();

      const summary = {
        phoneNumbers: phoneNumbers.synced,
        calls: callsResult,
        messages: messagesResult,
        timestamp: new Date().toISOString()
      };

      console.log('Full sync completed:', summary);
      return summary;

    } catch (error) {
      console.error('Error during full sync:', error);
      throw error;
    }
  }
}

// Export a function to trigger sync from API endpoints
export async function triggerOpenPhoneSync() {
  const apiKey = process.env.OPENPHONE_API_KEY || '';
  
  if (!apiKey) {
    throw new Error('OpenPhone API key not configured');
  }

  const sync = new OpenPhoneSync(apiKey);
  return await sync.performFullSync();
}