import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Progress from '../../components/ui/Progress';
import { 
  Bell,
  MessageSquare,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Send,
  Timer,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  Zap,
  Settings
} from 'lucide-react';
import { formatCurrency, formatDate, formatRelativeTime, formatPercent } from '../../lib/utils';
import { toast } from 'sonner';

interface Reminder {
  id: string;
  type: 'payment' | 'renewal' | 'follow-up' | 'expired-card';
  clientId: string;
  clientName: string;
  company: string;
  phone: string;
  email: string;
  scheduledDate: Date;
  sentDate?: Date;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  method: 'email' | 'sms' | 'both';
  template: string;
  response?: {
    opened: boolean;
    clicked: boolean;
    replied: boolean;
    paymentMade: boolean;
    responseTime?: number;
  };
  relatedItem?: {
    type: 'invoice' | 'subscription';
    id: string;
    number: string;
    amount?: number;
    dueDate?: string;
  };
}

interface AutomationRule {
  id: string;
  name: string;
  type: 'payment-reminder' | 'renewal-reminder' | 'thank-you' | 'follow-up';
  trigger: {
    event: string;
    timing: number; // days before/after
    condition?: string;
  };
  action: {
    type: 'email' | 'sms' | 'both';
    template: string;
  };
  active: boolean;
  lastTriggered?: Date;
  totalSent: number;
  successRate: number;
}

