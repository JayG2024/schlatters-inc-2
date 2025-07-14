import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical,
  CreditCard,
  DollarSign,
  CheckCircle,
  X,
  AlertTriangle,
  RefreshCw,
  Eye,
  Settings,
  Shield,
  Zap,
  Clock,
  TrendingUp,
  Users,
  Building,
  Phone,
  Mail,
  Edit,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Progress from '../../../components/ui/Progress';
import { formatCurrency, formatDateTime, formatDate } from '../../../lib/utils';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'ach' | 'wire' | 'check';
  provider: 'stripe' | 'square' | 'paypal' | 'bank';
  name: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  fees: {
    percentage: number;
    fixed: number;
  };
  volume: number;
  transactionCount: number;
  setupDate: string;
  lastUsed: string;
}

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'chargeback' | 'dispute';
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'canceled' | 'refunded';
  paymentMethod: string;
  clientName: string;
  invoiceNumber?: string;
  timestamp: string;
  processingFee: number;
  gatewayReference: string;
  description: string;
}

interface PaymentGateway {
  id: string;
  name: string;
  provider: 'stripe' | 'square' | 'paypal' | 'authorize_net';
  status: 'connected' | 'disconnected' | 'error';
  accountId: string;
  features: string[];
  monthlyVolume: number;
  transactionCount: number;
  fees: {
    cardPresent: number;
    cardNotPresent: number;
    ach: number;
  };
  setupDate: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    provider: 'stripe',
    name: 'Credit/Debit Cards',
    status: 'active',
    fees: { percentage: 2.9, fixed: 0.30 },
    volume: 45280.50,
    transactionCount: 147,
    setupDate: '2025-01-15',
    lastUsed: '2025-05-10T14:30:00'
  },
  {
    id: '2',
    type: 'ach',
    provider: 'stripe',
    name: 'ACH Bank Transfer',
    status: 'active',
    fees: { percentage: 0.8, fixed: 5.00 },
    volume: 18750.00,
    transactionCount: 23,
    setupDate: '2025-02-01',
    lastUsed: '2025-05-08T11:20:00'
  },
  {
    id: '3',
    type: 'bank',
    provider: 'bank',
    name: 'Wire Transfer',
    status: 'active',
    fees: { percentage: 0, fixed: 25.00 },
    volume: 67500.00,
    transactionCount: 8,
    setupDate: '2025-01-01',
    lastUsed: '2025-05-05T16:45:00'
  },
  {
    id: '4',
    type: 'card',
    provider: 'paypal',
    name: 'PayPal',
    status: 'inactive',
    fees: { percentage: 3.49, fixed: 0.49 },
    volume: 0,
    transactionCount: 0,
    setupDate: '2025-03-15',
    lastUsed: '2025-03-20T09:30:00'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'payment',
    amount: 1500.00,
    currency: 'USD',
    status: 'succeeded',
    paymentMethod: 'Credit Card •••• 4242',
    clientName: 'Acme Corp',
    invoiceNumber: 'INV-2025-001',
    timestamp: '2025-05-10T14:30:00',
    processingFee: 43.80,
    gatewayReference: 'pi_1AbCdEfGhIjKlM',
    description: 'Invoice payment'
  },
  {
    id: '2',
    type: 'payment',
    amount: 3200.00,
    currency: 'USD',
    status: 'succeeded',
    paymentMethod: 'ACH Transfer',
    clientName: 'TechSolutions Inc',
    invoiceNumber: 'INV-2025-002',
    timestamp: '2025-05-09T11:20:00',
    processingFee: 30.60,
    gatewayReference: 'ach_1NoPqRsTuVwXyZ',
    description: 'Monthly subscription payment'
  },
  {
    id: '3',
    type: 'refund',
    amount: -850.00,
    currency: 'USD',
    status: 'succeeded',
    paymentMethod: 'Credit Card •••• 9876',
    clientName: 'Global Ventures',
    timestamp: '2025-05-08T16:45:00',
    processingFee: -24.65,
    gatewayReference: 're_1AbCdEfGhIjKlM',
    description: 'Service refund'
  },
  {
    id: '4',
    type: 'payment',
    amount: 2750.00,
    currency: 'USD',
    status: 'pending',
    paymentMethod: 'Wire Transfer',
    clientName: 'Innovate LLC',
    invoiceNumber: 'INV-2025-003',
    timestamp: '2025-05-07T09:30:00',
    processingFee: 25.00,
    gatewayReference: 'wire_1234567890',
    description: 'Large project payment'
  },
  {
    id: '5',
    type: 'payment',
    amount: 650.00,
    currency: 'USD',
    status: 'failed',
    paymentMethod: 'Credit Card •••• 5555',
    clientName: 'Premier Services',
    timestamp: '2025-05-06T13:15:00',
    processingFee: 0,
    gatewayReference: 'pi_1FailedPayment',
    description: 'Payment failed - insufficient funds'
  }
];

