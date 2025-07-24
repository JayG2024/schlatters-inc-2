import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Progress from '../../components/ui/Progress';
import { 
  FileText,
  DollarSign,
  Clock,
  AlertTriangle,
  CreditCard,
  Calendar,
  Download,
  RefreshCw,
  Send,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter
} from 'lucide-react';
import { formatCurrency, formatDate, formatRelativeTime } from '../../lib/utils';
import { useQuickBooksData, useOverdueInvoices } from '../../hooks/useQuickBooksData';
import { toast } from 'sonner';

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  company: string;
  email: string;
  phone: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  balance: number;
  status: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'voided';
  daysOverdue: number;
  agingBucket: '0-30' | '31-60' | '61-90' | '90+';
  paymentMethod?: string;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  remindersSent: number;
  lastReminderDate?: string;
  creditCard?: {
    last4: string;
    expiry: string;
    expired: boolean;
  };
  lineItems: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  notes?: string;
}

const InvoicesAging: React.FC = () => {
  const { stats: qbStats, loading: qbLoading, syncData: syncQB } = useQuickBooksData();
  const { overdueInvoices, loading: overdueLoading } = useOverdueInvoices();
  const [invoices, setInvoices] = useState<InvoiceDetail[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'overdue' | 'paid' | 'pending'>('all');
  const [agingFilter, setAgingFilter] = useState<'all' | '0-30' | '31-60' | '61-90' | '90+'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [overdueInvoices]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      
      // Transform overdue invoices and add mock data
      const mockInvoices: InvoiceDetail[] = overdueInvoices.map((inv: any) => {
        const daysOverdue = Math.floor((new Date().getTime() - new Date(inv.due_date).getTime()) / (1000 * 60 * 60 * 24));
        const agingBucket = daysOverdue <= 30 ? '0-30' : 
                           daysOverdue <= 60 ? '31-60' : 
                           daysOverdue <= 90 ? '61-90' : '90+';
        
        return {
          id: inv.id,
          invoiceNumber: inv.invoice_number,
          clientId: inv.client_id,
          clientName: inv.client?.name || 'Unknown',
          company: inv.client?.company || '',
          email: inv.client?.email || '',
          phone: inv.client?.phone || '',
          issueDate: inv.created_at,
          dueDate: inv.due_date,
          amount: inv.total_amount || 0,
          balance: inv.balance || 0,
          status: daysOverdue > 0 ? 'overdue' : 'sent',
          daysOverdue: Math.max(0, daysOverdue),
          agingBucket,
          remindersSent: Math.floor(Math.random() * 3),
          lastReminderDate: daysOverdue > 7 ? new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          creditCard: {
            last4: '4242',
            expiry: '12/25',
            expired: Math.random() > 0.8
          },
          lineItems: [
            {
              description: 'Support Services',
              quantity: 1,
              rate: inv.balance || 0,
              amount: inv.balance || 0
            }
          ]
        };
      });

      // Add some paid invoices for demonstration
      const paidInvoices: InvoiceDetail[] = Array.from({ length: 5 }, (_, i) => ({
        id: `paid-${i}`,
        invoiceNumber: `INV-2024-${1000 + i}`,
        clientId: `client-${i}`,
        clientName: `Client ${i + 1}`,
        company: `Company ${i + 1}`,
        email: `client${i + 1}@example.com`,
        phone: '(555) 123-4567',
        issueDate: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
        amount: Math.random() * 1000 + 500,
        balance: 0,
        status: 'paid',
        daysOverdue: 0,
        agingBucket: '0-30',
        paymentMethod: 'credit_card',
        lastPaymentDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        lastPaymentAmount: Math.random() * 1000 + 500,
        remindersSent: 0,
        creditCard: {
          last4: '4242',
          expiry: '12/25',
          expired: false
        },
        lineItems: []
      }));

      setInvoices([...mockInvoices, ...paidInvoices]);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
    const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.balance, 0);
    const avgDaysOverdue = overdueInvoices.length > 0
      ? overdueInvoices.reduce((sum, inv) => sum + inv.daysOverdue, 0) / overdueInvoices.length
      : 0;
    
    const agingBreakdown = {
      '0-30': invoices.filter(inv => inv.agingBucket === '0-30' && inv.status === 'overdue'),
      '31-60': invoices.filter(inv => inv.agingBucket === '31-60'),
      '61-90': invoices.filter(inv => inv.agingBucket === '61-90'),
      '90+': invoices.filter(inv => inv.agingBucket === '90+')
    };

    const expiredCards = invoices.filter(inv => inv.creditCard?.expired).length;
    const totalExpiredCardsValue = invoices
      .filter(inv => inv.creditCard?.expired)
      .reduce((sum, inv) => sum + inv.balance, 0);

    return {
      totalInvoices: invoices.length,
      totalOverdue: overdueInvoices.length,
      totalOverdueValue: totalOverdue,
      avgDaysOverdue,
      maxDaysOverdue: Math.max(...overdueInvoices.map(inv => inv.daysOverdue), 0),
      agingBreakdown,
      expiredCards,
      totalExpiredCardsValue,
      collectionRate: 85, // Mock
      paymentRecoveryRate: 78 // Mock
    };
  };

  const stats = calculateStats();

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = searchTerm === '' ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'overdue' && inv.status === 'overdue') ||
      (statusFilter === 'paid' && inv.status === 'paid') ||
      (statusFilter === 'pending' && ['sent', 'viewed', 'partial'].includes(inv.status));
    
    const matchesAging = agingFilter === 'all' || inv.agingBucket === agingFilter;
    
    return matchesSearch && matchesStatus && matchesAging;
  });

  const handleSendReminder = (invoiceId: string) => {
    toast.success('Reminder sent successfully');
  };

  const handleBulkReminders = () => {
    if (selectedInvoices.length === 0) {
      toast.error('Please select invoices to send reminders');
      return;
    }
    toast.success(`Sent reminders for ${selectedInvoices.length} invoices`);
    setSelectedInvoices([]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Invoices & Aging
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage invoices, track payments, and monitor aging
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            leftIcon={<Download size={16} />}
          >
            Export Aging Report
          </Button>
          <Button 
            variant="outline"
            leftIcon={<RefreshCw size={16} />}
            onClick={syncQB}
          >
            Sync QuickBooks
          </Button>
          <Button 
            leftIcon={<Send size={16} />}
            onClick={handleBulkReminders}
            disabled={selectedInvoices.length === 0}
          >
            Send Bulk Reminders
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unpaid Invoices</p>
                <p className="text-2xl font-bold">{stats.totalOverdue}</p>
                <p className="text-xs text-gray-500">Count</p>
              </div>
              <FileText size={24} className="text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unpaid Value</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(stats.totalOverdueValue)}</p>
                <p className="text-xs text-gray-500">Total outstanding</p>
              </div>
              <DollarSign size={24} className="text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Overdue</p>
                <p className="text-2xl font-bold">{Math.round(stats.avgDaysOverdue)}</p>
                <p className="text-xs text-gray-500">Days</p>
              </div>
              <Clock size={24} className="text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expired Cards</p>
                <p className="text-2xl font-bold">{stats.expiredCards}</p>
                <p className="text-xs text-gray-500">{formatCurrency(stats.totalExpiredCardsValue)} at risk</p>
              </div>
              <CreditCard size={24} className="text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Recovery Rate</p>
                <p className="text-2xl font-bold">{stats.paymentRecoveryRate}%</p>
                <p className="text-xs text-gray-500">Of unpaid invoices</p>
              </div>
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aging Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Aging Analysis</CardTitle>
          <CardDescription>Invoice aging distribution by days overdue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(stats.agingBreakdown).map(([bucket, invoices]) => (
              <div key={bucket} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{bucket} days</p>
                <p className="text-2xl font-bold mb-1">{invoices.length}</p>
                <p className="text-sm text-gray-600">{formatCurrency(invoices.reduce((sum, inv) => sum + inv.balance, 0))}</p>
                <Progress 
                  value={(invoices.length / stats.totalOverdue) * 100} 
                  className="mt-2 h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="overdue">Overdue</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
            
            <select
              value={agingFilter}
              onChange={(e) => setAgingFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Aging</option>
              <option value="0-30">0-30 days</option>
              <option value="31-60">31-60 days</option>
              <option value="61-90">61-90 days</option>
              <option value="90+">90+ days</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedInvoices(filteredInvoices.filter(inv => inv.status === 'overdue').map(inv => inv.id));
                      } else {
                        setSelectedInvoices([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left">Invoice</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Due Date</th>
                <th className="px-6 py-3 text-left">Payment Info</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(invoice.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedInvoices([...selectedInvoices, invoice.id]);
                        } else {
                          setSelectedInvoices(selectedInvoices.filter(id => id !== invoice.id));
                        }
                      }}
                      className="rounded"
                      disabled={invoice.status === 'paid'}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-gray-500">Issued {formatDate(new Date(invoice.issueDate))}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.clientName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.company}</p>
                      <p className="text-xs text-gray-500">{invoice.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(invoice.amount)}</p>
                      {invoice.balance > 0 && invoice.balance < invoice.amount && (
                        <p className="text-sm text-orange-600">Balance: {formatCurrency(invoice.balance)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm">{formatDate(new Date(invoice.dueDate))}</p>
                      {invoice.daysOverdue > 0 && (
                        <p className="text-xs text-red-600 font-medium">{invoice.daysOverdue} days overdue</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      {invoice.creditCard && (
                        <div className="flex items-center gap-1">
                          <CreditCard size={14} />
                          <span className="text-sm">•••• {invoice.creditCard.last4}</span>
                          {invoice.creditCard.expired && (
                            <Badge variant="danger" size="xs">Expired</Badge>
                          )}
                        </div>
                      )}
                      {invoice.remindersSent > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {invoice.remindersSent} reminders sent
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={
                      invoice.status === 'paid' ? 'success' :
                      invoice.status === 'overdue' ? 'danger' :
                      invoice.status === 'partial' ? 'warning' :
                      'secondary'
                    }>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Button size="xs" variant="ghost" title="View Invoice">
                        <FileText size={14} />
                      </Button>
                      {invoice.status === 'overdue' && (
                        <Button 
                          size="xs" 
                          variant="outline"
                          onClick={() => handleSendReminder(invoice.id)}
                        >
                          Send Reminder
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default InvoicesAging;