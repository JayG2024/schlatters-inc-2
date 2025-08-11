import { VercelRequest, VercelResponse } from '../types';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!; // Use service key for server-side operations
const supabase = createClient(supabaseUrl, supabaseKey);

// OpenPhone webhook event types
interface OpenPhoneCallEvent {
  id: string;
  type: 'call.started' | 'call.answered' | 'call.ended' | 'call.missed';
  data: {
    callId: string;
    phoneNumberId: string;
    direction: 'inbound' | 'outbound';
    from: string;
    to: string;
    startedAt?: string;
    answeredAt?: string;
    endedAt?: string;
    duration?: number; // in seconds
    status: 'ringing' | 'in-progress' | 'completed' | 'missed' | 'failed';
    recordingUrl?: string;
    voicemailUrl?: string;
    userId?: string; // OpenPhone user who handled the call
    conversationId?: string;
  };
  timestamp: string;
}

interface OpenPhoneSMSEvent {
  id: string;
  type: 'message.created' | 'message.updated';
  data: {
    messageId: string;
    conversationId: string;
    phoneNumberId: string;
    direction: 'inbound' | 'outbound';
    from: string;
    to: string;
    body: string;
    createdAt: string;
    userId?: string;
  };
  timestamp: string;
}

type OpenPhoneWebhookEvent = OpenPhoneCallEvent | OpenPhoneSMSEvent;

// Verify webhook signature using timing-safe comparison
function verifyWebhookSignature(req: VercelRequest): boolean {
  const webhookSecret = process.env.OPENPHONE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('OPENPHONE_WEBHOOK_SECRET not configured');
    return false;
  }

  // Get signature and timestamp from headers
  const signature = req.headers['x-openphone-signature'] as string;
  const timestamp = req.headers['x-openphone-timestamp'] as string;
  
  if (!signature || !timestamp) {
    console.error('Missing signature or timestamp headers');
    return false;
  }

  // Verify timestamp is recent (within 5 minutes)
  const currentTime = Math.floor(Date.now() / 1000);
  const webhookTime = parseInt(timestamp, 10);
  if (Math.abs(currentTime - webhookTime) > 300) {
    console.error('Webhook timestamp too old');
    return false;
  }

  // Recreate the signature
  const payload = `${timestamp}.${JSON.stringify(req.body)}`;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

