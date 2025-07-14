# Schlatters Inc - Complete Platform Overview

## Business Model: CRM + Phone Support Billing

### Core Services
1. **Phone Support Consulting** - Billed by time
2. **Annual Support Subscriptions** - Included hours packages
3. **Professional Services** - Other products/services they've sold

## Key Platform Features

### 1. Smart Caller Identification
When a call comes in via OpenPhone:
- Instantly identifies if caller is a subscriber or pay-per-call
- Shows remaining subscription hours
- Displays complete customer history
- Auto-tracks call duration for billing

### 2. Full CRM Capabilities
- **Complete Client Database**
  - Current subscribers
  - Past clients (for upselling)
  - Full purchase history (not just support)
  - All communication history linked
  
- **Unified Communication Timeline**
  - Every call with transcript
  - Every SMS conversation
  - Every email sent
  - All linked to client record

### 3. Built-in Communication Tools
- **SMS**: Send directly from client profile
- **Email**: Send from platform with templates
- **Call**: Click-to-call via OpenPhone
- **All logged automatically** to client record

### 4. Document Management
- Process documentation for team
- Client-specific documents
- Shareable resources

## Client Profile Features

### Information Tracked
- Contact details (phone, email, address)
- Company information
- QuickBooks customer ID
- Subscription status & usage
- Total lifetime revenue
- Outstanding balances
- Complete purchase history
- Full communication timeline
- Notes and tags

### Quick Actions
- Call client
- Send SMS
- Send email
- View/add notes
- Offer support plan (if not subscriber)

## Workflow Example

### Incoming Support Call
1. Phone rings → OpenPhone webhook fires
2. System identifies caller: "John from Acme Corp"
3. Dashboard shows:
   - ✅ Active subscriber (5.2 hours remaining this month)
   - Last called 3 days ago about API integration
   - Has outstanding invoice for $500
   - Purchased "Premium Setup Package" last month
4. Call ends → Duration logged → Hours deducted
5. Transcript saved to John's profile

### Upselling Opportunity
1. View past clients without subscriptions
2. See their purchase history
3. Send targeted SMS/email: "Hi Sarah, we noticed you purchased our setup service last year. Would you like to add a support plan?"
4. Track responses in platform

## Data Flow

```
OpenPhone → Webhooks → Your Platform ← → QuickBooks
    ↓                        ↓                ↓
Call Events            Client Records    Financial Data
    ↓                        ↓                ↓
Duration              Communication      Subscriptions
Tracking                History           & Invoices
```

## Key Integrations

### OpenPhone
- Real-time call events
- SMS sending/receiving
- Call recordings & transcripts
- Automatic duration tracking

### QuickBooks
- Customer database sync
- Invoice creation
- Payment tracking
- Subscription management

### Gmail
- Email sending
- Templates
- Follow-up automation

### Supabase
- Real-time data updates
- User authentication
- Activity logging
- Document storage

## Pages to Build

### Admin Dashboard
1. **Overview** - Live activity, key metrics
2. **Clients** - Full CRM with all features above
3. **Support Calls** - Live queue, history, transcripts
4. **Billing** - Subscriptions, charges, QuickBooks sync
5. **Support Hours** - Usage analytics
6. **Documents** - Process docs, resources

### Client Portal
1. **Dashboard** - Subscription status, usage
2. **Support Usage** - Hours used, remaining
3. **Billing** - Invoices, payment history
4. **Call History** - Their support calls
5. **Get Support** - How to reach team

## Smart Features

### Automated Alerts
- "Subscription expiring in 7 days"
- "Client exceeded included hours"
- "High-value client calling"
- "Payment overdue - handle with care"

### Analytics
- Average call duration by client
- Most active support hours
- Revenue per client
- Subscription renewal rates
- Support hour utilization

### Bulk Actions
- Send SMS to all expiring subscriptions
- Email past clients about new plans
- Export client data for campaigns

This creates a complete business management platform that handles support delivery, billing, and customer relationships in one place.