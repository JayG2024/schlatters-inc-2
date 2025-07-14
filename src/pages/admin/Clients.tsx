import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  Mail, 
  Phone, 
  MessageSquare,
  Eye,
  UserPlus,
  Shield,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  Package,
  FileText,
  Send,
  PhoneCall,
  Loader2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatDate, formatCurrency, formatRelativeTime } from '../../lib/utils';
import { clientsApi, type Client as SupabaseClient } from '../../lib/supabase';
import { toast } from 'sonner';

interface Purchase {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'product' | 'service' | 'subscription';
}

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  quickbooksId?: string;
  
  // Subscription info
  isSubscriber: boolean;
  subscriptionStatus?: 'active' | 'expired' | 'cancelled';
  subscriptionPlan?: string;
  subscriptionHoursIncluded?: number;
  subscriptionHoursUsed?: number;
  subscriptionExpiry?: string;
  
  // Financial
  totalRevenue: number;
  outstandingBalance: number;
  lifetimeValue: number;
  
  // Communication
  lastCallDate?: string;
  totalCalls: number;
  totalMessages: number;
  lastContactType?: 'call' | 'sms' | 'email';
  averageCallDuration?: number;
  
  // Purchase history
  lastPurchaseDate?: string;
  purchaseCount: number;
  
  // Metadata
  createdAt: string;
  tags: string[];
  status: 'active' | 'inactive' | 'prospect';
}

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'subscribers' | 'pay-per-call' | 'expired'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSMSComposer, setShowSMSComposer] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [smsMessage, setSmsMessage] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    notes: ''
  });
  
  // Fetch clients from Supabase
  useEffect(() => {
    fetchClients();
  }, []);
  
  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientsApi.getAll();
      
      // Transform data to match our interface
      const transformedClients = data?.map((client: any) => ({
        ...client,
        isSubscriber: client.is_subscriber,
        subscriptionStatus: client.subscription_status,
        totalRevenue: parseFloat(client.total_revenue || 0),
        outstandingBalance: parseFloat(client.outstanding_balance || 0),
        lifetimeValue: parseFloat(client.lifetime_value || 0),
        lastContactDate: client.last_contact_date,
        lastContactType: client.last_contact_type,
        totalCalls: client.total_calls || 0,
        totalMessages: client.total_messages || 0,
        purchaseCount: client.purchase_count || 0,
        createdAt: client.created_at,
        alternatePhone: client.alternate_phone,
        quickbooksId: client.quickbooks_id,
        // Add subscription details if available
        subscriptionPlan: client.subscription?.[0]?.plan_name,
        subscriptionHoursIncluded: client.subscription?.[0]?.hours_included,
        subscriptionHoursUsed: parseFloat(client.subscription?.[0]?.hours_used || 0),
        subscriptionExpiry: client.subscription?.[0]?.end_date
      })) || [];
      
      setClients(transformedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddClient = async () => {
    try {
      const clientData = {
        name: newClient.name,
        company: newClient.company || null,
        email: newClient.email || null,
        phone: newClient.phone,
        notes: newClient.notes || null,
        status: 'active',
        is_subscriber: false,
        total_revenue: 0,
        outstanding_balance: 0,
        lifetime_value: 0,
        total_calls: 0,
        total_messages: 0,
        purchase_count: 0
      };
      
      const result = await clientsApi.create(clientData);
      
      toast.success('Client added successfully');
      setShowAddModal(false);
      setNewClient({ name: '', company: '', email: '', phone: '', notes: '' });
      fetchClients(); // Refresh the list
    } catch (error: any) {
      console.error('Error adding client:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      
      // Show more specific error message
      const errorMessage = error.message || 'Failed to add client';
      toast.error(errorMessage);
    }
  };
  
  const filteredClients = clients.filter(client => {
    // Tab filtering
    if (activeTab === 'subscribers' && (!client.isSubscriber || client.subscriptionStatus !== 'active')) {
      return false;
    }
    if (activeTab === 'pay-per-call' && client.isSubscriber) {
      return false;
    }
    if (activeTab === 'expired' && (!client.isSubscriber || client.subscriptionStatus !== 'expired')) {
      return false;
    }
    
    // Search filtering
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        client.name.toLowerCase().includes(search) || 
        client.company.toLowerCase().includes(search) || 
        client.email.toLowerCase().includes(search) || 
        client.phone.includes(search)
      );
    }
    
    return true;
  });

  const handleViewClient = (clientId: string) => {
    navigate(`/admin/clients/${clientId}`);
  };

  const handleSendSMS = (client: Client) => {
    setSelectedClient(client);
    setShowSMSComposer(true);
  };

  const handleSendSMSSubmit = () => {
    setSmsMessage('');
    setShowSMSComposer(false);
    setSelectedClient(null);
  };

  const handleCall = (phone: string) => {
    console.log(`Initiating call to ${phone}`);
    // In production, this would trigger OpenPhone call
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  // Calculate stats
  const stats = {
    totalClients: clients.length,
    activeSubscribers: clients.filter(c => c.isSubscriber && c.subscriptionStatus === 'active').length,
    payPerCall: clients.filter(c => !c.isSubscriber).length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalRevenue, 0),
    outstandingBalance: clients.reduce((sum, c) => sum + c.outstandingBalance, 0)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Customer Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Complete CRM with support subscriptions and communication history
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, company, phone..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full sm:w-80 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <Button leftIcon={<Plus size={16} />} onClick={() => setShowAddModal(true)}>
            Add Customer
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
                <p className="text-2xl font-bold">{stats.totalClients}</p>
              </div>
              <UserPlus size={24} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Subscribers</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeSubscribers}</p>
              </div>
              <Shield size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pay-per-call</p>
                <p className="text-2xl font-bold text-orange-600">{stats.payPerCall}</p>
              </div>
              <PhoneCall size={24} className="text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <DollarSign size={24} className="text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(stats.outstandingBalance)}</p>
              </div>
              <AlertCircle size={24} className="text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Customers ({clients.length})
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'subscribers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('subscribers')}
          >
            Active Subscribers ({stats.activeSubscribers})
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'pay-per-call'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pay-per-call')}
          >
            Pay-per-call ({stats.payPerCall})
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'expired'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('expired')}
          >
            Expired Subscriptions
          </button>
        </div>
      </div>
      
      {/* Clients Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Subscription</th>
                <th className="px-6 py-3 text-left">Communication</th>
                <th className="px-6 py-3 text-left">Revenue</th>
                <th className="px-6 py-3 text-left">Last Purchase</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 mr-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 font-medium">
                          {client.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => handleViewClient(client.id)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {client.name}
                        </button>
                        <div className="text-sm text-gray-500">{client.company}</div>
                        <div className="text-xs text-gray-400">{client.phone}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {client.isSubscriber ? (
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={client.subscriptionStatus === 'active' ? 'success' : 'danger'}
                            size="sm"
                          >
                            <Shield size={12} className="mr-1" />
                            {client.subscriptionStatus}
                          </Badge>
                        </div>
                        {client.subscriptionStatus === 'active' && (
                          <>
                            <div className="text-xs text-gray-600 mt-1">
                              {client.subscriptionPlan}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {client.subscriptionHoursUsed}/{client.subscriptionHoursIncluded}h used
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <Badge variant="warning" size="sm">
                        <DollarSign size={12} className="mr-1" />
                        Pay-per-call
                      </Badge>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {client.lastContactType === 'call' && <Phone size={14} className="text-blue-500" />}
                        {client.lastContactType === 'sms' && <MessageSquare size={14} className="text-purple-500" />}
                        {client.lastContactType === 'email' && <Mail size={14} className="text-green-500" />}
                        <span className="text-sm text-gray-600">
                          {client.lastCallDate ? formatRelativeTime(new Date(client.lastCallDate)) : 'No contact'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {client.totalCalls} calls, {client.totalMessages} messages
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium">{formatCurrency(client.totalRevenue)}</div>
                      {client.outstandingBalance > 0 && (
                        <div className="text-xs text-red-600 font-medium">
                          {formatCurrency(client.outstandingBalance)} due
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {client.lastPurchaseDate ? formatDate(new Date(client.lastPurchaseDate)) : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {client.purchaseCount} total purchases
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center space-x-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleViewClient(client.id)}
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleCall(client.phone)}
                        title="Call"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Phone size={16} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleSendSMS(client)}
                        title="Send SMS"
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <MessageSquare size={16} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleEmail(client.email)}
                        title="Send Email"
                        className="text-green-600 hover:text-green-800"
                      >
                        <Mail size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredClients.length === 0 && (
          <div className="text-center py-10">
            <UserPlus size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No customers found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm 
                ? `No results for "${searchTerm}"`
                : "No customers match the current filter."}
            </p>
          </div>
        )}
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin" size={32} />
        </div>
      )}

      {/* SMS Composer Modal */}
      {showSMSComposer && selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Send SMS to {selectedClient.name}</CardTitle>
              <CardDescription>{selectedClient.phone}</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full h-32 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">{smsMessage.length}/160 characters</p>
            </CardContent>
            <div className="flex justify-end gap-2 p-4">
              <Button variant="ghost" onClick={() => setShowSMSComposer(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendSMSSubmit} leftIcon={<Send size={16} />}>
                Send SMS
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Add New Customer</CardTitle>
              <CardDescription>Enter the customer's information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 h-20"
                  placeholder="Additional notes..."
                />
              </div>
            </CardContent>
            <div className="flex justify-end gap-2 p-4">
              <Button variant="ghost" onClick={() => {
                setShowAddModal(false);
                setNewClient({ name: '', company: '', email: '', phone: '', notes: '' });
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddClient} 
                leftIcon={<Plus size={16} />}
                disabled={!newClient.name || !newClient.phone}
              >
                Add Customer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;