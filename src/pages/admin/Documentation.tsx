import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { exportToPDF } from '../../utils/pdfExport';

interface MarkdownDoc {
  name: string;
  filename: string;
  content: string;
}

const Documentation: React.FC = () => {
  const [documents] = useState<MarkdownDoc[]>([
    {
      name: 'Project Overview',
      filename: 'project-overview.md',
      content: `# Schlatter's Inc. Service Management Dashboard

## Project Overview

The Schlatter's Inc. Service Management Dashboard is a comprehensive platform designed to streamline client management, communication, billing, and service delivery. This centralized system integrates various business functions into a cohesive interface, allowing both administrators and clients to efficiently manage their relationship and service needs.

## Core Features

### Client Management
- Complete client database with detailed profiles
- Client onboarding workflow
- Service subscription management
- Document sharing and management

### Communications Center
- Integrated call tracking and management
- Call recording and transcription
- Sentiment analysis for customer interactions
- Messaging platform for client communications

### Financial Management
- Invoice generation and management
- Payment processing
- QuickBooks integration for accounting synchronization
- Subscription and recurring billing management

### Time Tracking
- Call timer with billable hours tracking
- Detailed time logs and reporting
- Billable hours analysis and client reporting
- Team utilization metrics

### Reporting & Analytics
- Financial performance metrics
- Call and communication analytics
- Team performance tracking
- Client engagement reporting`
    },
    {
      name: 'System Architecture',
      filename: 'system-architecture.md',
      content: `# Schlatter's Inc. Service Management Dashboard
## System Architecture & Technical Specification

### System Overview

The Schlatter's Inc. Service Management Dashboard is a comprehensive web application built using modern web technologies. The system follows a client-server architecture with a React-based frontend and a secure backend infrastructure that integrates with multiple third-party services.

### Technology Stack

#### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Data Visualization**: Chart.js with React-ChartJS-2
- **Date Handling**: date-fns

#### Backend Services
- **Authentication**: JWT-based authentication system
- **Database**: PostgreSQL with Supabase
- **Storage**: Supabase Storage for document management
- **API**: RESTful API endpoints with Edge Functions
- **Serverless Functions**: For integration with third-party services`
    },
    {
      name: 'Integration Requirements',
      filename: 'integration-requirements.md',
      content: `# Integration Requirements Specification

## QuickBooks Integration Requirements

### Account Information Required
- QuickBooks Online company ID
- Administrator credentials or dedicated integration user
- API application keys (client ID and client secret)
- Webhook endpoint verification token

### Data Access Permissions
- Customers and vendors
- Invoices and bills
- Chart of accounts
- Payment methods
- Financial reports
- Transactions

### Configuration Details
- Sync frequency preferences (real-time, hourly, daily)
- Default accounts for various transaction types
- Tax configuration
- Currency settings
- Fiscal year information`
    }
  ]);

  const [selectedDoc, setSelectedDoc] = useState<MarkdownDoc | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const handleRenderMarkdown = (e: CustomEvent) => {
      const { markdown, elementId } = e.detail;
      const element = document.getElementById(elementId);
      if (element && selectedDoc) {
        // Component will be rendered in the view
      }
    };

    window.addEventListener('renderMarkdownForPDF' as any, handleRenderMarkdown);
    return () => {
      window.removeEventListener('renderMarkdownForPDF' as any, handleRenderMarkdown);
    };
  }, [selectedDoc]);

  const handleExportPDF = async (doc: MarkdownDoc) => {
    setIsExporting(true);
    setSelectedDoc(doc);
    
    setTimeout(async () => {
      await exportToPDF('markdown-content', `${doc.filename.replace('.md', '')}.pdf`);
      setIsExporting(false);
    }, 500);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
        <p className="text-gray-600">View and export system documentation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Documents</h2>
            </div>
            <div className="p-4">
              {documents.map((doc) => (
                <div
                  key={doc.filename}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    selectedDoc?.filename === doc.filename
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-gray-200'
                  }`}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.filename}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportPDF(doc);
                      }}
                      disabled={isExporting}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Export to PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedDoc ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-gray-400 mr-2" />
                  <h2 className="font-semibold text-gray-900">{selectedDoc.name}</h2>
                </div>
                <button
                  onClick={() => handleExportPDF(selectedDoc)}
                  disabled={isExporting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </button>
              </div>
              <div 
                id="markdown-content" 
                className="p-6 prose prose-sm max-w-none"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedDoc.content}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a document to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documentation;