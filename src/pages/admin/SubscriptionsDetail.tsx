import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Progress from '../../components/ui/Progress';
import { 
  Shield,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  CreditCard,
  Phone,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { formatCurrency, formatDate, formatRelativeTime } from '../../lib/utils';
import { subscriptionsApi } from '../../lib/supabase';
import { toast } from 'sonner';

interface SubscriptionDetail {
  id: string;
  clientId: string;
  clientName: string;
  company: string;
  email: string;
  phone: string;
  planName: string;
  monthlyRate: number;
  annualRate: number;
  startDate: string;
  endDate: string;
  renewalDate: string;
  status: 'active' | 'expiring' | 'expired' | 'cancelled';
  autoRenew: boolean;
  hoursIncluded: number;
  hoursUsed: number;
  hoursRemaining: number;
  priorYearCredit: number;
  creditApplied: boolean;
  lastPaymentDate: string;
  lastPaymentAmount: number;
  paymentMethod: string;
  cardLast4?: string;
  cardExpiry?: string;
  totalRevenue: number;
  lifetimeValue: number;
  emergencyCallsThisMonth: number;
  emergencyRevenue: number;
  notes?: string;
}

const SubscriptionsDetail: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'renewal' | 'revenue'>('renewal');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      // TODO: Implement full subscription details fetch
      const data = await subscriptionsApi.getActive();
      
      // Mock enhanced data for now
      const enhancedData: SubscriptionDetail[] = data?.map((sub: any) => ({
        id: sub.id,
        clientId: sub.client_id,
        clientName: sub.client?.name || 'Unknown',
        company: sub.client?.company || '',
        email: sub.client?.email || '',
        phone: sub.client?.phone || '',
        planName: 'Pro Tech Service',
        monthlyRate: 125,
        annualRate: 1500,
        startDate: sub.start_date,
        endDate: sub.end_date,
        renewalDate: sub.end_date,
        status: sub.status,
        autoRenew: sub.auto_renew,
        hoursIncluded: 10,
        hoursUsed: parseFloat(sub.hours_used || 0),
        hoursRemaining: 10 - parseFloat(sub.hours_used || 0),
        priorYearCredit: Math.random() * 500,
        creditApplied: Math.random() > 0.5,
        lastPaymentDate: sub.last_payment_date || sub.start_date,
        lastPaymentAmount: 1500,
        paymentMethod: 'credit_card',
        cardLast4: '4242',
        cardExpiry: '12/25',
        totalRevenue: Math.random() * 10000 + 1500,
        lifetimeValue: Math.random() * 20000 + 3000,
        emergencyCallsThisMonth: Math.floor(Math.random() * 5),
        emergencyRevenue: Math.random() * 300,
        notes: ''
      })) || [];
      
      setSubscriptions(enhancedData);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    totalActive: subscriptions.filter(s => s.status === 'active').length,
    totalExpiring: subscriptions.filter(s => s.status === 'expiring').length,
    totalRevenue: subscriptions.reduce((sum, s) => sum + s.annualRate, 0),
    totalCredit: subscriptions.reduce((sum, s) => sum + s.priorYearCredit, 0),
    avgLifetimeValue: subscriptions.length > 0 
      ? subscriptions.reduce((sum, s) => sum + s.lifetimeValue, 0) / subscriptions.length 
      : 0,
    totalEmergencyRevenue: subscriptions.reduce((sum, s) => sum + s.emergencyRevenue, 0)
  };

  // Filter and sort subscriptions
  const filteredSubscriptions = subscriptions
    .filter(sub => {
      const matchesSearch = searchTerm === '' || 
        sub.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.clientName.localeCompare(b.clientName);
        case 'renewal':
          return new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
        case 'revenue':
          return b.lifetimeValue - a.lifetimeValue;
        default:
          return 0;
      }
    });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Subscription Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Complete view of all Pro Tech Service subscriptions
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            leftIcon={<Download size={16} />}
          >
            Export to Excel
          </Button>
          <Button 
            leftIcon={<RefreshCw size={16} />}
            onClick={fetchSubscriptions}
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Subscriptions</p>
                <p className="text-2xl font-bold">{stats.totalActive}</p>
              </div>
              <Shield size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalExpiring}</p>
              </div>
              <AlertTriangle size={24} className="text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Annual Revenue</p>
                <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <DollarSign size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Prior Year Credit</p>
                <p className="text-xl font-bold">{formatCurrency(stats.totalCredit)}</p>
              </div>
              <CreditCard size={24} className="text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg LTV</p>
                <p className="text-xl font-bold">{formatCurrency(stats.avgLifetimeValue)}</p>
              </div>
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Emergency Revenue</p>
                <p className="text-xl font-bold">{formatCurrency(stats.totalEmergencyRevenue)}</p>
              </div>
              <Phone size={24} className="text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, company, or email..."
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
              <option value="active">Active</option>
              <option value="expiring">Expiring</option>
              <option value="expired">Expired</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="renewal">Sort by Renewal Date</option>
              <option value="name">Sort by Name</option>
              <option value="revenue">Sort by Revenue</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Subscription</th>
                <th className="px-6 py-3 text-left">Usage</th>
                <th className="px-6 py-3 text-left">Credit & Billing</th>
                <th className="px-6 py-3 text-left">Revenue</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSubscriptions.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{sub.clientName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{sub.company}</p>
                      <p className="text-xs text-gray-500">{sub.email}</p>
                      <p className="text-xs text-gray-500">{sub.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{sub.planName}</p>
                      <p className="text-sm text-gray-600">{formatCurrency(sub.annualRate)}/year</p>
                      <p className="text-xs text-gray-500">
                        Renews: {formatDate(new Date(sub.renewalDate))}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {sub.autoRenew ? (
                          <Badge variant="success" size="xs">Auto-Renew ON</Badge>
                        ) : (
                          <Badge variant="warning" size="xs">Auto-Renew OFF</Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Hours Used</span>
                          <span>{sub.hoursUsed.toFixed(1)}/{sub.hoursIncluded}h</span>
                        </div>
                        <Progress 
                          value={(sub.hoursUsed / sub.hoursIncluded) * 100} 
                          className="h-2"
                        />
                      </div>
                      {sub.emergencyCallsThisMonth > 0 && (
                        <p className="text-xs text-orange-600">
                          +{sub.emergencyCallsThisMonth} emergency calls
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm">
                        Credit: {formatCurrency(sub.priorYearCredit)}
                        {sub.creditApplied && (
                          <CheckCircle size={12} className="inline ml-1 text-green-500" />
                        )}
                      </p>
                      <p className="text-xs text-gray-600">
                        Last payment: {formatDate(new Date(sub.lastPaymentDate))}
                      </p>
                      {sub.cardLast4 && (
                        <p className="text-xs text-gray-500">
                          •••• {sub.cardLast4} (exp {sub.cardExpiry})
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{formatCurrency(sub.lifetimeValue)}</p>
                      <p className="text-xs text-gray-600">Lifetime</p>
                      {sub.emergencyRevenue > 0 && (
                        <p className="text-xs text-orange-600">
                          +{formatCurrency(sub.emergencyRevenue)} emergency
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={
                      sub.status === 'active' ? 'success' : 
                      sub.status === 'expiring' ? 'warning' : 
                      sub.status === 'expired' ? 'danger' : 'secondary'
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
    </div>
  );
};

export default SubscriptionsDetail;