# Production Deployment Checklist for Schlatter's Inc

## 🚨 Critical Security Fixes (Do First!)

### 1. Fix Authentication System
- [ ] Install and configure Supabase Auth
- [ ] Remove hardcoded passwords from AuthContext.tsx
- [ ] Implement proper login/logout flow
- [ ] Add password reset functionality
- [ ] Set up user roles (admin, customer)

### 2. Secure Webhooks
- [ ] Add signature verification for OpenPhone webhooks
- [ ] Move webhook secrets to environment variables
- [ ] Add rate limiting to prevent abuse
- [ ] Log webhook events for auditing

### 3. Fix Environment Variables
```bash
# Update these in .env.production and Vercel:
VITE_OPENPHONE_API_KEY=your_actual_key
VITE_QUICKBOOKS_CLIENT_ID=your_actual_id
VITE_QUICKBOOKS_CLIENT_SECRET=your_actual_secret
VITE_STRIPE_PUBLISHABLE_KEY=your_actual_key
VITE_GOOGLE_CALENDAR_API_KEY=your_actual_key
```

## 🔧 Required Functionality

### 1. OpenPhone Integration
- [ ] Implement webhook endpoint at /api/webhooks/openphone
- [ ] Process incoming calls and messages
- [ ] Update client records with call data
- [ ] Calculate billable minutes

### 2. Database Connections
- [ ] Replace mock data arrays with Supabase queries
- [ ] Implement real-time subscriptions for live updates
- [ ] Add proper error handling
- [ ] Set up database backups

### 3. Payment Processing
- [ ] Integrate Stripe for credit card processing
- [ ] Set up subscription billing
- [ ] Handle failed payments
- [ ] Generate invoices

## 🧹 Code Cleanup

### 1. Remove Development Code
```bash
# Find and remove all console.log statements
grep -r "console.log" src/

# Find and fix all TODO comments
grep -r "TODO" src/
```

### 2. Install Missing Dependencies
```bash
npm install sonner
```

### 3. Fix TypeScript Errors
```bash
npm run typecheck
```

## 🚀 Deployment Steps

### 1. Pre-deployment
- [ ] Run full test suite (once tests are written)
- [ ] Build locally to ensure no errors: `npm run build`
- [ ] Update all environment variables in Vercel
- [ ] Run database migrations in Supabase

### 2. Deploy to Staging
- [ ] Deploy to staging environment first
- [ ] Test all critical flows:
  - [ ] User login/logout
  - [ ] Add new customer
  - [ ] Receive phone call (webhook)
  - [ ] Generate invoice
  - [ ] Process payment

### 3. Production Deployment
- [ ] Enable Vercel Analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Configure custom domain
- [ ] Enable SSL certificate
- [ ] Set up database backups
- [ ] Configure rate limiting

## 📊 Post-Deployment

### 1. Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error alerts
- [ ] Monitor database performance
- [ ] Track API usage

### 2. Documentation
- [ ] Create user documentation
- [ ] Document API endpoints
- [ ] Create runbook for common issues
- [ ] Train support staff

## ⏱️ Estimated Timeline

### Week 1: Critical Security & Auth
- Implement Supabase Auth
- Fix hardcoded credentials
- Secure webhooks

### Week 2: Core Functionality
- OpenPhone integration
- Connect all components to Supabase
- Payment processing

### Week 3: Testing & Polish
- Write critical tests
- Fix all TypeScript errors
- Remove debug code
- Performance optimization

### Week 4: Deployment
- Staging deployment
- User acceptance testing
- Production deployment
- Monitoring setup

## 🎯 MVP Feature Set

For the initial launch, focus on:
1. ✅ Secure authentication
2. ✅ Customer management
3. ✅ Phone call tracking via OpenPhone
4. ✅ Basic billing (manual for now)
5. ✅ Admin dashboard

Defer these for Phase 2:
- QuickBooks integration
- Automated billing
- Advanced reporting
- SMS messaging
- Customer portal features