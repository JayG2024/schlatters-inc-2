# Schlatters Inc - Phone Support Billing Platform

A specialized CRM and billing system for phone-based technical support services.

## 🚀 Quick Start

1. **Add Environment Variables**: Copy `.env.example` to `.env.local` and fill in all required values.
2. **Run Database Migration**: Copy `supabase/migrations/001_initial_schema.sql` to Supabase SQL Editor
3. **Deploy**: `vercel --prod` or push to GitHub
4. **Configure Webhooks**: See SETUP_GUIDE.md for details

## 🛠️ Features

- **Live Call Tracking**: Real-time phone support queue with automatic caller identification
- **Subscription Management**: Track annual subscriptions with included hours
- **Pay-Per-Call Billing**: Automatic $3/minute billing for non-subscribers
- **Full CRM**: Track all client interactions and purchases
- **SMS & Email**: Send messages directly from client profiles
- **Process Documentation**: Built-in knowledge base for support procedures
- **QuickBooks Integration**: Sync customer data and invoices
- **OpenPhone Integration**: Automatic call tracking and SMS

## 🧰 Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **Integrations**: OpenPhone API, QuickBooks API
- **Deployment**: Vercel

## 📱 Key Pages

- **/admin**: Command center dashboard
- **/admin/communications**: Live call queue and support operations
- **/admin/clients**: Full CRM with communication history
- **/admin/billing**: Subscription and billing management
- **/admin/documents**: Process documentation system

## 🧑‍💻 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 📚 Documentation

- **SETUP_GUIDE.md**: Step-by-step production setup
- **PRODUCTION_CHECKLIST.md**: Pre-launch checklist
- **.env.example**: Required environment variables (copy to .env.local)

## 🔗 Webhook URLs

- OpenPhone: `https://schlatters-inc.vercel.app/api/webhooks/openphone`
- QuickBooks: `https://schlatters-inc.vercel.app/api/webhooks/quickbooks`

---

**Note:** All mock data should be removed from the codebase. Ensure all integrations (Supabase, OpenPhone, QuickBooks, Google) are fully wired up before production.