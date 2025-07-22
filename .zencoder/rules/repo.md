---
description: Repository Information Overview
alwaysApply: true
---

# Schlatters Inc - Phone Support Billing Platform

## Summary
A specialized CRM and billing system for phone-based technical support services. The platform integrates with OpenPhone for call tracking and QuickBooks for financial management, providing features like live call tracking, subscription management, pay-per-call billing, and process documentation.

## Structure
- **src/**: React frontend application with TypeScript
- **api/**: Vercel serverless functions for backend operations
- **supabase/**: Database migrations and schema definitions
- **scripts/**: Utility scripts for data operations
- **docs/**: Additional documentation files

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: TypeScript 5.5.x
**Build System**: Vite 7.0.x
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- React 18.3.x: Frontend UI library
- Supabase: PostgreSQL database and authentication
- React Router: Client-side routing
- Tailwind CSS: Utility-first CSS framework
- Chart.js/React-Chartjs-2: Data visualization
- HTML2Canvas/jsPDF: PDF export functionality

**Development Dependencies**:
- Vite: Build tool and development server
- ESLint 9.9.x: Code linting
- TypeScript 5.5.x: Static type checking
- Tailwind/PostCSS: CSS processing

## Build & Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Test Supabase connection
npm run test:supabase

# Setup Supabase environment
npm run setup:supabase
```

## Known Issues & Fixes
- **Build Error**: Missing exports in mockData.ts
  - Fixed by adding local mock data in BillableHours.tsx instead of importing from mockData.ts
  - Error: "clientHours" is not exported by "src/pages/admin/TimeTracking/mockData.ts"
  - Solution: Add mock data directly in the component file

## Deployment
**Platform**: Vercel
**Configuration**: vercel.json defines serverless function settings and routing
**Deploy Command**:
```bash
vercel --prod
```

## Database
**Type**: PostgreSQL (via Supabase)
**Schema**: Defined in supabase/migrations/*.sql
**Main Tables**: clients, subscriptions, calls, messages, invoices, documents
**Setup**: Run migrations in Supabase SQL Editor

## API Integrations
**OpenPhone**: Call tracking and SMS functionality
- Webhook: /api/webhooks/openphone
- API Routes: /api/openphone/[...openphone]

**QuickBooks**: Financial management and invoicing
- Webhook: /api/webhooks/quickbooks
- API Routes: /api/quickbooks/[...quickbooks]

## Testing
**Test Files**: test-supabase-connection.js
**Run Command**:
```bash
npm run test:supabase
```

## Key Features
- Live call tracking with queue management
- Subscription management with included support hours
- Pay-per-call billing at $3/minute for non-subscribers
- Client CRM with communication history
- SMS and email messaging
- Process documentation system
- QuickBooks and OpenPhone integration