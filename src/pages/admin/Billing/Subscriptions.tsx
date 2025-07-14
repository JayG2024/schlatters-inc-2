import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
  Play,
  Pause,
  Edit,
  Trash2,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Progress from '../../../components/ui/Progress';
import { formatCurrency, formatDate } from '../../../lib/utils';

interface Subscription {
  id: string;
  clientName: string;
  clientEmail: string;
  planName: string;
  status: 'active' | 'cancelled' | 'past_due' | 'pending' | 'paused';
  amount: number;
  billingCycle: 'monthly' | 'quarterly' | 'annually';
  nextBillingDate: string;
  startDate: string;
  trialEnd?: string;
  discountPercent?: number;
  features: string[];
  paymentMethod: string;
  mrr: number; // Monthly Recurring Revenue
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  annualPrice: number;
  features: string[];
  maxUsers: number;
  popular?: boolean;
}

// Data will be fetched from Supabase
const mockSubscriptions: Subscription[] = [];

// Data will be fetched from Supabase
const mockPlans: SubscriptionPlan[] = [];

const getStatusBadge = (status: Subscription['status']) => {
  switch (status) {
    case 'active':
      return <Badge variant="success">Active</Badge>;
    case 'cancelled':
      return <Badge variant="default">Cancelled</Badge>;
    case 'past_due':
      return <Badge variant="danger">Past Due</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'paused':
      return <Badge variant="info">Paused</Badge>;
  }
};

const SubscriptionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'plans'>('subscriptions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Subscription['status']>('all');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  
  // Calculate subscription metrics
  const totalMRR = mockSubscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + sub.mrr, 0);
    
  const activeSubscriptions = mockSubscriptions.filter(sub => sub.status === 'active').length;
  const churnRate = (mockSubscriptions.filter(sub => sub.status === 'cancelled').length / mockSubscriptions.length) * 100;
  const avgRevenuePerUser = totalMRR / activeSubscriptions;

  // Filter subscriptions
  const filteredSubscriptions = mockSubscriptions.filter(subscription => {
    const matchesSearch = !searchTerm || 
      subscription.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.planName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCancelSubscription = (subscriptionId: string) => {
    console.log(`Cancel subscription ${subscriptionId}`);
    // In a real app, this would update the subscription status
  };

  const handlePauseSubscription = (subscriptionId: string) => {
    console.log(`Pause subscription ${subscriptionId}`);
    // In a real app, this would pause the subscription
  };

  const handleViewSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
  };

  const handleCloseSubscriptionDetail = () => {
    setSelectedSubscription(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600 mt-1">Manage recurring subscriptions and billing plans</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search subscriptions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="past_due">Past Due</option>
            <option value="cancelled">Cancelled</option>
            <option value="paused">Paused</option>
          </select>
          
          <Button leftIcon={<Download size={16} />} variant="outline">
            Export
          </Button>
          
          <Button leftIcon={<Plus size={16} />}>
            New Subscription
          </Button>
        </div>
      </div>
      
      {/* Subscription Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Recurring Revenue</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{formatCurrency(totalMRR)}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-md">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp size={14} className="text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12.5%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
                <p className="text-2xl font-bold mt-1">{activeSubscriptions}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-md">
                <Users size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp size={14} className="text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+3</span>
              <span className="text-gray-500 ml-1">new this month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Churn Rate</p>
                <p className="text-2xl font-bold mt-1 text-amber-600">{churnRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-amber-50 rounded-md">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-amber-600 font-medium">-0.5%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Revenue Per User</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">{formatCurrency(avgRevenuePerUser)}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-md">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp size={14} className="text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+8.3%</span>
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
              activeTab === 'subscriptions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('subscriptions')}
          >
            Active Subscriptions
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'plans'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('plans')}
          >
            Subscription Plans
          </button>
        </div>
      </div>
      
      {/* Subscription Detail Modal */}
      {selectedSubscription && (
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Subscription Details - {selectedSubscription.clientName}</CardTitle>
              <CardDescription>
                {selectedSubscription.planName} Plan • {selectedSubscription.billingCycle}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(selectedSubscription.status)}
              <Button 
                variant="ghost" 
                size="sm"
                leftIcon={<X size={16} />}
                onClick={handleCloseSubscriptionDetail}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Subscription Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium">{selectedSubscription.clientName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span>{selectedSubscription.clientEmail}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">{selectedSubscription.planName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatCurrency(selectedSubscription.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Billing Cycle:</span>
                    <span className="capitalize">{selectedSubscription.billingCycle}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Next Billing:</span>
                    <span>{formatDate(new Date(selectedSubscription.nextBillingDate))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method:</span>
                    <span>{selectedSubscription.paymentMethod}</span>
                  </div>
                  {selectedSubscription.discountPercent && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-green-600 font-medium">{selectedSubscription.discountPercent}% off</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Plan Features</h3>
                <div className="space-y-2">
                  {selectedSubscription.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {selectedSubscription.trialEnd && (
                  <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800">Trial Period</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      Trial ends on {formatDate(new Date(selectedSubscription.trialEnd))}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="outline" leftIcon={<Edit size={16} />}>
                Edit Subscription
              </Button>
              {selectedSubscription.status === 'active' && (
                <>
                  <Button 
                    variant="outline" 
                    leftIcon={<Pause size={16} />}
                    onClick={() => handlePauseSubscription(selectedSubscription.id)}
                  >
                    Pause
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    leftIcon={<X size={16} />}
                    onClick={() => handleCancelSubscription(selectedSubscription.id)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && !selectedSubscription && (
        <Card className="bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Client</th>
                  <th className="px-6 py-3 text-left">Plan</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Billing Cycle</th>
                  <th className="px-6 py-3 text-left">Next Billing</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredSubscriptions.map(subscription => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <button
                          onClick={() => handleViewSubscription(subscription)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {subscription.clientName}
                        </button>
                        <div className="text-sm text-gray-500">{subscription.clientEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{subscription.planName}</div>
                      {subscription.discountPercent && (
                        <div className="text-xs text-green-600">{subscription.discountPercent}% discount</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(subscription.amount)}
                      <div className="text-xs text-gray-500">
                        MRR: {formatCurrency(subscription.mrr)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {subscription.billingCycle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(new Date(subscription.nextBillingDate))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(subscription.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button 
                          className="text-blue-600 hover:text-blue-900" 
                          title="View Details"
                          onClick={() => handleViewSubscription(subscription)}
                        >
                          <Edit size={16} />
                        </button>
                        {subscription.status === 'active' && (
                          <button 
                            className="text-amber-600 hover:text-amber-900" 
                            title="Pause"
                            onClick={() => handlePauseSubscription(subscription.id)}
                          >
                            <Pause size={16} />
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
          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-10">
              <CreditCard size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No subscriptions found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? "No subscriptions match your current filters"
                  : "No subscriptions have been created yet."}
              </p>
              <Button leftIcon={<Plus size={16} />}>
                Create Subscription
              </Button>
            </div>
          )}
        </Card>
      )}
      
      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Subscription Plans</h2>
              <p className="text-gray-600">Manage your available subscription plans and pricing</p>
            </div>
            <Button leftIcon={<Plus size={16} />}>
              Create Plan
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockPlans.map((plan) => (
              <Card key={plan.id} className={`bg-white relative ${plan.popular ? 'border-blue-500 border-2' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(plan.monthlyPrice)}
                      <span className="text-lg font-normal text-gray-500">/month</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="text-sm text-gray-600">
                        Quarterly: {formatCurrency(plan.quarterlyPrice)} (10% off)
                      </div>
                      <div className="text-sm text-gray-600">
                        Annual: {formatCurrency(plan.annualPrice)} (20% off)
                      </div>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-3" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-center text-sm text-gray-600 mb-4">
                    {plan.maxUsers === -1 ? 'Unlimited Users' : `Up to ${plan.maxUsers} Users`}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" leftIcon={<Edit size={14} />}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" leftIcon={<Users size={14} />}>
                      {mockSubscriptions.filter(sub => sub.planName === plan.name && sub.status === 'active').length} Active
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;