// Look up client by phone number
async function getClientByPhone(phoneNumber: string) {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      subscription:subscriptions(*)
    `)
    .or(`phone.eq.${phoneNumber},alternate_phone.eq.${phoneNumber}`)
    .single();

  if (error) {
    console.error('Error fetching client:', error);
    return null;
  }

  return data;
}

// Handle call events
async function handleCallEvent(event: OpenPhoneCallEvent) {
  const { data: callData } = event;
  
  // Get client information
  const client = await getClientByPhone(callData.direction === 'inbound' ? callData.from : callData.to);
  
  switch (event.type) {
    case 'call.started':
      // Log new call in database
      const { error: insertError } = await supabase.from('calls').insert({
        call_id: callData.callId,
        client_id: client?.id,
        phone_number: callData.direction === 'inbound' ? callData.from : callData.to,
        direction: callData.direction,
        status: 'ringing',
        started_at: callData.startedAt || event.timestamp,
        is_subscriber: client?.subscription?.status === 'active',
        subscription_hours_remaining: client?.subscription?.hours_remaining,
      });

      if (insertError) {
        console.error('Error inserting call:', insertError);
      }

      // Broadcast to real-time subscribers for live call queue
      await supabase.from('live_calls').insert({
        call_id: callData.callId,
        client_name: client?.name || 'Unknown',
        client_company: client?.company,
        phone_number: callData.direction === 'inbound' ? callData.from : callData.to,
        is_subscriber: client?.subscription?.status === 'active',
        subscription_hours_remaining: client?.subscription?.hours_remaining,
        status: 'ringing',
        started_at: event.timestamp,
      });
      break;

    case 'call.answered':
      // Update call status
      await supabase
        .from('calls')
        .update({
          status: 'connected',
          answered_at: callData.answeredAt,
          agent_id: callData.userId,
        })
        .eq('call_id', callData.callId);

      // Update live call queue
      await supabase
        .from('live_calls')
        .update({
          status: 'connected',
          agent_name: callData.userId, // TODO: Look up actual agent name
        })
        .eq('call_id', callData.callId);
      break;

    case 'call.ended':
      // Calculate call duration and billing
      const duration = callData.duration || 0;
      const billableMinutes = Math.ceil(duration / 60);
      const isSubscriber = client?.subscription?.status === 'active';
      const rate = isSubscriber ? 0 : 3.00; // $3/minute for pay-per-call
      const totalCharge = billableMinutes * rate;

      // Update call record
      await supabase
        .from('calls')
        .update({
          status: 'completed',
          ended_at: callData.endedAt,
          duration: duration,
          billable_minutes: billableMinutes,
          rate: rate,
          total_charge: totalCharge,
          recording_url: callData.recordingUrl,
        })
        .eq('call_id', callData.callId);

      // Remove from live calls
      await supabase
        .from('live_calls')
        .delete()
        .eq('call_id', callData.callId);

      // Update client's subscription hours if applicable
      if (isSubscriber && client?.subscription) {
        const hoursUsed = billableMinutes / 60;
        await supabase
          .from('subscriptions')
          .update({
            hours_used: (client.subscription.hours_used || 0) + hoursUsed,
            hours_remaining: Math.max(0, (client.subscription.hours_remaining || 0) - hoursUsed),
          })
          .eq('id', client.subscription.id);
      }

      // Create billing record for pay-per-call
      if (!isSubscriber && totalCharge > 0) {
        await supabase.from('call_charges').insert({
          client_id: client?.id,
          call_id: callData.callId,
          duration: duration,
          rate: rate,
          total_charge: totalCharge,
          status: 'pending',
        });
      }
      break;

    case 'call.missed':
      // Update call status
      await supabase
        .from('calls')
        .update({
          status: 'missed',
          ended_at: event.timestamp,
        })
        .eq('call_id', callData.callId);

      // Remove from live calls
      await supabase
        .from('live_calls')
        .delete()
        .eq('call_id', callData.callId);
      break;
  }
}

// Handle SMS events
async function handleSMSEvent(event: OpenPhoneSMSEvent) {
  const { data: smsData } = event;
  
  // Get client information
  const client = await getClientByPhone(smsData.direction === 'inbound' ? smsData.from : smsData.to);
  
  // Log SMS in database
  const { error } = await supabase.from('messages').insert({
    message_id: smsData.messageId,
    conversation_id: smsData.conversationId,
    client_id: client?.id,
    phone_number: smsData.direction === 'inbound' ? smsData.from : smsData.to,
    direction: smsData.direction,
    body: smsData.body,
    created_at: smsData.createdAt,
    user_id: smsData.userId,
  });

  if (error) {
    console.error('Error inserting message:', error);
  }

  // Update client's last contact
  if (client) {
    await supabase
      .from('clients')
      .update({
        last_contact_date: smsData.createdAt,
        last_contact_type: 'sms',
      })
      .eq('id', client.id);
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Temporarily skip signature verification for initial testing
  const skipVerification = process.env.SKIP_WEBHOOK_VERIFICATION === 'true';
  
  // Verify webhook signature
  if (!skipVerification && !verifyWebhookSignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  try {
    const event = req.body as OpenPhoneWebhookEvent;
    
    // Handle different event types
    if (event.type.startsWith('call.')) {
      await handleCallEvent(event as OpenPhoneCallEvent);
    } else if (event.type.startsWith('message.')) {
      await handleSMSEvent(event as OpenPhoneSMSEvent);
    }

    // Respond quickly to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}