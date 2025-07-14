# MVP API Integration Plan - Phone Support Billing Platform

## Business Model Understanding
- **Service**: Live phone support billed by time
- **Billing Model**: 
  - Annual subscriptions with included hours
  - Pay-per-call for non-subscribers
- **Key Feature**: Automatic caller identification and time tracking

## Required APIs & Priority Order

### 1. **OpenPhone API** (CRITICAL - Week 1)
**What it provides:**
- Real-time incoming call notifications via webhooks
- Caller phone number identification
- Automatic call duration tracking
- Call recordings and transcripts
- SMS capabilities for payment reminders

**Key Integration Points:**
```javascript
// Webhook receives when call starts
{
  event: "call.ringing",
  phoneNumber: "+1234567890",
  timestamp: "2024-01-01T10:00:00Z"
}

// Webhook receives when call ends
{
  event: "call.completed",
  duration: 420, // seconds
  recording_url: "...",
  transcript_url: "..."
}
```

### 2. **QuickBooks API** (CRITICAL - Week 1)
**What it provides:**
- Customer database (matches phone to customer)
- Invoice creation for non-subscribers
- Payment tracking
- Subscription management
- Financial reporting

**Key Integration Points:**
- Lookup customer by phone number
- Check subscription status
- Create invoices for pay-per-call
- Track payments

### 3. **Supabase Database** (Already Connected)
**What it stores:**
- User authentication
- Subscription plans and limits
- Call history with durations
- Usage tracking
- Real-time updates

### 4. **Gmail API** (NICE TO HAVE - Week 2)
**What it provides:**
- Send invoice emails
- Payment reminders
- Subscription renewal notices
- Support follow-ups

## MVP Workflow

### When Someone Calls In:

1. **OpenPhone webhook fires** → "call.ringing"
2. **System checks QuickBooks** → Is this phone number a customer?
3. **Check subscription status**:
   - If subscriber → Check remaining hours
   - If not → Flag for per-call billing
4. **Display caller info** on admin dashboard in real-time
5. **Track call duration** automatically
6. **When call ends**:
   - Deduct from subscription hours OR
   - Create invoice for non-subscriber
   - Save transcript

## Pages to Build (Priority Order)

### Week 1 - Core Functionality
1. **Communications Page**
   - Live incoming calls display
   - Caller identification (subscriber/non-subscriber)
   - Call history with durations
   - Transcripts viewer

2. **Billing/Subscriptions Page**
   - Active subscriptions list
   - Hours used/remaining per client
   - Non-subscriber call charges
   - QuickBooks sync status

### Week 2 - Enhanced Features
3. **Support Hours Dashboard**
   - Visual usage charts
   - Average call duration
   - Peak calling times
   - Client usage patterns

4. **Client Portal Pages**
   - Subscription status
   - Hours remaining
   - Call history
   - Invoice history

## API Keys Needed

### OpenPhone
```env
OPENPHONE_API_KEY=your_key_here
OPENPHONE_WEBHOOK_SECRET=webhook_secret
OPENPHONE_PHONE_NUMBER=+1234567890
```

### QuickBooks
```env
QUICKBOOKS_CLIENT_ID=your_client_id
QUICKBOOKS_CLIENT_SECRET=your_client_secret
QUICKBOOKS_COMPANY_ID=your_company_id
QUICKBOOKS_REDIRECT_URI=https://your-app.vercel.app/api/auth/quickbooks/callback
```

### Gmail (Optional)
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
```

## Testing Strategy

### Phase 1: Mock Data (Current)
- Use mock data to build UI
- Test subscription logic
- Validate billing calculations

### Phase 2: API Integration (Next Week)
1. **OpenPhone Test**:
   - Set up test phone number
   - Make test calls
   - Verify webhook receives data
   - Check duration tracking

2. **QuickBooks Test**:
   - Import customer list
   - Match phone numbers
   - Create test invoices
   - Verify sync works

### Phase 3: Live Testing
- Real calls with test customers
- Verify billing accuracy
- Test subscription limits
- Confirm invoice generation

## Smart Features to Implement

1. **Caller Dashboard Pop-up**
   - When call comes in, show:
     - Customer name
     - Subscription status
     - Hours remaining
     - Recent call history
     - Outstanding invoices

2. **Auto-Billing Logic**
   ```javascript
   if (customer.hasSubscription) {
     if (customer.hoursRemaining > 0) {
       deductHours(callDuration);
     } else {
       createOverageInvoice(callDuration);
     }
   } else {
     createPayPerCallInvoice(callDuration);
   }
   ```

3. **Real-time Notifications**
   - "Subscriber calling - 2.5 hours remaining"
   - "Non-subscriber calling - will be billed"
   - "Subscription expired - switching to per-call"

## Next Steps

1. **This Week**: 
   - Build Communications page with live call display
   - Build Billing/Subscriptions page
   - Set up OpenPhone webhooks

2. **Next Week**:
   - Connect real OpenPhone API
   - Connect QuickBooks API
   - Test with real phone calls

3. **Week 3**:
   - Gmail integration
   - Automated invoicing
   - Go live with select clients

## Questions to Answer

1. What are the subscription tiers? (e.g., 10 hours/month, 20 hours/month)
2. What's the per-minute rate for non-subscribers?
3. Do unused hours roll over?
4. What's the overage rate for subscribers?
5. Should we track after-hours calls differently?