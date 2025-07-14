import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
  DollarSign,
  Clock,
  Loader
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
}

// Data will be fetched from Supabase

// Payment methods - data will be fetched from Supabase
const paymentMethods: any[] = [];

const getStatusBadge = (status: Invoice['status']) => {
  switch (status) {
    case 'paid':
      return <Badge variant="success">Paid</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'overdue':
      return <Badge variant="danger">Overdue</Badge>;
  }
};

const InvoicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid'>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter function for invoices
  const filterInvoices = () => {
    let filtered = []; // No mock data, so this will be empty
    
    // Filter by tab
    if (activeTab === 'pending') {
      filtered = filtered.filter(inv => inv.status === 'pending' || inv.status === 'overdue');
    } else if (activeTab === 'paid') {
      filtered = filtered.filter(inv => inv.status === 'paid');
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        inv => 
          inv.number.toLowerCase().includes(search) ||
          inv.description.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  };

  const handlePayInvoice = (invoiceId: string) => {
    // In a real app, this would trigger a payment flow
  };
  
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };
  
  const handleCloseInvoiceDetail = () => {
    setSelectedInvoice(null);
  };

  const filteredInvoices = filterInvoices();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader size={40} className="animate-spin text-navy-600 mb-4" />
          <p className="text-navy-600 font-medium">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices & Payments</h1>
          <p className="text-gray-600 mt-1">View and manage your billing information</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search invoices..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <Button leftIcon={<Filter size={16} />} variant="outline">
            Filter
          </Button>
          
          <Button leftIcon={<Download size={16} />} variant="outline">
            Export
          </Button>
        </div>
      </div>
      
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Balance</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(1500)}</p>
              </div>
              <Badge variant="warning">Due Soon</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">Due on May 15, 2025</p>
            <Button className="w-full mt-4" leftIcon={<CreditCard size={16} />}>
              Pay Now
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Payment Method</p>
            <div className="mt-3 space-y-3">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    method.isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-6 flex items-center justify-center mr-3 bg-white rounded border border-gray-200">
                      {method.brand === 'Visa' ? (
                        <span className="text-blue-600 font-bold text-sm">VISA</span>
                      ) : (
                        <span className="text-red-600 font-bold text-sm">MC</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires {method.expiry}
                      </p>
                    </div>
                  </div>
                  {method.isDefault && (
                    <Badge variant="info" className="text-xs">Default</Badge>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2">
                Manage Payment Methods
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Billing Period</p>
            <p className="text-base font-medium mt-2">May 1 - 31, 2025</p>
            <p className="text-xs text-gray-500 mt-2">Next invoice: Jun 1, 2025</p>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={16} className="mr-2 text-gray-400" />
                <span>Monthly billing cycle</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <Clock size={16} className="mr-2 text-gray-400" />
                <span>Invoices generated on the 1st</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Invoices
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'pending'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'paid'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('paid')}
          >
            Paid
          </button>
        </div>
      </div>
      
      {selectedInvoice ? (
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Invoice #{selectedInvoice.number}</CardTitle>
              <CardDescription>
                Issued on {formatDate(new Date(selectedInvoice.date))}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(selectedInvoice.status)}
              <Button 
                variant="ghost" 
                size="sm"
                leftIcon={<X size={16} />}
                onClick={handleCloseInvoiceDetail}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Bill To</h3>
                <p className="font-medium">Your Company Name</p>
                <p className="text-sm text-gray-600">123 Business Street</p>
                <p className="text-sm text-gray-600">San Francisco, CA 94103</p>
                <p className="text-sm text-gray-600">client@example.com</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Invoice Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Invoice Number:</span>
                    <span className="font-medium">{selectedInvoice.number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Issue Date:</span>
                    <span>{formatDate(new Date(selectedInvoice.date))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Due Date:</span>
                    <span>{formatDate(new Date(selectedInvoice.dueDate))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span>{getStatusBadge(selectedInvoice.status)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Invoice Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Description</th>
                      <th className="px-6 py-3 text-right">Quantity</th>
                      <th className="px-6 py-3 text-right">Unit Price</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        Total:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900 text-right">
                        {formatCurrency(selectedInvoice.amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                leftIcon={<Download size={16} />}
              >
                Download PDF
              </Button>
              {(selectedInvoice.status === 'pending' || selectedInvoice.status === 'overdue') && (
                <Button 
                  leftIcon={<CreditCard size={16} />}
                  onClick={() => handlePayInvoice(selectedInvoice.id)}
                >
                  Pay Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Invoice #</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Due Date</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <button 
                        onClick={() => handleViewInvoice(invoice)}
                        className="hover:underline"
                      >
                        {invoice.number}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(new Date(invoice.date))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(new Date(invoice.dueDate))}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {invoice.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button 
                          className="text-blue-600 hover:text-blue-900" 
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                          <button 
                            className="text-green-600 hover:text-green-900" 
                            title="Pay Now"
                            onClick={() => handlePayInvoice(invoice.id)}
                          >
                            <CreditCard size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredInvoices.length === 0 && (
            <div className="text-center py-10">
              <FileText size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No invoices found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? `No results for "${searchTerm}"`
                  : "You don't have any invoices matching the current filter."}
              </p>
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Clear Filter
              </Button>
            </div>
          )}
        </Card>
      )}
      
      {/* Payment History */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Record of your recent payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md hover:border-gray-300">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="font-medium">Payment for INV-2025-002</p>
                  <p className="text-sm text-gray-500">April 15, 2025</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(1500)}</p>
                <p className="text-sm text-gray-500">Visa •••• 4242</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md hover:border-gray-300">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="font-medium">Payment for INV-2025-003</p>
                  <p className="text-sm text-gray-500">March 14, 2025</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(1500)}</p>
                <p className="text-sm text-gray-500">Visa •••• 4242</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md hover:border-gray-300">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="font-medium">Payment for INV-2025-004</p>
                  <p className="text-sm text-gray-500">February 15, 2025</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(1800)}</p>
                <p className="text-sm text-gray-500">Mastercard •••• 5555</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm" rightIcon={<Download size={16} />}>
              Download Payment History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesPage;