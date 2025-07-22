import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Search, 
  Bell, 
  ChevronRight,
  DollarSign,
  Clock,
  Calendar as CalendarIcon,
  MessageSquare,
  FileText,
  CheckCircle2,
  Users,
  CreditCard,
  HelpCircle,
  Loader
} from 'lucide-react';

// Import client pages
import InvoicesPage from './Invoices';
import AppointmentsPage from './Appointments';
import DocumentsPage from './Documents';
import SupportPage from './Support';

// Import widgets
import PlanUsageWidget from '../../components/dashboard/widgets/PlanUsageWidget';
import InvoiceWidget from '../../components/dashboard/widgets/InvoiceWidget';
import CommunicationWidget from '../../components/dashboard/widgets/CommunicationWidget';
import CalendarWidget from '../../components/dashboard/widgets/CalendarWidget';
import EstimatesWidget from '../../components/dashboard/widgets/EstimatesWidget';
import SupportWidget from '../../components/dashboard/widgets/SupportWidget';
import DocumentsWidget from '../../components/dashboard/widgets/DocumentsWidget';
import TimeTrackingWidget from '../../components/dashboard/widgets/TimeTrackingWidget';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import DashboardErrorBoundary from '../../components/DashboardErrorBoundary';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Progress from '../../components/ui/Progress';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { formatCurrency, formatDate } from '../../lib/utils';

// Mock data removed - data will be fetched from Supabase