const RemindersRenewals: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [activeTab, setActiveTab] = useState<'reminders' | 'automations' | 'analytics'>('reminders');
  const [loading, setLoading] = useState(true);
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Mock reminders data
      const mockReminders: Reminder[] = [
        {
          id: '1',
          type: 'payment',
          clientId: 'c1',
          clientName: 'John Smith',
          company: 'Smith Corp',
          phone: '(555) 123-4567',
          email: 'john@smithcorp.com',
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'scheduled',
          method: 'both',
          template: 'payment-reminder-7-days',
          relatedItem: {
            type: 'invoice',
            id: 'inv1',
            number: 'INV-2024-1001',
            amount: 1500,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          id: '2',
          type: 'renewal',
          clientId: 'c2',
          clientName: 'Jane Doe',
          company: 'Doe Industries',
          phone: '(555) 234-5678',
          email: 'jane@doeindustries.com',
          scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          status: 'scheduled',
          method: 'email',
          template: 'subscription-renewal-14-days',
          relatedItem: {
            type: 'subscription',
            id: 'sub1',
            number: 'SUB-2024-001',
            amount: 1500
          }
        },
        {
          id: '3',
          type: 'payment',
          clientId: 'c3',
          clientName: 'Bob Johnson',
          company: 'Johnson LLC',
          phone: '(555) 345-6789',
          email: 'bob@johnsonllc.com',
          scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
          sentDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
          status: 'sent',
          method: 'sms',
          template: 'payment-reminder-overdue',
          response: {
            opened: true,
            clicked: false,
            replied: false,
            paymentMade: true,
            responseTime: 180
          },
          relatedItem: {
            type: 'invoice',
            id: 'inv2',
            number: 'INV-2024-1002',
            amount: 750
          }
        }
      ];

      // Mock automation rules
      const mockAutomationRules: AutomationRule[] = [
        {
          id: 'rule1',
          name: '7-Day Payment Reminder',
          type: 'payment-reminder',
          trigger: {
            event: 'invoice_due',
            timing: -7,
            condition: 'unpaid'
          },
          action: {
            type: 'both',
            template: 'payment-reminder-7-days'
          },
          active: true,
          lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
          totalSent: 145,
          successRate: 78
        },
        {
          id: 'rule2',
          name: '30-Day Renewal Reminder',
          type: 'renewal-reminder',
          trigger: {
            event: 'subscription_expiry',
            timing: -30
          },
          action: {
            type: 'email',
            template: 'subscription-renewal-30-days'
          },
          active: true,
          lastTriggered: new Date(Date.now() - 24 * 60 * 60 * 1000),
          totalSent: 89,
          successRate: 92
        },
        {
          id: 'rule3',
          name: 'Overdue Payment Alert',
          type: 'payment-reminder',
          trigger: {
            event: 'invoice_overdue',
            timing: 1,
            condition: 'balance > 0'
          },
          action: {
            type: 'both',
            template: 'payment-overdue-alert'
          },
          active: true,
          totalSent: 67,
          successRate: 65
        },
        {
          id: 'rule4',
          name: 'Thank You - Payment Received',
          type: 'thank-you',
          trigger: {
            event: 'payment_received',
            timing: 0
          },
          action: {
            type: 'email',
            template: 'thank-you-payment'
          },
          active: false,
          totalSent: 234,
          successRate: 95
        }
      ];

      setReminders(mockReminders);
      setAutomationRules(mockAutomationRules);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load reminders data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    scheduledReminders: reminders.filter(r => r.status === 'scheduled').length,
    sentToday: reminders.filter(r => r.sentDate && isToday(r.sentDate)).length,
    responseRate: calculateResponseRate(),
    paymentSuccess: calculatePaymentSuccess(),
    activeAutomations: automationRules.filter(r => r.active).length,
    totalAutomationsSent: automationRules.reduce((sum, r) => sum + r.totalSent, 0),
    avgSuccessRate: automationRules.length > 0
      ? automationRules.reduce((sum, r) => sum + r.successRate, 0) / automationRules.length
      : 0
  };

  function calculateResponseRate() {
    const sentReminders = reminders.filter(r => r.status === 'sent' && r.response);
    if (sentReminders.length === 0) return 0;
    const responded = sentReminders.filter(r => r.response?.opened || r.response?.replied).length;
    return (responded / sentReminders.length) * 100;
  }

  function calculatePaymentSuccess() {
    const paymentReminders = reminders.filter(r => r.type === 'payment' && r.status === 'sent' && r.response);
    if (paymentReminders.length === 0) return 0;
    const successful = paymentReminders.filter(r => r.response?.paymentMade).length;
    return (successful / paymentReminders.length) * 100;
  }

  function isToday(date: Date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  const handleSendReminder = (reminderId: string) => {
    toast.success('Reminder sent successfully');
  };

  const handleToggleAutomation = (ruleId: string, active: boolean) => {
    setAutomationRules(rules => 
      rules.map(rule => 
        rule.id === ruleId ? { ...rule, active } : rule
      )
    );
    toast.success(`Automation ${active ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Reminders & Renewals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Automated customer outreach and renewal tracking
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            leftIcon={<Settings size={16} />}
          >
            Configure Templates
          </Button>
          <Button 
            leftIcon={<Send size={16} />}
          >
            Send Manual Reminder
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduledReminders}</p>
                <p className="text-xs text-gray-500">Pending reminders</p>
              </div>
              <Calendar size={24} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
                <p className="text-2xl font-bold">{stats.responseRate.toFixed(0)}%</p>
                <p className="text-xs text-gray-500">Customer engagement</p>
              </div>
              <MessageSquare size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Success</p>
                <p className="text-2xl font-bold">{stats.paymentSuccess.toFixed(0)}%</p>
                <p className="text-xs text-gray-500">Within 48 hours</p>
              </div>
              <DollarSign size={24} className="text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automations</p>
                <p className="text-2xl font-bold">{stats.activeAutomations}</p>
                <p className="text-xs text-gray-500">Active rules</p>
              </div>
              <Zap size={24} className="text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'reminders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('reminders')}
          >
            Reminder Queue
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'automations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('automations')}
          >
            Automation Rules
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'analytics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'reminders' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Reminder Type</th>
                  <th className="px-6 py-3 text-left">Schedule</th>
                  <th className="px-6 py-3 text-left">Method</th>
                  <th className="px-6 py-3 text-left">Related Item</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Response</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {reminders.map(reminder => (
                  <tr key={reminder.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{reminder.clientName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.company}</p>
                        <p className="text-xs text-gray-500">{reminder.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        reminder.type === 'payment' ? 'warning' :
                        reminder.type === 'renewal' ? 'info' :
                        reminder.type === 'expired-card' ? 'danger' :
                        'secondary'
                      }>
                        {reminder.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{formatDate(reminder.scheduledDate)}</p>
                      <p className="text-xs text-gray-500">{formatRelativeTime(reminder.scheduledDate)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {(reminder.method === 'email' || reminder.method === 'both') && (
                          <Mail size={16} className="text-gray-600" />
                        )}
                        {(reminder.method === 'sms' || reminder.method === 'both') && (
                          <MessageSquare size={16} className="text-gray-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {reminder.relatedItem && (
                        <div>
                          <p className="text-sm font-medium">{reminder.relatedItem.number}</p>
                          {reminder.relatedItem.amount && (
                            <p className="text-xs text-gray-600">{formatCurrency(reminder.relatedItem.amount)}</p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={
                        reminder.status === 'sent' ? 'success' :
                        reminder.status === 'scheduled' ? 'info' :
                        reminder.status === 'failed' ? 'danger' :
                        'secondary'
                      } size="sm">
                        {reminder.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {reminder.response && (
                        <div className="flex justify-center gap-2">
                          {reminder.response.opened && (
                            <CheckCircle size={16} className="text-green-500" title="Opened" />
                          )}
                          {reminder.response.paymentMade && (
                            <DollarSign size={16} className="text-green-600" title="Payment made" />
                          )}
                          {reminder.response.responseTime && (
                            <span className="text-xs text-gray-500">
                              {reminder.response.responseTime}m
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {reminder.status === 'scheduled' && (
                          <>
                            <Button size="xs" variant="outline">Edit</Button>
                            <Button size="xs" variant="primary" onClick={() => handleSendReminder(reminder.id)}>
                              Send Now
                            </Button>
                          </>
                        )}
                        {reminder.status === 'sent' && (
                          <Button size="xs" variant="ghost">View Details</Button>
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

      {activeTab === 'automations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {automationRules.map(rule => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <CardDescription className="mt-1">
                      Triggers {Math.abs(rule.trigger.timing)} days {rule.trigger.timing < 0 ? 'before' : 'after'} {rule.trigger.event.replace('_', ' ')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.active}
                        onChange={(e) => handleToggleAutomation(rule.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Communication Method</span>
                    <div className="flex items-center gap-1">
                      {(rule.action.type === 'email' || rule.action.type === 'both') && (
                        <Mail size={16} className="text-gray-600" />
                      )}
                      {(rule.action.type === 'sms' || rule.action.type === 'both') && (
                        <MessageSquare size={16} className="text-gray-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Sent</span>
                    <span className="font-medium">{rule.totalSent}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-medium text-green-600">{rule.successRate}%</span>
                  </div>
                  
                  {rule.lastTriggered && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Triggered</span>
                      <span className="text-sm">{formatRelativeTime(rule.lastTriggered)}</span>
                    </div>
                  )}
                  
                  {rule.trigger.condition && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500">Condition: {rule.trigger.condition}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Effectiveness</CardTitle>
              <CardDescription>Performance metrics for automated reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Email Open Rate</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>SMS Response Rate</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Payment Conversion</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Renewal Success</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Time Analysis</CardTitle>
              <CardDescription>Average time to customer action after reminder</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Reminders</span>
                  <span className="font-medium">2.5 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Renewal Reminders</span>
                  <span className="font-medium">18 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Card Update Requests</span>
                  <span className="font-medium">3.2 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Follow-up Messages</span>
                  <span className="font-medium">45 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Reminder performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
                <p>Chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Best Performing Templates</CardTitle>
              <CardDescription>Templates with highest conversion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">7-Day Payment Reminder</span>
                  <Badge variant="success">82% success</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">30-Day Renewal Notice</span>
                  <Badge variant="success">94% success</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Friendly Overdue Alert</span>
                  <Badge variant="warning">67% success</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Thank You Message</span>
                  <Badge variant="info">95% opened</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RemindersRenewals;