import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield,
  CreditCard,
  DollarSign,
  Clock,
  Phone,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw,
  Timer,
  Users,
  PhoneCall,
  FileText,
  ArrowRight,
  Zap,
  BarChart,
  PhoneIncoming,
  Plus,
  Loader2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Progress from '../../components/ui/Progress';
import { formatCurrency, formatDate, formatRelativeTime } from '../../lib/utils';
import { subscriptionsApi } from '../../lib/supabase';
import { toast } from 'sonner';

// Import sub-pages
import Subscriptions from './Billing/Subscriptions';
import PaymentProcessing from './Billing/PaymentProcessing';
import QuickBooksSync from './Billing/QuickBooksSync';

interface Subscription {
  id: string;
  clientId: string;
  clientName: string;
  company: string;
  phone: string;
  planName: string;
  monthlyRate: number;
  hoursIncluded: number;
  hoursUsed: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired';
  autoRenew: boolean;
  lastPaymentDate: string;
  nextBillingDate: string;
}

interface CallCharge {
  id: string;
  clientId: string;
  clientName: string;
  company: string;
  phone: string;
  callDate: string;
  duration: number; // in seconds
  rate: number; // per minute
  totalCharge: number;
  invoiceStatus: 'pending' | 'invoiced' | 'paid';
  invoiceNumber?: string;
}

// Mock data removed - data now fetched from Supabase
const mockSubscriptions: Subscription[] = [];
const mockCallCharges: CallCharge[] = [];

const BillingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMainPage = location.pathname === '/admin/billing';
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'pay-per-call'>('overview');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [callCharges, setCallCharges] = useState<CallCharge[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await subscriptionsApi.getActive();
      
      // Transform data to match our interface
      const transformedSubscriptions = data?.map((sub: any) => ({
        id: sub.id,
        clientId: sub.client_id,
        clientName: sub.client?.name || 'Unknown',
        company: sub.client?.company || '',
        phone: sub.client?.phone || '',
        planName: sub.plan_name,
        monthlyRate: parseFloat(sub.monthly_rate || 0),
        hoursIncluded: sub.hours_included,
        hoursUsed: parseFloat(sub.hours_used || 0),
        startDate: sub.start_date,
        endDate: sub.end_date,
        status: sub.status,
        autoRenew: sub.auto_renew,
        lastPaymentDate: sub.last_payment_date,
        nextBillingDate: sub.next_billing_date
      })) || [];
      
      setSubscriptions(transformedSubscriptions);
      
      // For now, use mock call charges until we implement the full API
      setCallCharges(mockCallCharges);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate statistics
  const stats = {
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    expiringSubscriptions: subscriptions.filter(s => s.status === 'expiring').length,
    monthlyRecurring: subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.monthlyRate, 0),
    pendingCharges: callCharges
      .filter(c => c.invoiceStatus === 'pending')
      .reduce((sum, c) => sum + c.totalCharge, 0),
    totalHoursUsed: subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.hoursUsed, 0),
    totalHoursAvailable: subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.hoursIncluded, 0)
  };

  const handleRenewSubscription = (subscriptionId: string) => {
    console.log('Renewing subscription:', subscriptionId);
  };

  const handleCreateInvoice = (clientId: string) => {
    console.log('Creating invoice for client:', clientId);
  };

  return (
    <div className="space-y-6">
      <Routes>
        <Route 
          path="/" 
          element={
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Billing & Subscriptions
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage support subscriptions and call charges
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    leftIcon={<RefreshCw size={16} />} 
                    variant="outline"
                    onClick={() => navigate('/admin/billing/quickbooks')}
                  >
                    Sync QuickBooks
                  </Button>
                  <Button leftIcon={<Plus size={16} />}>
                    New Subscription
                  </Button>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Plans</p>
                        <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
                      </div>
                      <Shield size={24} className="text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Recurring</p>
                        <p className="text-xl font-bold">{formatCurrency(stats.monthlyRecurring)}</p>
                      </div>
                      <TrendingUp size={24} className="text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Hours Used</p>
                        <p className="text-2xl font-bold">
                          {stats.totalHoursUsed.toFixed(1)}/{stats.totalHoursAvailable}
                        </p>
                      </div>
                      <Timer size={24} className="text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pending Charges</p>
                        <p className="text-xl font-bold text-orange-600">{formatCurrency(stats.pendingCharges)}</p>
                      </div>
                      <PhoneCall size={24} className="text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Expiring Soon</p>
                        <p className="text-2xl font-bold text-red-600">{stats.expiringSubscriptions}</p>
                      </div>
                      <AlertCircle size={24} className="text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate('/admin/billing/subscriptions')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Shield size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Manage Subscriptions
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          View and manage support plans
                        </p>
                      </div>
                      <ArrowRight size={20} className="text-gray-400 ml-auto" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setActiveTab('pay-per-call')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <PhoneIncoming size={24} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Call Charges
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Review pay-per-call billing
                        </p>
                      </div>
                      <ArrowRight size={20} className="text-gray-400 ml-auto" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate('/admin/billing/quickbooks')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Zap size={24} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          QuickBooks Sync
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Sync billing data
                        </p>
                      </div>
                      <ArrowRight size={20} className="text-gray-400 ml-auto" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-8">
                  <button
                    className={`py-3 px-1 font-medium text-sm border-b-2 ${
                      activeTab === 'overview'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`py-3 px-1 font-medium text-sm border-b-2 ${
                      activeTab === 'subscriptions'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('subscriptions')}
                  >
                    Active Subscriptions ({stats.activeSubscriptions})
                  </button>
                  <button
                    className={`py-3 px-1 font-medium text-sm border-b-2 ${
                      activeTab === 'pay-per-call'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('pay-per-call')}
                  >
                    Pay-per-call Charges
                  </button>
                </div>
              </div>
              
              {/* Tab Content */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin" size={32} />
                </div>
              ) : activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Expiring Subscriptions Alert */}
                  {stats.expiringSubscriptions > 0 && (
                    <Card className="lg:col-span-2 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                          <AlertCircle size={20} />
                          Subscriptions Expiring Soon
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {subscriptions
                            .filter(s => s.status === 'expiring')
                            .map(sub => (
                              <div key={sub.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <div>
                                  <p className="font-medium">{sub.clientName} - {sub.company}</p>
                                  <p className="text-sm text-gray-600">
                                    Expires {formatDate(new Date(sub.endDate))} • {sub.planName}
                                  </p>
                                </div>
                                <Button size="sm" onClick={() => handleRenewSubscription(sub.id)}>
                                  Renew Now
                                </Button>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Hours Usage Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Timer size={20} />
                        Support Hours Usage
                      </CardTitle>
                      <CardDescription>
                        Current month utilization across all active plans
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {subscriptions
                          .filter(s => s.status === 'active')
                          .map(sub => (
                            <div key={sub.id} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">{sub.clientName}</span>
                                <span className="text-gray-600">
                                  {sub.hoursUsed}/{sub.hoursIncluded}h
                                </span>
                              </div>
                              <Progress 
                                value={(sub.hoursUsed / sub.hoursIncluded) * 100} 
                                className="h-2"
                              />
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Recent Call Charges */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PhoneCall size={20} />
                        Recent Pay-per-call Charges
                      </CardTitle>
                      <CardDescription>
                        Unbilled call charges from non-subscribers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {callCharges
                          .filter(c => c.invoiceStatus === 'pending')
                          .slice(0, 5)
                          .map(charge => (
                            <div key={charge.id} className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{charge.clientName}</p>
                                <p className="text-xs text-gray-600">
                                  {formatRelativeTime(new Date(charge.callDate))} • {Math.round(charge.duration / 60)}m
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-sm">{formatCurrency(charge.totalCharge)}</p>
                                <Badge size="xs" variant="warning">Pending</Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === 'subscriptions' && (
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3 text-left">Client</th>
                          <th className="px-6 py-3 text-left">Plan</th>
                          <th className="px-6 py-3 text-left">Usage</th>
                          <th className="px-6 py-3 text-left">Billing</th>
                          <th className="px-6 py-3 text-left">Status</th>
                          <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {subscriptions.map(sub => (
                          <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium">{sub.clientName}</p>
                                <p className="text-sm text-gray-500">{sub.company}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-medium">{sub.planName}</p>
                                <p className="text-sm text-gray-500">{formatCurrency(sub.monthlyRate)}/mo</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="w-32">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>{sub.hoursUsed}h used</span>
                                  <span>{sub.hoursIncluded}h total</span>
                                </div>
                                <Progress 
                                  value={(sub.hoursUsed / sub.hoursIncluded) * 100} 
                                  className="h-1.5"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <p>Next: {formatDate(new Date(sub.nextBillingDate))}</p>
                                <p className="text-xs text-gray-500">
                                  {sub.autoRenew ? 'Auto-renew ON' : 'Auto-renew OFF'}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={
                                sub.status === 'active' ? 'success' : 
                                sub.status === 'expiring' ? 'warning' : 'danger'
                              }>
                                {sub.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <Button size="xs" variant="outline">
                                  View Details
                                </Button>
                                {sub.status === 'expiring' && (
                                  <Button size="xs" variant="primary">
                                    Renew
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
              )}
              
              {activeTab === 'pay-per-call' && (
                <Card className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Pay-per-call Charges</CardTitle>
                        <CardDescription>
                          Call charges for non-subscribers at ${callCharges[0]?.rate || 3.00}/minute
                        </CardDescription>
                      </div>
                      <Button size="sm" leftIcon={<FileText size={16} />}>
                        Generate Invoices
                      </Button>
                    </div>
                  </CardHeader>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3 text-left">Client</th>
                          <th className="px-6 py-3 text-left">Call Date</th>
                          <th className="px-6 py-3 text-left">Duration</th>
                          <th className="px-6 py-3 text-left">Charge</th>
                          <th className="px-6 py-3 text-left">Invoice</th>
                          <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {callCharges.map(charge => (
                          <tr key={charge.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium">{charge.clientName}</p>
                                <p className="text-sm text-gray-500">{charge.company}</p>
                                <p className="text-xs text-gray-400">{charge.phone}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {formatDate(new Date(charge.callDate))}
                              <div className="text-xs text-gray-500">
                                {new Date(charge.callDate).toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {Math.round(charge.duration / 60)} minutes
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium">{formatCurrency(charge.totalCharge)}</p>
                                <p className="text-xs text-gray-500">
                                  @ ${charge.rate}/min
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {charge.invoiceStatus === 'pending' && (
                                <Badge variant="warning" size="sm">Pending</Badge>
                              )}
                              {charge.invoiceStatus === 'invoiced' && (
                                <div>
                                  <Badge variant="info" size="sm">Invoiced</Badge>
                                  <p className="text-xs text-gray-500 mt-1">{charge.invoiceNumber}</p>
                                </div>
                              )}
                              {charge.invoiceStatus === 'paid' && (
                                <div>
                                  <Badge variant="success" size="sm">Paid</Badge>
                                  <p className="text-xs text-gray-500 mt-1">{charge.invoiceNumber}</p>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                {charge.invoiceStatus === 'pending' && (
                                  <Button 
                                    size="xs" 
                                    variant="primary"
                                    onClick={() => handleCreateInvoice(charge.clientId)}
                                  >
                                    Create Invoice
                                  </Button>
                                )}
                                {charge.invoiceNumber && (
                                  <Button size="xs" variant="outline">
                                    View Invoice
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
              )}
            </div>
          } 
        />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/payments" element={<PaymentProcessing />} />
        <Route path="/quickbooks" element={<QuickBooksSync />} />
      </Routes>
    </div>
  );
};

export default BillingPage;