const ClientDashboard = () => {
  const location = useLocation();
  const isMainDashboard = location.pathname === '/client';
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'billing'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize empty state for data to be fetched from Supabase
  const [planInfo, setPlanInfo] = useState<any>({
    tier: 'Loading...',
    renewalDate: 'Loading...',
    textUsage: { used: 0, total: 0 },
    callUsage: { used: 0, total: 0 },
    consultingUsage: { used: 0, total: 0 }
  });
  const [communications, setCommunications] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [clientTimeEntries, setClientTimeEntries] = useState<any[]>([]);
  const [serviceHistory, setServiceHistory] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch actual data from Supabase
    // For now, simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // TODO: Add actual data fetching logic here
      // setPlanInfo(fetchedPlanInfo);
      // setCommunications(fetchedCommunications);
      // setAppointments(fetchedAppointments);
      // etc.
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center">
        <Loader size={40} className="animate-spin text-navy-600 dark:text-blue-400 mb-4" />
        <p className="text-navy-600 dark:text-blue-400 font-medium">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar type="client" />
      
      <div className="flex-1 lg:ml-64 pt-6">
        <Routes>
          <Route 
            path="/" 
            element={
              isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-6 px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Client Dashboard</h1>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user?.email || 'User'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="pl-9 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-48"
                        />
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      </div>
                      <ThemeToggle />
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Bell size={16} />}
                        className="relative"
                      >
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                          2
                        </span>
                      </Button>
                      <Button
                        leftIcon={<HelpCircle size={16} />}
                        size="sm"
                      >
                        Get Support
                      </Button>
                    </div>
                  </div>

                  {/* Dashboard Tabs */}
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-8">
                      <button
                        className={`py-3 px-1 font-medium text-sm border-b-2 ${
                          activeTab === 'overview'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('overview')}
                      >
                        Overview
                      </button>
                      <button
                        className={`py-3 px-1 font-medium text-sm border-b-2 ${
                          activeTab === 'services'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('services')}
                      >
                        My Services
                      </button>
                      <button
                        className={`py-3 px-1 font-medium text-sm border-b-2 ${
                          activeTab === 'billing'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('billing')}
                      >
                        Billing & Payments
                      </button>
                    </div>
                  </div>
                  
                  {activeTab === 'overview' && (
                    <>
                      {/* Key Summary Stats */}
                      <DashboardErrorBoundary section="Key Summary Stats">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <Card className="bg-white dark:bg-gray-800">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Plan</p>
                                <p className="text-xl font-bold mt-1 text-gray-900 dark:text-gray-100">{planInfo?.tier ? `${planInfo.tier} Plan` : 'N/A'}</p>
                              </div>
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                                <Users size={20} className="text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                            <div className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                              <span>Renews: </span>
                              <span>{planInfo?.renewalDate || 'N/A'}</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-gray-800">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Outstanding Balance</p>
                                <p className="text-xl font-bold mt-1 text-gray-900 dark:text-gray-100">{formatCurrency(1500)}</p>
                              </div>
                              <div className="p-3 bg-amber-50 dark:bg-amber-900/50 rounded-lg">
                                <CreditCard size={20} className="text-amber-600 dark:text-amber-400" />
                              </div>
                            </div>
                            <div className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                              <span>Due: </span>
                              <span>May 15, 2025</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-gray-800">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Consulting Hours</p>
                                <p className="text-xl font-bold mt-1 text-gray-900 dark:text-gray-100">8 / 10 hrs</p>
                              </div>
                              <div className="p-3 bg-purple-50 dark:bg-purple-900/50 rounded-lg">
                                <Clock size={20} className="text-purple-600 dark:text-purple-400" />
                              </div>
                            </div>
                            <div className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                              <span>Used: </span>
                              <span>80% of allocation</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-gray-800">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Appointment</p>
                                <p className="text-xl font-bold mt-1 text-gray-900 dark:text-gray-100">May 15</p>
                              </div>
                              <div className="p-3 bg-green-50 dark:bg-green-900/50 rounded-lg">
                                <CalendarIcon size={20} className="text-green-600 dark:text-green-400" />
                              </div>
                            </div>
                            <div className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                              <span>Type: </span>
                              <span>Quarterly Review</span>
                            </div>
                          </CardContent>
                        </Card>
                        </div>
                      </DashboardErrorBoundary>
                      
                      {/* Current Services */}
                      <Card className="bg-white dark:bg-gray-800 mb-6">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Services</h2>
                            <Button 
                              variant="ghost"
                              size="sm"
                              rightIcon={<ChevronRight size={16} />}
                              className="text-blue-600 dark:text-blue-400"
                              onClick={() => setActiveTab('services')}
                            >
                              View All
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Your active service subscriptions</p>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                              <div className="flex justify-between mb-2">
                                <span className="text-blue-700 dark:text-blue-300 font-medium">CRM Management</span>
                                <Badge variant="success">Active</Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Core CRM services including client database management and relationship tracking</p>
                              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Since: Apr 1, 2025</span>
                                <span>Tier: {planInfo?.tier || 'N/A'}</span>
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                              <div className="flex justify-between mb-2">
                                <span className="text-green-700 dark:text-green-300 font-medium">Communications</span>
                                <Badge variant="success">Active</Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Phone, SMS, and email communication tools with history tracking</p>
                              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Since: Apr 1, 2025</span>
                                <span>Usage: 85%</span>
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
                              <div className="flex justify-between mb-2">
                                <span className="text-purple-700 dark:text-purple-300 font-medium">Consulting</span>
                                <Badge variant="success">Active</Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Professional advisory services with dedicated account manager</p>
                              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Since: Apr 1, 2025</span>
                                <span>Hours: 8/10</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                      
                      {/* Primary Widgets */}
                      <DashboardErrorBoundary section="Primary Widgets">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <CommunicationWidget 
                          communications={communications}
                          onViewAll={() => {}}
                          onCall={(phone) => {}}
                          onText={(phone) => {}}
                          className="col-span-1"
                        />
                        
                        <CalendarWidget 
                          appointments={appointments}
                          onViewAll={() => {}}
                          onAddAppointment={() => {}}
                          className="col-span-1"
                        />
                        </div>
                      </DashboardErrorBoundary>
                      
                      {/* Secondary Widgets */}
                      <DashboardErrorBoundary section="Secondary Widgets">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <SupportWidget 
                          tickets={tickets}
                          onViewAll={() => {}}
                          onCreateTicket={() => {}}
                          onViewTicket={(id) => {}}
                          userType="client"
                          className="col-span-1"
                        />
                        
                        <EstimatesWidget 
                          estimates={estimates}
                          onViewAll={() => {}}
                          onCreateEstimate={() => {}}
                          onApproveEstimate={(id) => {}}
                          onRejectEstimate={(id) => {}}
                          onDownloadEstimate={(id) => {}}
                          userType="client"
                          className="col-span-1"
                        />
                        
                        <PlanUsageWidget 
                          planInfo={planInfo} 
                          onUpgrade={() => {}} 
                        />
                        </div>
                      </DashboardErrorBoundary>

                      {/* Financial Status and Document Management */}
                      <DashboardErrorBoundary section="Financial Status and Document Management">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InvoiceWidget 
                          invoices={invoices}
                          onViewAll={() => {}}
                          onPayInvoice={() => {}}
                          onDownloadInvoice={() => {}}
                          userType="client"
                          className="col-span-1"
                        />
                        
                        <DocumentsWidget 
                          documents={documents}
                          onViewAll={() => {}}
                          onUploadDocument={() => {}}
                          onDownloadDocument={() => {}}
                          onViewDocument={() => {}}
                          className="col-span-1"
                        />
                        </div>
                      </DashboardErrorBoundary>
                    </>
                  )}

                  {activeTab === 'services' && (
                    <div className="space-y-6">
                      {/* Service Plan Details */}
                      <Card className="bg-white dark:bg-gray-800">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Service Plan Details</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your current service package</p>
                        </div>
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                            <div>
                              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium mb-2">
                                {planInfo?.tier ? `${planInfo.tier} Plan` : 'N/A'}
                              </span>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Business Service Package</h3>
                              <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive CRM and client management solution</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(1500)}/month</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Next renewal: {planInfo?.renewalDate || 'N/A'}</div>
                              <Button size="sm" className="mt-3">Manage Plan</Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CRM Features</h4>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-center">
                                  <CheckCircle2 size={16} className="text-green-500 dark:text-green-400 mr-2" />
                                  <span className="text-gray-900 dark:text-gray-100">Contact Management</span>
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle2 size={16} className="text-green-500 dark:text-green-400 mr-2" />
                                  <span className="text-gray-900 dark:text-gray-100">Email Integration</span>
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle2 size={16} className="text-green-500 dark:text-green-400 mr-2" />
                                  <span className="text-gray-900 dark:text-gray-100">Lead Tracking</span>
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle2 size={16} className="text-green-500 dark:text-green-400 mr-2" />
                                  <span className="text-gray-900 dark:text-gray-100">Custom Reporting</span>
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Communication</h4>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-center">
                                  <CheckCircle2 size={16} className="text-green-500 dark:text-green-400 mr-2" />
                                  <span className="text-gray-900 dark:text-gray-100">50 Phone Minutes</span>
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle2 size={16} className="text-green-500 dark:text-green-400 mr-2" />
                                  <span className="text-gray-900 dark:text-gray-100">1,000 Text Messages</span>
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle2 size={16} className="text-green-500 dark:text-green-400 mr-2" />
                                  <span className="text-gray-900 dark:text-gray-100">Call Recording</span>
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle2 size={16} className="text-green-500 dark:text-green-400 mr-2" />
                                  <span className="text-gray-900 dark:text-gray-100">SMS Automation</span>
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Support & Services</h4>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-center">
                                  <CheckCircle2 size={16} className="text-green-500 dark:text-green-400 mr-2" />
                                  <span className="text-gray-900 dark:text-gray-100">10 Consulting Hours</span>
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle2 size={16} className="text-green-500 dark:text-green-400 mr-2" />
                                  <span className="text-gray-900 dark:text-gray-100">Priority Support</span>
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle2 size={16} className="text-green-500 dark:text-green-400 mr-2" />
                                  <span className="text-gray-900 dark:text-gray-100">Quarterly Reviews</span>
                                </li>
                                <li className="flex items-center">
                                  <CheckCircle2 size={16} className="text-green-500 dark:text-green-400 mr-2" />
                                  <span className="text-gray-900 dark:text-gray-100">Training Sessions</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          
                          <PlanUsageWidget 
                            planInfo={planInfo} 
                            onUpgrade={() => {}} 
                          />
                        </div>
                      </Card>

                      {/* Time Tracking for Client */}
                      <Card className="bg-white dark:bg-gray-800">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Time Tracking</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your consulting hours usage and history</p>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-navy-50 dark:bg-blue-900/20 rounded-lg p-5">
                              <h3 className="font-medium text-navy-800 dark:text-blue-300 mb-3">Consulting Hours</h3>
                              <div className="text-3xl font-bold text-navy-800 dark:text-blue-200 mb-2">
                                {planInfo?.consultingUsage?.used ?? 0} / {planInfo?.consultingUsage?.total ?? 0}
                              </div>
                              <Progress 
                                value={planInfo?.consultingUsage && planInfo.consultingUsage.total ? (planInfo.consultingUsage.used / planInfo.consultingUsage.total) * 100 : 0} 
                                variant={planInfo?.consultingUsage && planInfo.consultingUsage.total && (planInfo.consultingUsage.used / planInfo.consultingUsage.total > 0.8) ? 'warning' : 'default'}
                              />
                              <p className="text-sm text-navy-600 dark:text-blue-300 mt-3">
                                {planInfo?.consultingUsage && planInfo.consultingUsage.used === planInfo.consultingUsage.total ? (
                                  "You've used all your allocated consulting hours"
                                ) : (
                                  `${planInfo?.consultingUsage?.total && planInfo?.consultingUsage?.used !== undefined ? planInfo.consultingUsage.total - planInfo.consultingUsage.used : 'N/A'} hours remaining this cycle`
                                )}
                              </p>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-800/80 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Recent Consulting Activity</h3>
                              <div className="space-y-3">
                                {clientTimeEntries.slice(0, 3).map((entry, index) => (
                                  <div key={index} className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-3">
                                    <div>
                                      <div className="font-medium text-gray-900 dark:text-gray-100">{entry.description}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {entry.consultant} • {new Date(entry.startTime).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {entry.duration / 60} hrs
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <Button className="w-full mt-3" variant="outline" size="sm">
                                View All Time Entries
                              </Button>
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Billable Hours Breakdown</h3>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CRM Implementation</span>
                                  <span className="text-sm text-gray-900 dark:text-gray-100">4.5 hours</span>
                                </div>
                                <Progress value={45} />
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Technical Support</span>
                                  <span className="text-sm text-gray-900 dark:text-gray-100">2 hours</span>
                                </div>
                                <Progress value={20} />
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Training</span>
                                  <span className="text-sm text-gray-900 dark:text-gray-100">1.5 hours</span>
                                </div>
                                <Progress value={15} />
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-right">
                              <Button variant="outline" size="sm">Request Additional Hours</Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                      
                      {/* Service History */}
                      <Card className="bg-white dark:bg-gray-800">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Service History</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Record of service delivery and consulting</p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              <tr>
                                <th className="px-6 py-3 text-left">Service Type</th>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Consultant</th>
                                <th className="px-6 py-3 text-left">Duration</th>
                                <th className="px-6 py-3 text-left">Notes</th>
                                <th className="px-6 py-3 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                              {serviceHistory.map((service) => (
                                <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/70">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {service.type}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {service.date}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {service.consultant}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {service.duration}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {service.notes}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <Badge variant="success">
                                      {service.status === 'completed' ? 'Completed' : service.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    </div>
                  )}

                  {activeTab === 'billing' && (
                    <div className="space-y-6">
                      {/* Payment Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="bg-white dark:bg-gray-800">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Balance</p>
                                <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">{formatCurrency(1500)}</p>
                              </div>
                              <Badge variant="warning">Due Soon</Badge>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Due on May 15, 2025</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-white dark:bg-gray-800">
                          <CardContent className="p-6">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</p>
                            <div className="flex items-center mt-2">
                              <CreditCard size={20} className="text-gray-400 dark:text-gray-500 mr-2" />
                              <p className="text-base font-medium text-gray-900 dark:text-gray-100">•••• 4242</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Expires 12/26</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-white dark:bg-gray-800">
                          <CardContent className="p-6">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Billing Period</p>
                            <p className="text-base font-medium mt-2 text-gray-900 dark:text-gray-100">May 1 - 31, 2025</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Next invoice: Jun 1, 2025</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <InvoiceWidget 
                          invoices={invoices}
                          onViewAll={() => {}}
                          onPayInvoice={(id) => {}}
                          onDownloadInvoice={(id) => {}}
                          userType="client"
                          className="h-full"
                        />
                        
                        <EstimatesWidget 
                          estimates={estimates}
                          onViewAll={() => {}}
                          onCreateEstimate={() => {}}
                          onApproveEstimate={(id) => {}}
                          onRejectEstimate={(id) => {}}
                          onDownloadEstimate={(id) => {}}
                          userType="client"
                          className="h-full"
                        />
                      </div>
                      
                      <Card className="bg-white dark:bg-gray-800">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Payment History</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Record of all transactions</p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              <tr>
                                <th className="px-6 py-3 text-left">Invoice</th>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Amount</th>
                                <th className="px-6 py-3 text-left">Payment Method</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/70">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                  INV-2025-003
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  Mar 15, 2025
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {formatCurrency(1500)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  Visa •••• 4242
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <Badge variant="success">Paid</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button size="sm" variant="ghost" leftIcon={<FileText size={14} />}>
                                    Receipt
                                  </Button>
                                </td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/70">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                  INV-2025-002
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  Feb 15, 2025
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {formatCurrency(1500)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  Visa •••• 4242
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <Badge variant="success">Paid</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button size="sm" variant="ghost" leftIcon={<FileText size={14} />}>
                                    Receipt
                                  </Button>
                                </td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/70">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                  INV-2025-001
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  Jan 15, 2025
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {formatCurrency(1500)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  Visa •••• 4242
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <Badge variant="success">Paid</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button size="sm" variant="ghost" leftIcon={<FileText size={14} />}>
                                    Receipt
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )
            } 
          />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/support" element={<SupportPage />} />
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

export default ClientDashboard;