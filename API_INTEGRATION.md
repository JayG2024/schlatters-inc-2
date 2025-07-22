# API Integration Guide

This document outlines the API endpoints and webhooks available for integrating Schlatter's Inc. with external services.

## Webhook Endpoints

### OpenPhone Webhook (`/api/webhooks/openphone`)

Handles real-time call and SMS events from OpenPhone.

**Endpoint**: `POST https://your-domain.vercel.app/api/webhooks/openphone`

**Supported Events**:
- `call.started` - New incoming or outgoing call
- `call.answered` - Call was answered by an agent
- `call.ended` - Call completed with duration and recording
- `call.missed` - Call was not answered
- `message.created` - New SMS sent or received
- `message.updated` - SMS status updated

**Features**:
- Automatic client identification by phone number
- Real-time call queue updates
- Subscription hour tracking
- Pay-per-call billing for non-subscribers
- Call recording URL storage

**Setup**:
1. Configure webhook URL in OpenPhone settings
2. Set `OPENPHONE_WEBHOOK_SECRET` environment variable
3. Ensure Supabase service key is configured

### QuickBooks Webhook (`/api/webhooks/quickbooks`)

Syncs customer, invoice, and payment data from QuickBooks.

**Endpoint**: `POST https://your-domain.vercel.app/api/webhooks/quickbooks`

**Supported Entities**:
- `Customer` - Sync client information
- `Invoice` - Track outstanding balances
- `Payment` - Update payment history

**Features**:
- Phone number matching for client identification
- Automatic client creation for new QuickBooks customers
- Outstanding balance tracking
- Lifetime value calculation

**Setup**:
1. Configure webhook in QuickBooks app settings
2. Set `QUICKBOOKS_WEBHOOK_TOKEN` environment variable
3. Implement OAuth token refresh logic
4. Set `QUICKBOOKS_ACCESS_TOKEN` (temporary)

## API Endpoints

### Call Transcripts (`/api/calls/transcripts`)

Manage call transcripts linked to client records.

**Get Transcript**:
```
GET /api/calls/transcripts?call_id=123
GET /api/calls/transcripts?client_id=456
```

**Create/Update Transcript**:
```
POST /api/calls/transcripts
{
  "call_id": "call-123",
  "transcript_segments": [
    {
      "speaker": "agent",
      "text": "Thank you for calling Schlatter's Inc....",
      "timestamp": 0,
      "sentiment": "positive"
    },
    {
      "speaker": "client", 
      "text": "I need help with...",
      "timestamp": 5,
      "sentiment": "neutral"
    }
  ],
  "summary": "Client requested help with..."
}
```

**Features**:
- Automatic keyword extraction
- Sentiment analysis
- Action item detection
- Full-text search capability

## Environment Variables

Required environment variables for API integrations:

```env
# Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# OpenPhone
OPENPHONE_WEBHOOK_SECRET=your-webhook-secret

# QuickBooks
QUICKBOOKS_WEBHOOK_TOKEN=your-webhook-token
QUICKBOOKS_ACCESS_TOKEN=your-access-token
QUICKBOOKS_REFRESH_TOKEN=your-refresh-token
QUICKBOOKS_CLIENT_ID=your-client-id
QUICKBOOKS_CLIENT_SECRET=your-client-secret
```

## Database Schema

The API endpoints expect the following Supabase tables:

### clients
- id (uuid)
- name (text)
- company (text)
- email (text)
- phone (text)
- alternate_phone (text)
- quickbooks_id (text)
- is_subscriber (boolean)
- subscription_status (text)
- total_revenue (numeric)
- outstanding_balance (numeric)
- lifetime_value (numeric)
- last_contact_date (timestamp)
- last_contact_type (text)

### calls
- id (uuid)
- call_id (text, unique)
- client_id (uuid, references clients)
- phone_number (text)
- direction (text)
- status (text)
- started_at (timestamp)
- answered_at (timestamp)
- ended_at (timestamp)
- duration (integer)
- billable_minutes (integer)
- rate (numeric)
- total_charge (numeric)
- recording_url (text)
- has_transcript (boolean)

### call_transcripts
- id (uuid)
- call_id (text, references calls.call_id)
- client_id (uuid, references clients)
- transcript_text (text)
- transcript_segments (jsonb)
- summary (text)
- sentiment_overall (text)
- keywords (text[])
- action_items (text[])
- created_at (timestamp)
- updated_at (timestamp)

### messages
- id (uuid)
- message_id (text, unique)
- conversation_id (text)
- client_id (uuid, references clients)
- phone_number (text)
- direction (text)
- body (text)
- created_at (timestamp)

### subscriptions
- id (uuid)
- client_id (uuid, references clients)
- plan_name (text)
- status (text)
- hours_included (integer)
- hours_used (numeric)
- hours_remaining (numeric)
- monthly_rate (numeric)
- start_date (date)
- end_date (date)

### call_charges
- id (uuid)
- client_id (uuid, references clients)
- call_id (text)
- duration (integer)
- rate (numeric)
- total_charge (numeric)
- status (text)
- invoice_id (text)

### live_calls
- id (uuid)
- call_id (text, unique)
- client_name (text)
- client_company (text)
- phone_number (text)
- is_subscriber (boolean)
- subscription_hours_remaining (numeric)
- status (text)
- started_at (timestamp)
- agent_name (text)

## Testing

### Test OpenPhone Webhook
```bash
curl -X POST https://your-domain.vercel.app/api/webhooks/openphone \
  -H "Content-Type: application/json" \
  -H "x-openphone-signature: your-signature" \
  -d '{
    "id": "evt_123",
    "type": "call.started",
    "data": {
      "callId": "call_123",
      "direction": "inbound",
      "from": "+15551234567",
      "to": "+15559876543",
      "startedAt": "2025-01-09T10:00:00Z",
      "status": "ringing"
    },
    "timestamp": "2025-01-09T10:00:00Z"
  }'
```

### Test QuickBooks Webhook
```bash
# Verification
curl https://your-domain.vercel.app/api/webhooks/quickbooks?challenge=test123

# Webhook
curl -X POST https://your-domain.vercel.app/api/webhooks/quickbooks \
  -H "Content-Type: application/json" \
  -H "intuit-signature: your-signature" \
  -d '{
    "eventNotifications": [{
      "realmId": "123456789",
      "dataChangeEvent": {
        "entities": [{
          "name": "Customer",
          "id": "1",
          "operation": "Update",
          "lastUpdated": "2025-01-09T10:00:00Z"
        }]
      }
    }]
  }'
```

## Next Steps

1. **Deploy to Vercel**: Push changes to trigger automatic deployment
2. **Configure Webhooks**: Add webhook URLs to OpenPhone and QuickBooks
3. **Set Environment Variables**: Add all required keys in Vercel dashboard
4. **Create Database Tables**: Run migration scripts in Supabase
5. **Test Integrations**: Use test endpoints to verify connectivity
6. **Monitor Logs**: Check Vercel function logs for errors

## Security Notes

- Always verify webhook signatures
- Use environment variables for sensitive data
- Implement rate limiting for public endpoints
- Log webhook events for debugging
- Use Supabase RLS policies for data protection