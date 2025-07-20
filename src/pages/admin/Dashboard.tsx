import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { useTheme } from '../../contexts/ThemeContext';

// Import pages
import OverviewPage from './Overview';
import CommunicationsPage from './Communications';
import ClientsPage from './Clients';
import BillingPage from './Billing';
import FinancialsPage from './Financials';
import TimeTrackingPage from './TimeTracking';
import CalendarPage from './Calendar';
import ReportsPage from './Reports';
import DocumentsPage from './Documents';
import DocumentationPage from './Documentation';
import SettingsPage from './Settings';
import DebugPage from './Debug';

// Import enhanced widgets
import AdminActivityWidget from '../../components/dashboard/widgets/AdminActivityWidget';
import CalendarWidget from '../../components/dashboard/widgets/CalendarWidget';
import CommunicationWidget from '../../components/dashboard/widgets/CommunicationWidget';

// UI components and utilities
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import KPICard from '../../components/ui/KPICard';
import NotificationDropdown from '../../components/ui/NotificationDropdown';
import ThemeToggle from '../../components/ui/ThemeToggle';

// Icons
import { 
  Users,
  DollarSign,
  Phone,
  Clock,
  Search,
  Loader,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar as CalendarIcon,
  FileText,
  MessageSquare,
  Bot,
  Send,
  Mic,
  PhoneCall,
  Star,
  Timer
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../lib/utils';

// Data will be fetched from Supabase
const mockRecentCalls: any[] = [];
const mockUpcomingAppointments: any[] = [];
const mockOutstandingInvoices: any[] = [];
const mockTeamActivity: any[] = [];
const mockNotifications: any[] = [];

const AdminDashboard = () => {
  const location = useLocation();
  const isMainDashboard = location.pathname === '/admin';
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [aiQuery, setAiQuery] = useState('');
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleAiQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    
    setIsProcessingQuery(true);
    setAiResponse(null);
    
    // TODO: Implement actual AI query processing with Supabase and API
    // For now, show a placeholder message
    setTimeout(() => {
      setAiResponse({
        type: "generic",
        title: "AI Response",
        data: {
          message: "AI query processing will be implemented with actual API integration.",
          suggestion: "This feature will be connected to your AI backend soon."
        }
      });
      setIsProcessingQuery(false);
    }, 1000);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 dark:text-green-400';
      case 'negative': return 'text-red-600 dark:text-red-400';
      case 'neutral': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      case 'neutral': return '😐';
      default: return '😐';
    }
  };

  const renderAIResponse = () => {
    if (!aiResponse) return null;
    
    switch (aiResponse.type) {
      case 'invoices':
        return (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">{aiResponse.title}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-750 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2 text-left">Invoice #</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-left">Due Date</th>
                    <th className="px-4 py-2 text-center">Days Overdue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {aiResponse.data.map((invoice: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">{invoice.number}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{invoice.client}</td>
                      <td className="px-4 py-2 text-sm text-right font-medium text-gray-900 dark:text-gray-100">{formatCurrency(invoice.amount)}</td>
                      <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-sm text-center">
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs">
                          {invoice.daysOverdue} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-750 text-sm text-gray-500 dark:text-gray-400">
              Total overdue: {formatCurrency(aiResponse.data.reduce((sum: number, inv: any) => sum + inv.amount, 0))}
            </div>
          </div>
        );
        
      case 'calls':
        return (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">{aiResponse.title}</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{aiResponse.data.totalCalls}</div>
                  <div className="text-sm text-blue-800 dark:text-blue-300">Total Calls</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{aiResponse.data.completedCalls}</div>
                  <div className="text-sm text-green-800 dark:text-green-300">Completed</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{aiResponse.data.avgDuration}</div>
                  <div className="text-sm text-amber-800 dark:text-amber-300">Avg Duration</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Top Customers</h4>
                  <ul className="space-y-2">
                    {aiResponse.data.topClients.map((client: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        {client}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Sentiment Analysis</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-600 dark:text-green-400">Positive</span>
                        <span>{aiResponse.data.sentiment.positive}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${aiResponse.data.sentiment.positive}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-600 dark:text-blue-400">Neutral</span>
                        <span>{aiResponse.data.sentiment.neutral}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${aiResponse.data.sentiment.neutral}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-600 dark:text-red-400">Negative</span>
                        <span>{aiResponse.data.sentiment.negative}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${aiResponse.data.sentiment.negative}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'customers':
        return (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">{aiResponse.title}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-750 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-right">Revenue</th>
                    <th className="px-4 py-2 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {aiResponse.data.map((customer: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name}</td>
                      <td className="px-4 py-2 text-sm text-right font-medium text-gray-900 dark:text-gray-100">{formatCurrency(customer.revenue)}</td>
                      <td className="px-4 py-2 text-sm text-right">
                        <span className={customer.growth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {customer.growth > 0 ? '+' : ''}{customer.growth}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-750 text-sm text-gray-500 dark:text-gray-400">
              Total revenue: {formatCurrency(aiResponse.data.reduce((sum: number, customer: any) => sum + customer.revenue, 0))}
            </div>
          </div>
        );
        
      case 'team':
        return (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">{aiResponse.title}</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Overall Performance Score</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{aiResponse.data.overallScore}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Top Performer</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{aiResponse.data.topPerformer}</div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-750 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2 text-left">Team Member</th>
                      <th className="px-4 py-2 text-center">Calls</th>
                      <th className="px-4 py-2 text-center">Satisfaction</th>
                      <th className="px-4 py-2 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {aiResponse.data.metrics.map((member: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">{member.name}</td>
                        <td className="px-4 py-2 text-sm text-center text-gray-900 dark:text-gray-100">{member.calls}</td>
                        <td className="px-4 py-2 text-sm text-center">
                          <span className="text-green-600 dark:text-green-400">{member.satisfaction}%</span>
                        </td>
                        <td className="px-4 py-2 text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(member.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'generic':
        return (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100 mb-2">{aiResponse.title}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{aiResponse.data.message}</p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-blue-800 dark:text-blue-300 text-sm">
              <p><strong>Suggestion:</strong> {aiResponse.data.suggestion}</p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center">
        <Loader size={40} className="animate-spin text-blue-600 dark:text-blue-400 mb-4" />
        <p className="text-blue-600 dark:text-blue-400 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar type="admin" />
      
      <div className="flex-1 lg:ml-64 pt-6">
        <Routes>
          <Route 
            path="/" 
            element={
              isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-6 px-6 pb-6">
                  {/* Enhanced Header */}
                  <Header 
                    title="Schlatter's Inc Dashboard"
                    subtitle={`Welcome back, ${user?.email || 'Admin'}. Here's your business overview for today.`}
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onDismiss={handleDismissNotification}
                  />

                  {/* Enhanced Key Performance Indicators */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard
                      title="Active Customers"
                      value="0"
                      icon={<Users size={24} />}
                      trend={{
                        value: 0,
                        label: "new this month",
                        direction: "up"
                      }}
                      iconColor="bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                    />
                    
                    <KPICard
                      title="Monthly Revenue"
                      value={formatCurrency(0)}
                      icon={<DollarSign size={24} />}
                      trend={{
                        value: 0,
                        label: "vs last month",
                        direction: "up"
                      }}
                      iconColor="bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                    />
                    
                    <KPICard
                      title="Calls This Week"
                      value="0"
                      icon={<Phone size={24} />}
                      trend={{
                        value: 0,
                        label: "vs last week",
                        direction: "up"
                      }}
                      iconColor="bg-purple-50 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
                    />
                    
                    <KPICard
                      title="Outstanding Invoices"
                      value={formatCurrency(0)}
                      icon={<AlertTriangle size={24} />}
                      trend={{
                        value: 0,
                        label: "needs attention",
                        direction: "down"
                      }}
                      iconColor="bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
                    />
                  </div>

                  {/* AI Query Box - Moved to middle of dashboard */}
                  <Card className="border-2 border-dashed border-blue-300 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-600 text-white rounded-lg">
                          <Bot size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI Assistant</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Ask questions about your business, customers, or data</p>
                        </div>
                      </div>
                      
                      <form onSubmit={handleAiQuery} className="flex gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            placeholder="Ask anything... e.g., 'Show me customers with overdue invoices' or 'What was our revenue last month?'"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={isProcessingQuery}
                          />
                        </div>
                        <Button 
                          type="submit" 
                          disabled={!aiQuery.trim() || isProcessingQuery}
                          leftIcon={isProcessingQuery ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                        >
                          {isProcessingQuery ? 'Processing...' : 'Ask AI'}
                        </Button>
                      </form>
                      
                      {/* AI Response */}
                      {renderAIResponse()}
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Quick suggestions:</span>
                        {[
                          'Show overdue invoices',
                          'Call summary for today',
                          'Top customers by revenue',
                          'Team performance this week'
                        ].map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setAiQuery(suggestion)}
                            className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Appointments - Priority Section */}
                  <Card className="border-l-4 border-l-blue-600 dark:border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <CalendarIcon size={20} className="text-blue-600 dark:text-blue-400" />
                        Upcoming Appointments
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Your scheduled appointments for the next few days
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockUpcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${
                              appointment.priority === 'high' ? 'bg-red-500' :
                              appointment.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                            }`}></div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                {appointment.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {appointment.customerName} • {appointment.startTime} - {appointment.endTime}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{new Date(appointment.date).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{appointment.location}</p>
                          </div>
                        </div>
                      ))}
                      <div className="text-center pt-2">
                        <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />} className="text-gray-700 dark:text-gray-300">
                          View Full Calendar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Call Activity and Outstanding Invoices */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Call Activity */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <PhoneCall size={20} className="text-green-600 dark:text-green-400" />
                          Recent Call Activity
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Latest customer communications and call summaries
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {mockRecentCalls.map((call) => (
                          <div key={call.id} className="flex items-start justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${
                                call.type === 'support' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                              }`}>
                                <Phone size={14} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{call.customerName}</h4>
                                  <span className={getSentimentColor(call.sentiment)}>{getSentimentIcon(call.sentiment)}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  {call.type === 'support' ? 'Support' : 'Sales'} • {call.duration} • 
                                  {call.billable ? ' Billable' : ' Non-billable'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{call.summary}</p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDateTime(call.timestamp)}
                            </div>
                          </div>
                        ))}
                        <div className="text-center pt-2">
                          <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />} className="text-gray-700 dark:text-gray-300">
                            View All Calls
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Outstanding Invoices */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <FileText size={20} className="text-amber-600 dark:text-amber-400" />
                          Outstanding Invoices
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Invoices requiring attention and payment follow-up
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {mockOutstandingInvoices.map((invoice) => (
                          <div key={invoice.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">{invoice.number}</h4>
                                {invoice.status === 'overdue' && (
                                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs rounded-full">
                                    {invoice.daysOverdue} days overdue
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.customerName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(invoice.amount)}</p>
                              <Button size="sm" variant={invoice.status === 'overdue' ? 'default' : 'outline'}>
                                {invoice.status === 'overdue' ? 'Send Reminder' : 'View'}
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="text-center pt-2">
                          <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />} className="text-gray-700 dark:text-gray-300">
                            View All Invoices
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Team Activity Feed */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Users size={20} className="text-indigo-600 dark:text-indigo-400" />
                        Team Activity Feed
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Recent actions and updates from your team members
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockTeamActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                              {activity.user.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-gray-100">
                                <span className="font-medium">{activity.user.name}</span> {activity.details}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDateTime(activity.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            } 
          />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/communications/*" element={<CommunicationsPage />} />
          <Route path="/clients/*" element={<ClientsPage />} />
          <Route path="/billing/*" element={<BillingPage />} />
          <Route path="/financials" element={<FinancialsPage />} />
          <Route path="/time-tracking/*" element={<TimeTrackingPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/reports/*" element={<ReportsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/debug" element={<DebugPage />} />
          <Route path="*" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Page Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">The page you are looking for does not exist.</p>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;