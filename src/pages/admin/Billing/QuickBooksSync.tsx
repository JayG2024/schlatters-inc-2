import React, { useState } from 'react';
import { 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  X,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Clock,
  Play,
  Pause,
  Eye
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Progress from '../../../components/ui/Progress';
import { formatCurrency, formatDateTime } from '../../../lib/utils';

interface SyncStatus {
  id: string;
  type: 'invoices' | 'payments' | 'customers' | 'items';
  lastSync: string;
  status: 'success' | 'error' | 'syncing' | 'pending';
  recordsProcessed: number;
  totalRecords: number;
  errorMessage?: string;
}

interface SyncHistory {
  id: string;
  timestamp: string;
  type: 'invoices' | 'payments' | 'customers' | 'items' | 'all';
  status: 'success' | 'error' | 'partial';
  recordsProcessed: number;
  totalRecords: number;
  duration: number; // in seconds
  errorDetails?: string;
}

const mockSyncStatus: SyncStatus[] = [
  {
    id: '1',
    type: 'invoices',
    lastSync: '2025-05-10T14:30:00',
    status: 'success',
    recordsProcessed: 127,
    totalRecords: 127,
  },
  {
    id: '2',
    type: 'payments',
    lastSync: '2025-05-10T14:25:00',
    status: 'success',
    recordsProcessed: 89,
    totalRecords: 89,
  },
  {
    id: '3',
    type: 'customers',
    lastSync: '2025-05-10T09:15:00',
    status: 'error',
    recordsProcessed: 45,
    totalRecords: 67,
    errorMessage: 'Authentication token expired',
  },
  {
    id: '4',
    type: 'items',
    lastSync: '2025-05-09T16:45:00',
    status: 'syncing',
    recordsProcessed: 12,
    totalRecords: 25,
  },
];

const mockSyncHistory: SyncHistory[] = [
  {
    id: '1',
    timestamp: '2025-05-10T14:30:00',
    type: 'all',
    status: 'success',
    recordsProcessed: 263,
    totalRecords: 263,
    duration: 45,
  },
  {
    id: '2',
    timestamp: '2025-05-10T09:15:00',
    type: 'customers',
    status: 'error',
    recordsProcessed: 45,
    totalRecords: 67,
    duration: 12,
    errorDetails: 'Authentication token expired. Please re-authenticate with QuickBooks.',
  },
  {
    id: '3',
    timestamp: '2025-05-09T16:45:00',
    type: 'invoices',
    status: 'success',
    recordsProcessed: 34,
    totalRecords: 34,
    duration: 18,
  },
  {
    id: '4',
    timestamp: '2025-05-09T11:20:00',
    type: 'payments',
    status: 'partial',
    recordsProcessed: 78,
    totalRecords: 89,
    duration: 25,
    errorDetails: '11 payment records failed due to invalid merchant account references.',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'success':
      return <Badge variant="success">Success</Badge>;
    case 'error':
      return <Badge variant="danger">Error</Badge>;
    case 'syncing':
      return <Badge variant="warning">Syncing</Badge>;
    case 'pending':
      return <Badge variant="info">Pending</Badge>;
    case 'partial':
      return <Badge variant="warning">Partial</Badge>;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'invoices':
      return <FileText size={20} className="text-blue-600" />;
    case 'payments':
      return <DollarSign size={20} className="text-green-600" />;
    case 'customers':
      return <Users size={20} className="text-purple-600" />;
    case 'items':
      return <Settings size={20} className="text-amber-600" />;
    case 'all':
      return <Zap size={20} className="text-indigo-600" />;
  }
};

const QuickBooksSyncPage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState<SyncHistory | null>(null);
  
  const handleConnect = () => {
    console.log('Connecting to QuickBooks...');
    // In a real app, this would initiate OAuth flow
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    console.log('Disconnecting from QuickBooks...');
  };

  const handleManualSync = (type: string) => {
    console.log(`Starting manual sync for ${type}...`);
    // In a real app, this would trigger sync
  };

  const handleViewHistory = (history: SyncHistory) => {
    setSelectedHistory(history);
  };

  const handleCloseHistory = () => {
    setSelectedHistory(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QuickBooks Integration</h1>
          <p className="text-gray-600 mt-1">Sync your financial data with QuickBooks Online</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle size={14} />
                Connected
              </Badge>
              <Button leftIcon={<RefreshCw size={16} />} onClick={() => handleManualSync('all')}>
                Sync All
              </Button>
              <Button variant="outline" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </>
          ) : (
            <>
              <Badge variant="danger" className="flex items-center gap-1">
                <X size={14} />
                Disconnected
              </Badge>
              <Button leftIcon={<Zap size={16} />} onClick={handleConnect}>
                Connect to QuickBooks
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <Card className={`${isConnected ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
                {isConnected ? (
                  <CheckCircle size={24} className="text-green-600" />
                ) : (
                  <X size={24} className="text-red-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {isConnected ? 'QuickBooks Connected' : 'QuickBooks Disconnected'}
                </h3>
                <p className="text-gray-600">
                  {isConnected 
                    ? 'Your data is automatically syncing with QuickBooks Online'
                    : 'Connect your QuickBooks account to enable automatic data synchronization'
                  }
                </p>
              </div>
            </div>
            
            {isConnected && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Company:</div>
                <div className="font-medium">Schlatter's Inc.</div>
                <div className="text-xs text-gray-500 mt-1">
                  Last sync: {formatDateTime(mockSyncStatus[0].lastSync)}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isConnected && (
        <>
          {/* Sync Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Sync Settings</CardTitle>
              <CardDescription>Configure how data is synchronized with QuickBooks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Automatic Sync</h4>
                    <p className="text-sm text-gray-600">Automatically sync data every hour</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSyncEnabled}
                      onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sync Frequency
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="hourly">Every Hour</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Error Notification
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="immediate">Immediate</option>
                      <option value="daily">Daily Summary</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sync Status */}
          <Card>
            <CardHeader>
              <CardTitle>Sync Status</CardTitle>
              <CardDescription>Current status of data synchronization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockSyncStatus.map((sync) => (
                  <div key={sync.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(sync.type)}
                        <span className="font-medium capitalize">{sync.type}</span>
                      </div>
                      {getStatusBadge(sync.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        Last sync: {formatDateTime(sync.lastSync)}
                      </div>
                      
                      {sync.status === 'syncing' ? (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{Math.round((sync.recordsProcessed / sync.totalRecords) * 100)}%</span>
                          </div>
                          <Progress value={(sync.recordsProcessed / sync.totalRecords) * 100} size="sm" />
                          <div className="text-xs text-gray-500 mt-1">
                            {sync.recordsProcessed} of {sync.totalRecords} records
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          {sync.recordsProcessed} of {sync.totalRecords} records processed
                        </div>
                      )}
                      
                      {sync.errorMessage && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {sync.errorMessage}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <Button 
                        size="sm" 
                        variant="outline"
                        leftIcon={<RefreshCw size={14} />}
                        onClick={() => handleManualSync(sync.type)}
                        disabled={sync.status === 'syncing'}
                      >
                        Sync
                      </Button>
                      
                      {sync.status === 'syncing' && (
                        <Button size="sm" variant="ghost" leftIcon={<Pause size={14} />}>
                          Pause
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sync History */}
          <Card>
            <CardHeader>
              <CardTitle>Sync History</CardTitle>
              <CardDescription>Recent synchronization activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Date & Time</th>
                      <th className="px-6 py-3 text-left">Type</th>
                      <th className="px-6 py-3 text-left">Records</th>
                      <th className="px-6 py-3 text-left">Duration</th>
                      <th className="px-6 py-3 text-center">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {mockSyncHistory.map((history) => (
                      <tr key={history.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(history.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(history.type)}
                            <span className="text-sm font-medium capitalize">{history.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {history.recordsProcessed} / {history.totalRecords}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {history.duration}s
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {getStatusBadge(history.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<Eye size={14} />}
                            onClick={() => handleViewHistory(history)}
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* History Detail Modal */}
      {selectedHistory && (
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sync Details</CardTitle>
              <CardDescription>
                {formatDateTime(selectedHistory.timestamp)} • {selectedHistory.type} sync
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(selectedHistory.status)}
              <Button 
                variant="ghost" 
                size="sm"
                leftIcon={<X size={16} />}
                onClick={handleCloseHistory}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Sync Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{selectedHistory.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span>{getStatusBadge(selectedHistory.status)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Records Processed:</span>
                    <span className="font-medium">{selectedHistory.recordsProcessed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Records:</span>
                    <span className="font-medium">{selectedHistory.totalRecords}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedHistory.duration} seconds</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-medium">
                      {Math.round((selectedHistory.recordsProcessed / selectedHistory.totalRecords) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Progress</h3>
                <Progress 
                  value={(selectedHistory.recordsProcessed / selectedHistory.totalRecords) * 100}
                  className="mb-3"
                />
                
                {selectedHistory.errorDetails && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <h4 className="text-sm font-medium text-red-800 mb-1">Error Details</h4>
                    <p className="text-sm text-red-600">{selectedHistory.errorDetails}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickBooksSyncPage;