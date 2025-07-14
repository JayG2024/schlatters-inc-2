import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Target,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  Mail,
  CreditCard,
  Users,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  RotateCw,
  User,
  Briefcase,
  AlertCircle,
  ChevronDown,
  MessageSquare,
  Search,
  Filter,
  Download
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Progress from '../../../components/ui/Progress';
import { formatDate } from '../../../lib/utils';

interface OnboardingClient {
  id: string;
  name: string;
  company: string;
  email: string;
  startDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  progress: number;
  assignedTo: string;
  nextAction: string;
  nextActionDue: string;
  tasks: OnboardingTask[];
}

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  category: 'account_setup' | 'technical' | 'training' | 'billing' | 'other';
}

interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  taskCount: number;
  estimatedDuration: string;
  lastModified: string;
}

// Mock data for onboarding clients
const mockOnboardingClients: OnboardingClient[] = [
  {
    id: '1',
    name: 'Amanda Martinez',
    company: 'Horizon Group',
    email: 'amanda.m@horizongroup.com',
    startDate: '2025-05-10',
    status: 'in_progress',
    progress: 65,
    assignedTo: 'Jane Smith',
    nextAction: 'Schedule technical training session',
    nextActionDue: '2025-05-20',
    tasks: [
      {
        id: '1-1',
        title: 'Initial consultation call',
        description: 'Introductory call to discuss needs and expectations',
        dueDate: '2025-05-12',
        status: 'completed',
        assignedTo: 'Jane Smith',
        priority: 'high',
        category: 'account_setup'
      },
      {
        id: '1-2',
        title: 'Set up client account',
        description: 'Create user accounts and configure initial permissions',
        dueDate: '2025-05-15',
        status: 'completed',
        assignedTo: 'Jane Smith',
        priority: 'high',
        category: 'technical'
      },
      {
        id: '1-3',
        title: 'Configure services',
        description: 'Set up requested services based on client needs',
        dueDate: '2025-05-18',
        status: 'in_progress',
        assignedTo: 'Mike Wilson',
        priority: 'medium',
        category: 'technical'
      },
      {
        id: '1-4',
        title: 'Technical training session',
        description: 'Train client on system functionality and features',
        dueDate: '2025-05-22',
        status: 'not_started',
        assignedTo: 'Jane Smith',
        priority: 'medium',
        category: 'training'
      },
      {
        id: '1-5',
        title: 'Set up billing information',
        description: 'Configure payment methods and billing cycles',
        dueDate: '2025-05-25',
        status: 'not_started',
        assignedTo: 'John Doe',
        priority: 'medium',
        category: 'billing'
      }
    ]
  },
  {
    id: '2',
    name: 'Lisa Brown',
    company: 'ABC Industries',
    email: 'lisa.brown@abcindustries.com',
    startDate: '2025-05-08',
    status: 'not_started',
    progress: 0,
    assignedTo: 'John Doe',
    nextAction: 'Schedule initial consultation call',
    nextActionDue: '2025-05-12',
    tasks: [
      {
        id: '2-1',
        title: 'Initial consultation call',
        description: 'Introductory call to discuss needs and expectations',
        dueDate: '2025-05-12',
        status: 'not_started',
        assignedTo: 'John Doe',
        priority: 'high',
        category: 'account_setup'
      },
      {
        id: '2-2',
        title: 'Set up client account',
        description: 'Create user accounts and configure initial permissions',
        dueDate: '2025-05-15',
        status: 'not_started',
        assignedTo: 'Jane Smith',
        priority: 'high',
        category: 'technical'
      }
    ]
  },
  {
    id: '3',
    name: 'Robert Taylor',
    company: 'Taylor Consulting',
    email: 'robert@taylorconsulting.com',
    startDate: '2025-04-20',
    status: 'completed',
    progress: 100,
    assignedTo: 'Mike Wilson',
    nextAction: 'Follow-up check-in call',
    nextActionDue: '2025-05-15',
    tasks: [
      {
        id: '3-1',
        title: 'Initial consultation call',
        description: 'Introductory call to discuss needs and expectations',
        dueDate: '2025-04-22',
        status: 'completed',
        assignedTo: 'Mike Wilson',
        priority: 'high',
        category: 'account_setup'
      },
      {
        id: '3-2',
        title: 'Set up client account',
        description: 'Create user accounts and configure initial permissions',
        dueDate: '2025-04-25',
        status: 'completed',
        assignedTo: 'Jane Smith',
        priority: 'high',
        category: 'technical'
      },
      {
        id: '3-3',
        title: 'Technical training session',
        description: 'Train client on system functionality and features',
        dueDate: '2025-04-29',
        status: 'completed',
        assignedTo: 'Mike Wilson',
        priority: 'medium',
        category: 'training'
      },
      {
        id: '3-4',
        title: 'Set up billing information',
        description: 'Configure payment methods and billing cycles',
        dueDate: '2025-05-02',
        status: 'completed',
        assignedTo: 'John Doe',
        priority: 'medium',
        category: 'billing'
      },
      {
        id: '3-5',
        title: 'Follow-up feedback session',
        description: 'Collect initial feedback and address any concerns',
        dueDate: '2025-05-05',
        status: 'completed',
        assignedTo: 'Mike Wilson',
        priority: 'low',
        category: 'other'
      }
    ]
  },
  {
    id: '4',
    name: 'David Chen',
    company: 'Innovate LLC',
    email: 'david.chen@innovatellc.com',
    startDate: '2025-05-05',
    status: 'in_progress',
    progress: 30,
    assignedTo: 'Jane Smith',
    nextAction: 'Technical setup and configuration',
    nextActionDue: '2025-05-15',
    tasks: [
      {
        id: '4-1',
        title: 'Initial consultation call',
        description: 'Introductory call to discuss needs and expectations',
        dueDate: '2025-05-07',
        status: 'completed',
        assignedTo: 'Jane Smith',
        priority: 'high',
        category: 'account_setup'
      },
      {
        id: '4-2',
        title: 'Set up client account',
        description: 'Create user accounts and configure initial permissions',
        dueDate: '2025-05-12',
        status: 'in_progress',
        assignedTo: 'Mike Wilson',
        priority: 'high',
        category: 'technical'
      },
      {
        id: '4-3',
        title: 'Technical training session',
        description: 'Train client on system functionality and features',
        dueDate: '2025-05-20',
        status: 'not_started',
        assignedTo: 'Jane Smith',
        priority: 'medium',
        category: 'training'
      }
    ]
  },
  {
    id: '5',
    name: 'Jennifer Garcia',
    company: 'Premier Services',
    email: 'jennifer@premierservices.com',
    startDate: '2025-05-01',
    status: 'on_hold',
    progress: 45,
    assignedTo: 'John Doe',
    nextAction: 'Awaiting contract approval',
    nextActionDue: '2025-05-15',
    tasks: [
      {
        id: '5-1',
        title: 'Initial consultation call',
        description: 'Introductory call to discuss needs and expectations',
        dueDate: '2025-05-03',
        status: 'completed',
        assignedTo: 'John Doe',
        priority: 'high',
        category: 'account_setup'
      },
      {
        id: '5-2',
        title: 'Set up client account',
        description: 'Create user accounts and configure initial permissions',
        dueDate: '2025-05-08',
        status: 'completed',
        assignedTo: 'Mike Wilson',
        priority: 'high',
        category: 'technical'
      },
      {
        id: '5-3',
        title: 'Contract finalization',
        description: 'Get contract approved and signed',
        dueDate: '2025-05-15',
        status: 'blocked',
        assignedTo: 'John Doe',
        priority: 'high',
        category: 'account_setup'
      }
    ]
  }
];

// Mock data for onboarding templates
const mockOnboardingTemplates: OnboardingTemplate[] = [
  {
    id: '1',
    name: 'Standard Onboarding',
    description: 'Default onboarding process for new clients',
    taskCount: 8,
    estimatedDuration: '2 weeks',
    lastModified: '2025-04-15'
  },
  {
    id: '2',
    name: 'Premium Onboarding',
    description: 'Enhanced onboarding with additional training',
    taskCount: 12,
    estimatedDuration: '3 weeks',
    lastModified: '2025-04-20'
  },
  {
    id: '3',
    name: 'Fast Track Setup',
    description: 'Expedited onboarding for urgent deployments',
    taskCount: 5,
    estimatedDuration: '1 week',
    lastModified: '2025-04-25'
  },
  {
    id: '4',
    name: 'Enterprise Implementation',
    description: 'Comprehensive setup for large organizations',
    taskCount: 15,
    estimatedDuration: '4-6 weeks',
    lastModified: '2025-05-01'
  }
];

// Helper functions for status badges and icons
const getStatusBadge = (status: OnboardingClient['status'] | OnboardingTask['status']) => {
  switch (status) {
    case 'not_started':
      return <Badge variant="default">Not Started</Badge>;
    case 'in_progress':
      return <Badge variant="primary">In Progress</Badge>;
    case 'completed':
      return <Badge variant="success">Completed</Badge>;
    case 'on_hold':
      return <Badge variant="warning">On Hold</Badge>;
    case 'blocked':
      return <Badge variant="danger">Blocked</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

const getPriorityBadge = (priority: OnboardingTask['priority']) => {
  switch (priority) {
    case 'low':
      return <Badge variant="default">Low</Badge>;
    case 'medium':
      return <Badge variant="warning">Medium</Badge>;
    case 'high':
      return <Badge variant="danger">High</Badge>;
  }
};

const getCategoryBadge = (category: OnboardingTask['category']) => {
  switch (category) {
    case 'account_setup':
      return <Badge variant="primary">Account Setup</Badge>;
    case 'technical':
      return <Badge variant="info">Technical</Badge>;
    case 'training':
      return <Badge variant="success">Training</Badge>;
    case 'billing':
      return <Badge variant="warning">Billing</Badge>;
    case 'other':
      return <Badge variant="default">Other</Badge>;
  }
};

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'clients' | 'templates'>('clients');
  const [selectedClient, setSelectedClient] = useState<OnboardingClient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed' | 'on_hold'>('all');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  // Filter clients based on search term and status
  const filteredClients = mockOnboardingClients.filter(client => {
    // Filter by status (billable/non-billable)
    if (statusFilter !== 'all' && client.status !== statusFilter) return false;
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        client.name.toLowerCase().includes(search) ||
        client.company.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search)
      );
    }
    
    return true;
  });
  
  const handleViewClient = (client: OnboardingClient) => {
    setSelectedClient(client);
  };
  
  const handleCloseClient = () => {
    setSelectedClient(null);
  };
  
  const handleGoBack = () => {
    navigate('/admin/clients');
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={handleGoBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to Clients</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Client Onboarding</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage client onboarding processes and track progress</p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'clients'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('clients')}
          >
            Clients
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'templates'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('templates')}
          >
            Onboarding Templates
          </button>
        </div>
      </div>
      
      {/* Clients Tab */}
      {activeTab === 'clients' && !selectedClient && (
        <div className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search clients..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
            
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full sm:w-48 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
            
            <Button leftIcon={<Filter size={16} />} variant="outline">
              More Filters
            </Button>
            
            <Button leftIcon={<Download size={16} />} variant="outline">
              Export
            </Button>
            
            <Button 
              leftIcon={<Plus size={16} />}
              onClick={() => setShowAddClientModal(true)}
            >
              Start Onboarding
            </Button>
          </div>
          
          {/* Onboarding Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mockOnboardingClients.length}</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                    <Users size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {mockOnboardingClients.filter(c => c.status === 'in_progress').length}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                    <RotateCw size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Not Started</p>
                    <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                      {mockOnboardingClients.filter(c => c.status === 'not_started').length}
                    </p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <Clock size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {mockOnboardingClients.filter(c => c.status === 'completed').length}
                    </p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-md">
                    <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Clients List */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Client Onboarding Status</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Track onboarding progress for all clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClients.length > 0 ? (
                  filteredClients.map(client => (
                    <div 
                      key={client.id} 
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                      onClick={() => handleViewClient(client)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium mr-3">
                              {client.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{client.name}</h3>
                              <p className="text-gray-500 dark:text-gray-400">{client.company}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-3 items-center text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
                              <span>Started: {formatDate(new Date(client.startDate))}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User size={14} className="text-gray-400 dark:text-gray-500" />
                              <span>Assigned: {client.assignedTo}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          {getStatusBadge(client.status)}
                          
                          <div className="mt-3 w-full max-w-[200px]">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500 dark:text-gray-400">Progress</span>
                              <span className="text-gray-700 dark:text-gray-300">{client.progress}%</span>
                            </div>
                            <Progress 
                              value={client.progress} 
                              variant={
                                client.progress === 100 ? 'success' :
                                client.status === 'on_hold' ? 'warning' :
                                client.progress > 50 ? 'primary' : 'default'
                              }
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Next Action: </span>
                            {client.nextAction}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Due: {formatDate(new Date(client.nextActionDue))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Target size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No clients found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'No clients match your current filters.'
                        : 'No clients are currently in the onboarding process.'}
                    </p>
                    <Button 
                      leftIcon={<Plus size={16} />}
                      onClick={() => setShowAddClientModal(true)}
                    >
                      Start Onboarding
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Selected Client Details */}
      {activeTab === 'clients' && selectedClient && (
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <button
              onClick={handleCloseClient}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Back to All Clients</span>
            </button>
            
            <div className="flex gap-2">
              <Button variant="outline" leftIcon={<Edit size={16} />}>
                Edit
              </Button>
              <Button>Update Status</Button>
            </div>
          </div>
          
          {/* Client Overview */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium mr-4">
                    {selectedClient.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-gray-900 dark:text-gray-100">{selectedClient.name}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">{selectedClient.company}</CardDescription>
                  </div>
                </div>
                <div>
                  {getStatusBadge(selectedClient.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">Started: {formatDate(new Date(selectedClient.startDate))}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">Assigned to: {selectedClient.assignedTo}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Onboarding Progress</h3>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{selectedClient.progress}%</div>
                    <Progress 
                      value={selectedClient.progress} 
                      variant={
                        selectedClient.progress === 100 ? 'success' :
                        selectedClient.status === 'on_hold' ? 'warning' :
                        selectedClient.progress > 50 ? 'primary' : 'default'
                      }
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>{selectedClient.tasks.filter(t => t.status === 'completed').length}/{selectedClient.tasks.length} tasks completed</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next Action</h3>
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{selectedClient.nextAction}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar size={12} />
                        <span>Due: {formatDate(new Date(selectedClient.nextActionDue))}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="mt-3"
                      onClick={() => setShowTaskModal(true)}
                    >
                      Complete Action
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Onboarding Tasks */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Onboarding Tasks</h3>
                  <Button size="sm" leftIcon={<Plus size={14} />}>
                    Add Task
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {selectedClient.tasks.map((task, index) => (
                    <div 
                      key={task.id} 
                      className={`p-4 border rounded-lg ${
                        task.status === 'completed' 
                          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                          : task.status === 'blocked'
                          ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{index + 1}. {task.title}</span>
                            {task.status === 'completed' && <CheckCircle size={16} className="text-green-500 dark:text-green-400" />}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                          <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>Due: {formatDate(new Date(task.dueDate))}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User size={12} />
                              <span>Assigned: {task.assignedTo}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            {getStatusBadge(task.status)}
                            {getPriorityBadge(task.priority)}
                            {getCategoryBadge(task.category)}
                          </div>
                          
                          <div className="flex gap-2">
                            {task.status !== 'completed' && (
                              <Button size="sm" leftIcon={<CheckCircle size={14} />}>
                                Complete
                              </Button>
                            )}
                            <Button size="sm" variant="outline" leftIcon={<Edit size={14} />}>
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Notes and Activity */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Notes & Activity</h3>
                
                <div className="border-l-2 border-blue-200 dark:border-blue-800 pl-4 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                        JS
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Jane Smith</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">2 days ago</span>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 ml-10">
                      <p>Completed initial consultation call. Client is eager to get started with our services.</p>
                      <p className="mt-1">Key needs identified: data migration, user training, and custom reporting.</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-medium text-sm">
                        MW
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Mike Wilson</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">1 day ago</span>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 ml-10">
                      <p>Started technical setup. Created user accounts for admin and department heads.</p>
                      <p className="mt-1">Still waiting for complete user list for remaining accounts.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Add a note or update..."
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <Button size="sm">Add Note</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Onboarding Templates</h2>
            <Button leftIcon={<Plus size={16} />}>Create Template</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockOnboardingTemplates.map(template => (
              <Card key={template.id} className="bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{template.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
                    </div>
                    <div className="flex">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        leftIcon={<Edit size={14} />}
                        className="mr-1 text-gray-600 dark:text-gray-400"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-750 p-3 rounded-lg text-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{template.taskCount}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Tasks</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-750 p-3 rounded-lg text-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{template.estimatedDuration}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Last modified: {formatDate(new Date(template.lastModified))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    rightIcon={<ChevronRight size={14} />}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Template Components Section */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Template Components</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Building blocks for creating onboarding templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Briefcase size={16} className="text-blue-600 dark:text-blue-400" />
                      Account Setup Tasks
                    </h3>
                    <Button size="sm" variant="ghost" rightIcon={<ChevronDown size={14} />} className="text-gray-600 dark:text-gray-400">
                      View
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Core tasks for setting up new client accounts, including consultations and account creation.
                  </p>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Target size={16} className="text-green-600 dark:text-green-400" />
                      Training Components
                    </h3>
                    <Button size="sm" variant="ghost" rightIcon={<ChevronDown size={14} />} className="text-gray-600 dark:text-gray-400">
                      View
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Various training modules and sessions to be included in client onboarding.
                  </p>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <CreditCard size={16} className="text-amber-600 dark:text-amber-400" />
                      Billing Setup Tasks
                    </h3>
                    <Button size="sm" variant="ghost" rightIcon={<ChevronDown size={14} />} className="text-gray-600 dark:text-gray-400">
                      View
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tasks related to setting up payment methods, billing cycles, and invoicing.
                  </p>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <FileText size={16} className="text-purple-600 dark:text-purple-400" />
                      Documentation Tasks
                    </h3>
                    <Button size="sm" variant="ghost" rightIcon={<ChevronDown size={14} />} className="text-gray-600 dark:text-gray-400">
                      View
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Document preparation, contract generation, and signature collection tasks.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Add Client to Onboarding Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Start Client Onboarding</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Client
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option value="">Select a client</option>
                  <option value="1">Acme Corp</option>
                  <option value="2">TechSolutions Inc</option>
                  <option value="3">Global Ventures</option>
                  <option value="4">Premier Services</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Onboarding Template
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option value="1">Standard Onboarding</option>
                  <option value="2">Premium Onboarding</option>
                  <option value="3">Fast Track Setup</option>
                  <option value="4">Enterprise Implementation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assigned To
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option value="1">Jane Smith</option>
                  <option value="2">John Doe</option>
                  <option value="3">Mike Wilson</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input 
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md mb-6">
              <div className="flex items-start">
                <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-medium mb-1">Starting the onboarding process will:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Create a new onboarding plan for this client</li>
                    <li>Generate all required tasks based on the template</li>
                    <li>Send a welcome email to the client (optional)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowAddClientModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setShowAddClientModal(false);
                  // In a real app, this would create the onboarding process
                }}
              >
                Start Onboarding
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Task Completion Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Complete Task</h2>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Schedule technical training session</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Set up and confirm technical training with client team.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Completion Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={4}
                  placeholder="Enter details about the task completion..."
                />
              </div>
              
              <div>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 mr-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Send notification to client</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Next Action
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="What's the next step?"
                  defaultValue="Conduct technical training session"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Next Action Due Date
                </label>
                <input 
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  defaultValue="2025-05-22"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowTaskModal(false)}
              >
                Cancel
              </Button>
              <Button 
                leftIcon={<CheckCircle size={16} />}
                onClick={() => {
                  setShowTaskModal(false);
                  // In a real app, this would mark the task as complete
                }}
              >
                Complete Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;