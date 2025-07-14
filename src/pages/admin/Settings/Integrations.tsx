import React, { useState } from 'react';
import { 
  Zap, 
  CheckCircle, 
  X, 
  RefreshCw, 
  ExternalLink, 
  Settings, 
  AlertCircle, 
  Download, 
  Upload, 
  Calendar, 
  Mail, 
  Phone, 
  FileText, 
  Clock, 
  Info, 
  Shield, 
  Link, 
  Unlink
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Progress from '../../../components/ui/Progress';

interface IntegrationStatus {
  id: string;
  name: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  accountInfo?: string;
  errorMessage?: string;
  features: string[];
  logo: string;
}

const integrations: IntegrationStatus[] = [
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    provider: 'Intuit',
    status: 'connected',
    lastSync: '2025-05-10T14:30:00',
    accountInfo: 'Schlatter\'s Inc. (admin@schlattersinc.com)',
    features: ['Invoices', 'Payments', 'Customers', 'Chart of Accounts'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/QuickBooks_Logo.svg'
  },
  {
    id: 'openphone',
    name: 'OpenPhone',
    provider: 'OpenPhone Inc.',
    status: 'connected',
    lastSync: '2025-05-10T14:30:00',
    accountInfo: 'Schlatter\'s Inc. Business Account',
    features: ['Call Tracking', 'SMS', 'Call Recording', 'Transcription'],
    logo: 'https://assets-global.website-files.com/5d99a5ad9d3b4f7f3bedf1a3/5d99a5ad9d3b4f0b4bedf1e8_openphone-icon.svg'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    provider: 'Google',
    status: 'disconnected',
    features: ['Email Sync', 'Contact Import', 'Calendar Integration'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg'
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    provider: 'Google',
    status: 'disconnected',
    features: ['Appointment Sync', 'Event Management', 'Availability'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg'
  }
];

const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'connected' | 'available'>('all');
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  
  const filteredIntegrations = integrations.filter(integration => {
    if (activeTab === 'connected') {
      return integration.status === 'connected';
    } else if (activeTab === 'available') {
      return integration.status !== 'connected';
    }
    return true;
  });
  
  const handleConnect = (integrationId: string) => {
    setIsConnecting(integrationId);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(null);
      // In a real app, this would redirect to the OAuth flow
      window.open(`https://example.com/connect/${integrationId}`, '_blank');
    }, 1000);
  };
  
  const handleSync = (integrationId: string) => {
    setIsSyncing(integrationId);
    
    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(null);
    }, 2000);
  };
  
  const handleDisconnect = (integrationId: string) => {
    // In a real app, this would disconnect the integration
    console.log(`Disconnecting ${integrationId}`);
  };
  
  const handleViewDetails = (integrationId: string) => {
    setSelectedIntegration(integrationId);
  };
  
  const handleCloseDetails = () => {
    setSelectedIntegration(null);
  };
  
  const getSelectedIntegration = () => {
    return integrations.find(i => i.id === selectedIntegration);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Integrations</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Connect with third-party services and APIs</p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Integrations
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'connected'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('connected')}
          >
            Connected
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'available'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('available')}
          >
            Available
          </button>
        </div>
      </div>
      
      {/* Integration Details */}
      {selectedIntegration && (
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={getSelectedIntegration()?.logo} 
                alt={getSelectedIntegration()?.name} 
                className="h-12 w-12 object-contain"
              />
              <div>
                <CardTitle>{getSelectedIntegration()?.name}</CardTitle>
                <CardDescription>
                  {getSelectedIntegration()?.provider}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={
                  getSelectedIntegration()?.status === 'connected' ? 'success' : 
                  getSelectedIntegration()?.status === 'error' ? 'danger' : 
                  'default'
                }
              >
                {getSelectedIntegration()?.status === 'connected' ? 'Connected' : 
                 getSelectedIntegration()?.status === 'error' ? 'Error' : 
                 'Disconnected'}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                leftIcon={<X size={16} />}
                onClick={handleCloseDetails}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Integration Details</h3>
                <div className="space-y-3">
                  {getSelectedIntegration()?.status === 'connected' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Account:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{getSelectedIntegration()?.accountInfo}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Last Synced:</span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {getSelectedIntegration()?.lastSync ? new Date(getSelectedIntegration()?.lastSync).toLocaleString() : 'Never'}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">{getSelectedIntegration()?.status}</span>
                  </div>
                </div>
                
                {getSelectedIntegration()?.status === 'error' && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-300">Connection Error</h4>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {getSelectedIntegration()?.errorMessage || 'There was an error connecting to this service. Please check your credentials and try again.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Features</h3>
                <div className="space-y-2">
                  {getSelectedIntegration()?.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-750 rounded-md">
                      <CheckCircle size={16} className="text-green-500 dark:text-green-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {getSelectedIntegration()?.id === 'quickbooks' && getSelectedIntegration()?.status === 'connected' && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Sync Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Invoices</span>
                      <Badge variant="success">Synced</Badge>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Last sync: 10 minutes ago</div>
                    <Progress value={100} size="sm" className="mt-2" />
                  </div>
                  
                  <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Payments</span>
                      <Badge variant="success">Synced</Badge>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Last sync: 10 minutes ago</div>
                    <Progress value={100} size="sm" className="mt-2" />
                  </div>
                  
                  <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Customers</span>
                      <Badge variant="success">Synced</Badge>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Last sync: 10 minutes ago</div>
                    <Progress value={100} size="sm" className="mt-2" />
                  </div>
                  
                  <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Chart of Accounts</span>
                      <Badge variant="success">Synced</Badge>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Last sync: 10 minutes ago</div>
                    <Progress value={100} size="sm" className="mt-2" />
                  </div>
                </div>
              </div>
            )}
            
            {getSelectedIntegration()?.id === 'openphone' && getSelectedIntegration()?.status === 'connected' && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Phone Numbers</h3>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">+1 (555) 123-4567</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Main Line</div>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  
                  <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">+1 (555) 987-6543</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Support Line</div>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-4">
            {getSelectedIntegration()?.status === 'connected' ? (
              <>
                <Button 
                  variant="outline" 
                  leftIcon={<Settings size={16} />}
                >
                  Configure
                </Button>
                <Button 
                  variant="outline" 
                  leftIcon={isSyncing === selectedIntegration ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                  onClick={() => handleSync(selectedIntegration)}
                  disabled={isSyncing === selectedIntegration}
                >
                  {isSyncing === selectedIntegration ? 'Syncing...' : 'Sync Now'}
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  leftIcon={<Unlink size={16} />}
                  onClick={() => handleDisconnect(selectedIntegration)}
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button 
                leftIcon={isConnecting === selectedIntegration ? <RefreshCw size={16} className="animate-spin" /> : <Link size={16} />}
                onClick={() => handleConnect(selectedIntegration)}
                disabled={isConnecting === selectedIntegration}
              >
                {isConnecting === selectedIntegration ? 'Connecting...' : 'Connect'}
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
      
      {/* Integrations Grid */}
      {!selectedIntegration && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QuickBooks Integration */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e1/QuickBooks_Logo.svg" 
                    alt="QuickBooks" 
                    className="h-12 w-12 object-contain"
                  />
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">QuickBooks</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Sync financial data with QuickBooks</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Invoices</Badge>
                      <Badge variant="default">Payments</Badge>
                      <Badge variant="default">Customers</Badge>
                    </div>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last synced: 10 minutes ago
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    leftIcon={<ExternalLink size={14} />}
                    onClick={() => handleViewDetails('quickbooks')}
                  >
                    Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    leftIcon={<RefreshCw size={14} />}
                    onClick={() => handleSync('quickbooks')}
                  >
                    Sync
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* OpenPhone Integration */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <img 
                    src="https://assets-global.website-files.com/5d99a5ad9d3b4f7f3bedf1a3/5d99a5ad9d3b4f0b4bedf1e8_openphone-icon.svg" 
                    alt="OpenPhone" 
                    className="h-12 w-12 object-contain"
                  />
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">OpenPhone</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Track calls and messages</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Call Tracking</Badge>
                      <Badge variant="default">Recording</Badge>
                      <Badge variant="default">SMS</Badge>
                    </div>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last synced: 10 minutes ago
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    leftIcon={<ExternalLink size={14} />}
                    onClick={() => handleViewDetails('openphone')}
                  >
                    Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    leftIcon={<RefreshCw size={14} />}
                    onClick={() => handleSync('openphone')}
                  >
                    Sync
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Gmail Integration */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" 
                    alt="Gmail" 
                    className="h-12 w-12 object-contain"
                  />
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">Gmail</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Sync emails and contacts</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Email Sync</Badge>
                      <Badge variant="default">Contact Import</Badge>
                      <Badge variant="default">Email Templates</Badge>
                    </div>
                  </div>
                </div>
                <Badge variant="default">Disconnected</Badge>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Not connected
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    leftIcon={<ExternalLink size={14} />}
                    onClick={() => handleViewDetails('gmail')}
                  >
                    Details
                  </Button>
                  <Button 
                    size="sm"
                    leftIcon={<Link size={14} />}
                    onClick={() => handleConnect('gmail')}
                  >
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Google Calendar Integration */}
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" 
                    alt="Google Calendar" 
                    className="h-12 w-12 object-contain"
                  />
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">Google Calendar</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Sync appointments and events</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Appointment Sync</Badge>
                      <Badge variant="default">Event Management</Badge>
                      <Badge variant="default">Availability</Badge>
                    </div>
                  </div>
                </div>
                <Badge variant="default">Disconnected</Badge>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Not connected
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    leftIcon={<ExternalLink size={14} />}
                    onClick={() => handleViewDetails('google-calendar')}
                  >
                    Details
                  </Button>
                  <Button 
                    size="sm"
                    leftIcon={<Link size={14} />}
                    onClick={() => handleConnect('google-calendar')}
                  >
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Integration Requirements */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={20} className="text-blue-600 dark:text-blue-400" />
            Integration Requirements
          </CardTitle>
          <CardDescription>
            Information needed to set up each integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                QuickBooks Integration
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>To connect with QuickBooks, you'll need:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>QuickBooks Online company ID</li>
                  <li>Administrator credentials or dedicated integration user</li>
                  <li>API application keys (client ID and client secret)</li>
                  <li>Webhook endpoint verification token</li>
                </ul>
                <p className="mt-2">
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    <ExternalLink size={14} />
                    <span>View detailed QuickBooks setup guide</span>
                  </a>
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <Phone size={18} className="text-purple-600 dark:text-purple-400" />
                OpenPhone Integration
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>To connect with OpenPhone, you'll need:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>OpenPhone business account credentials</li>
                  <li>API key with appropriate permissions</li>
                  <li>Webhook secret for secure callbacks</li>
                  <li>Team member mapping information</li>
                </ul>
                <p className="mt-2">
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    <ExternalLink size={14} />
                    <span>View detailed OpenPhone setup guide</span>
                  </a>
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <Mail size={18} className="text-red-600 dark:text-red-400" />
                Gmail/Google Workspace Integration
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>To connect with Gmail and Google Workspace, you'll need:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Google Workspace administrator credentials</li>
                  <li>Domain verification access</li>
                  <li>API project credentials</li>
                  <li>Service account information</li>
                </ul>
                <p className="mt-2">
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    <ExternalLink size={14} />
                    <span>View detailed Google Workspace setup guide</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Security */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} className="text-green-600 dark:text-green-400" />
            Data Security
          </CardTitle>
          <CardDescription>
            How we protect your data across integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Secure Data Transfer</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                All data transfers use TLS 1.2 or higher encryption. API keys and secrets are transmitted securely, and webhook endpoints validate request signatures.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Authentication</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                We use OAuth 2.0 for API authentication, regular credential rotation, and IP restrictions where applicable to ensure secure access.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Compliance</h3>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Our integrations comply with GDPR for EU data subjects, CCPA for California residents, and industry-specific regulations as applicable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Integrations;