const mockGateways: PaymentGateway[] = [
  {
    id: '1',
    name: 'Stripe',
    provider: 'stripe',
    status: 'connected',
    accountId: 'acct_1ABC***DEF',
    features: ['Credit Cards', 'ACH', 'International', 'Subscriptions', 'Refunds'],
    monthlyVolume: 89450.75,
    transactionCount: 156,
    fees: { cardPresent: 2.7, cardNotPresent: 2.9, ach: 0.8 },
    setupDate: '2025-01-15'
  },
  {
    id: '2',
    name: 'PayPal',
    provider: 'paypal',
    status: 'disconnected',
    accountId: 'sb-xyz***@business.example.com',
    features: ['PayPal', 'Credit Cards', 'International'],
    monthlyVolume: 0,
    transactionCount: 0,
    fees: { cardPresent: 2.9, cardNotPresent: 3.49, ach: 1.0 },
    setupDate: '2025-03-15'
  },
  {
    id: '3',
    name: 'Square',
    provider: 'square',
    status: 'error',
    accountId: 'sq0idp-***',
    features: ['Credit Cards', 'In-Person', 'Online'],
    monthlyVolume: 0,
    transactionCount: 0,
    fees: { cardPresent: 2.6, cardNotPresent: 2.9, ach: 1.0 },
    setupDate: '2025-04-01'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'succeeded':
    case 'active':
    case 'connected':
      return <Badge variant="success">Active</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'failed':
    case 'inactive':
    case 'disconnected':
      return <Badge variant="default">Inactive</Badge>;
    case 'canceled':
    case 'suspended':
    case 'error':
      return <Badge variant="danger">Error</Badge>;
    case 'refunded':
      return <Badge variant="info">Refunded</Badge>;
  }
};

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'payment':
      return <DollarSign size={16} className="text-green-600" />;
    case 'refund':
      return <RefreshCw size={16} className="text-blue-600" />;
    case 'chargeback':
      return <AlertTriangle size={16} className="text-red-600" />;
    case 'dispute':
      return <Shield size={16} className="text-amber-600" />;
  }
};

const getPaymentMethodIcon = (type: string) => {
  switch (type) {
    case 'card':
      return <CreditCard size={20} className="text-blue-600" />;
    case 'ach':
    case 'bank':
      return <Building size={20} className="text-green-600" />;
    case 'wire':
      return <Zap size={20} className="text-purple-600" />;
    case 'check':
      return <DollarSign size={20} className="text-amber-600" />;
  }
};

const PaymentProcessingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'methods' | 'gateways'>('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  
  // Calculate payment metrics
  const totalVolume = mockTransactions
    .filter(tx => tx.status === 'succeeded' && tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalFees = mockTransactions
    .filter(tx => tx.status === 'succeeded')
    .reduce((sum, tx) => sum + tx.processingFee, 0);
    
  const successRate = (mockTransactions.filter(tx => tx.status === 'succeeded').length / mockTransactions.length) * 100;
  const avgTransactionValue = totalVolume / mockTransactions.filter(tx => tx.amount > 0).length;

  // Filter functions
  const filterTransactions = () => {
    let filtered = mockTransactions;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        tx => 
          tx.clientName.toLowerCase().includes(search) ||
          tx.gatewayReference.toLowerCase().includes(search) ||
          (tx.invoiceNumber && tx.invoiceNumber.toLowerCase().includes(search))
      );
    }
    
    return filtered;
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseTransaction = () => {
    setSelectedTransaction(null);
  };

  const handleViewGateway = (gateway: PaymentGateway) => {
    setSelectedGateway(gateway);
  };

  const handleCloseGateway = () => {
    setSelectedGateway(null);
  };

  const handleConnectGateway = (gatewayId: string) => {
    console.log(`Connecting gateway ${gatewayId}`);
    // In a real app, this would initiate connection flow
  };

  const handleRefundTransaction = (transactionId: string) => {
    console.log(`Refunding transaction ${transactionId}`);
    // In a real app, this would process refund
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Processing</h1>
          <p className="text-gray-600 mt-1">Manage payment methods, gateways, and transactions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <Button leftIcon={<Download size={16} />} variant="outline">
            Export
          </Button>
          
          <Button leftIcon={<Settings size={16} />}>
            Settings
          </Button>
        </div>
      </div>
      
      {/* Payment Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Volume</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{formatCurrency(totalVolume)}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-md">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp size={14} className="text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+18.2%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Processing Fees</p>
                <p className="text-2xl font-bold mt-1 text-amber-600">{formatCurrency(Math.abs(totalFees))}</p>
              </div>
              <div className="p-2 bg-amber-50 rounded-md">
                <CreditCard size={20} className="text-amber-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-amber-600 font-medium">2.1%</span>
              <span className="text-gray-500 ml-1">of total volume</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">{successRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-md">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp size={14} className="text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+2.1%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Transaction</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">{formatCurrency(avgTransactionValue)}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-md">
                <Users size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp size={14} className="text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+5.7%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'transactions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'methods'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('methods')}
          >
            Payment Methods
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'gateways'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('gateways')}
          >
            Payment Gateways
          </button>
        </div>
      </div>
      
      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>
                {selectedTransaction.gatewayReference} • {formatDateTime(selectedTransaction.timestamp)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(selectedTransaction.status)}
              <Button 
                variant="ghost" 
                size="sm"
                leftIcon={<X size={16} />}
                onClick={handleCloseTransaction}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Transaction Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatCurrency(Math.abs(selectedTransaction.amount))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="capitalize font-medium">{selectedTransaction.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span>{getStatusBadge(selectedTransaction.status)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium">{selectedTransaction.clientName}</span>
                  </div>
                  {selectedTransaction.invoiceNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Invoice:</span>
                      <span className="font-medium">{selectedTransaction.invoiceNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method:</span>
                    <span>{selectedTransaction.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Fee:</span>
                    <span className="font-medium">{formatCurrency(Math.abs(selectedTransaction.processingFee))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gateway Reference:</span>
                    <span className="font-mono text-xs">{selectedTransaction.gatewayReference}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Description</h3>
                <p className="text-gray-900 mb-4">{selectedTransaction.description}</p>
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">Currency: {selectedTransaction.currency}</div>
                  <div className="text-xs text-gray-500">
                    Processed: {formatDateTime(selectedTransaction.timestamp)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button 
                variant="outline" 
                leftIcon={<Copy size={16} />}
                onClick={() => navigator.clipboard.writeText(selectedTransaction.gatewayReference)}
              >
                Copy Reference
              </Button>
              {selectedTransaction.status === 'succeeded' && selectedTransaction.type === 'payment' && (
                <Button 
                  variant="outline" 
                  leftIcon={<RefreshCw size={16} />}
                  onClick={() => handleRefundTransaction(selectedTransaction.id)}
                >
                  Refund
                </Button>
              )}
              <Button leftIcon={<ExternalLink size={16} />}>
                View in Gateway
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Gateway Detail Modal */}
      {selectedGateway && (
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{selectedGateway.name} Gateway</CardTitle>
              <CardDescription>
                {selectedGateway.accountId} • Setup on {formatDate(new Date(selectedGateway.setupDate))}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(selectedGateway.status)}
              <Button 
                variant="ghost" 
                size="sm"
                leftIcon={<X size={16} />}
                onClick={handleCloseGateway}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Gateway Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium capitalize">{selectedGateway.provider.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Account ID:</span>
                    <span className="font-mono text-xs">{selectedGateway.accountId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Volume:</span>
                    <span className="font-medium">{formatCurrency(selectedGateway.monthlyVolume)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transactions:</span>
                    <span className="font-medium">{selectedGateway.transactionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Setup Date:</span>
                    <span>{formatDate(new Date(selectedGateway.setupDate))}</span>
                  </div>
                </div>
                
                <h4 className="text-sm font-medium text-gray-500 mt-6 mb-3">Processing Fees</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Card Present:</span>
                    <span>{selectedGateway.fees.cardPresent}% + $0.30</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Card Not Present:</span>
                    <span>{selectedGateway.fees.cardNotPresent}% + $0.30</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ACH:</span>
                    <span>{selectedGateway.fees.ach}% + $5.00</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Supported Features</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGateway.features.map((feature, index) => (
                    <Badge key={index} variant="info">{feature}</Badge>
                  ))}
                </div>
                
                {selectedGateway.status === 'error' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <h4 className="text-sm font-medium text-red-800">Connection Error</h4>
                    <p className="text-sm text-red-600 mt-1">
                      Unable to connect to {selectedGateway.name}. Please check your credentials and try reconnecting.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="outline" leftIcon={<Settings size={16} />}>
                Configure
              </Button>
              {selectedGateway.status === 'disconnected' ? (
                <Button 
                  leftIcon={<Zap size={16} />}
                  onClick={() => handleConnectGateway(selectedGateway.id)}
                >
                  Connect
                </Button>
              ) : (
                <Button variant="outline" leftIcon={<RefreshCw size={16} />}>
                  Refresh
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Transactions Tab */}
      {activeTab === 'transactions' && !selectedTransaction && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="succeeded">Succeeded</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            
            <Button leftIcon={<Filter size={16} />} variant="outline">
              More Filters
            </Button>
          </div>
          
          <Card className="bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Client</th>
                    <th className="px-6 py-3 text-left">Description</th>
                    <th className="px-6 py-3 text-left">Payment Method</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filterTransactions().map(transaction => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(transaction.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.clientName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          <span>
                            {transaction.description}
                            {transaction.invoiceNumber && (
                              <span className="text-blue-600 ml-1">
                                {transaction.invoiceNumber}
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <span className={transaction.type === 'refund' ? 'text-red-600' : 'text-gray-900'}>
                          {transaction.type === 'refund' ? '-' : ''}{formatCurrency(Math.abs(transaction.amount))}
                        </span>
                        <div className="text-xs text-gray-500">
                          Fee: {formatCurrency(Math.abs(transaction.processingFee))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button 
                            className="text-blue-600 hover:text-blue-900" 
                            title="View Details"
                            onClick={() => handleViewTransaction(transaction)}
                          >
                            <Eye size={16} />
                          </button>
                          {transaction.status === 'succeeded' && transaction.type === 'payment' && (
                            <button 
                              className="text-amber-600 hover:text-amber-900" 
                              title="Refund"
                              onClick={() => handleRefundTransaction(transaction.id)}
                            >
                              <RefreshCw size={16} />
                            </button>
                          )}
                          <button className="text-gray-400 hover:text-gray-700" title="More Options">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filterTransactions().length === 0 && (
              <div className="text-center py-10">
                <CreditCard size={48} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? "No transactions match your current filters"
                    : "No transactions have been processed yet."}
                </p>
                <Button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
      
      {/* Payment Methods Tab */}
      {activeTab === 'methods' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
              <p className="text-gray-600">Configure how you accept payments from clients</p>
            </div>
            <Button leftIcon={<Plus size={16} />}>
              Add Payment Method
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPaymentMethods.map((method) => (
              <Card key={method.id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-md">
                        {getPaymentMethodIcon(method.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{method.provider}</p>
                      </div>
                    </div>
                    {getStatusBadge(method.status)}
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-medium">
                        {method.fees.percentage}% + ${method.fees.fixed.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monthly Volume:</span>
                      <span className="font-medium">{formatCurrency(method.volume)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transactions:</span>
                      <span className="font-medium">{method.transactionCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Used:</span>
                      <span>{formatDate(new Date(method.lastUsed))}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button size="sm" variant="outline" leftIcon={<Settings size={14} />}>
                      Configure
                    </Button>
                    {method.status === 'active' ? (
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        Disable
                      </Button>
                    ) : (
                      <Button size="sm">
                        Enable
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Payment Gateways Tab */}
      {activeTab === 'gateways' && !selectedGateway && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Payment Gateways</h2>
              <p className="text-gray-600">Manage your payment processing integrations</p>
            </div>
            <Button leftIcon={<Plus size={16} />}>
              Add Gateway
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockGateways.map((gateway) => (
              <Card key={gateway.id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{gateway.name}</h3>
                      <p className="text-sm text-gray-500">{gateway.accountId}</p>
                    </div>
                    {getStatusBadge(gateway.status)}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex flex-wrap gap-2">
                      {gateway.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="info">{feature}</Badge>
                      ))}
                      {gateway.features.length > 3 && (
                        <Badge variant="default">+{gateway.features.length - 3} more</Badge>
                      )}
                    </div>
                    
                    {gateway.status === 'connected' && (
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Monthly Volume:</span>
                          <span className="font-medium">{formatCurrency(gateway.monthlyVolume)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Transactions:</span>
                          <span className="font-medium">{gateway.transactionCount}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      leftIcon={<Eye size={14} />}
                      onClick={() => handleViewGateway(gateway)}
                    >
                      Details
                    </Button>
                    {gateway.status === 'connected' ? (
                      <Button size="sm" variant="outline" leftIcon={<Settings size={14} />}>
                        Configure
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        leftIcon={<Zap size={14} />}
                        onClick={() => handleConnectGateway(gateway.id)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Security Information */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} className="text-blue-600" />
                Payment Security
              </CardTitle>
              <CardDescription>
                Information about your payment processing security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">PCI Compliance</h3>
                  <p className="text-sm text-green-700 mb-3">
                    Your payment processing is PCI DSS compliant, ensuring secure handling of card data.
                  </p>
                  <Badge variant="success">Compliant</Badge>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Fraud Protection</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Advanced fraud detection is enabled to protect your business from fraudulent transactions.
                  </p>
                  <Badge variant="primary">Active</Badge>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">Data Encryption</h3>
                  <p className="text-sm text-purple-700 mb-3">
                    All payment data is encrypted using industry-standard TLS 1.2+ protocols.
                  </p>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessingPage;