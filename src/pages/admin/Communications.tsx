import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { 
  Phone, 
  PhoneIncoming,
  PhoneOutgoing,
  MessageSquare, 
  Clock, 
  User,
  Shield,
  AlertCircle,
  FileText,
  Headphones,
  DollarSign,
  Timer,
  TrendingUp,
  PhoneCall,
  CheckCircle,
  XCircle,
  Activity,
  Loader2
} from 'lucide-react';
import { formatRelativeTime, formatDuration } from '../../lib/utils';
import { callsApi, realtimeSubscriptions } from '../../lib/supabase';
import { toast } from 'sonner';

interface CallerInfo {
  id: string;
  name: string;
  company?: string;
  phone: string;
  isSubscriber: boolean;
  subscriptionHoursRemaining?: number;
  totalHoursThisMonth?: number;
  lastCallDate?: string;
  totalRevenue?: number;
  outstandingBalance?: number;
  averageCallDuration?: number;
}

interface LiveCall {
  id: string;
  callId: string;
  caller: CallerInfo;
  startTime: Date;
  status: 'ringing' | 'connected' | 'ended';
  duration?: number; // in seconds
  agent?: string;
}

interface CallHistoryItem {
  id: string;
  caller: CallerInfo;
  startTime: Date;
  endTime: Date;
  duration: number;
  agent: string;
  transcriptAvailable: boolean;
  recordingUrl?: string;
  notes?: string;
  billingStatus?: 'included' | 'billable' | 'billed';
}

// Mock data removed - data now fetched from Supabase
const mockLiveCalls: LiveCall[] = [];
const mockCallHistory: CallHistoryItem[] = [];

const CommunicationsPage: React.FC = () => {
  const [liveCalls, setLiveCalls] = useState<LiveCall[]>([]);
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
  const [selectedCall, setSelectedCall] = useState<LiveCall | CallHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = realtimeSubscriptions.subscribeToLiveCalls((payload) => {
      console.log('Live call update:', payload);
      fetchLiveCalls();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update call durations every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCalls(calls => 
        calls.map(call => ({
          ...call,
          duration: call.status === 'connected' 
            ? Math.floor((Date.now() - new Date(call.startTime).getTime()) / 1000)
            : call.duration
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchLiveCalls(),
        fetchCallHistory()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load call data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveCalls = async () => {
    try {
      const data = await callsApi.getLiveCalls();
      
      // Transform data to match our interface
      const transformedCalls = data?.map((call: any) => ({
        id: call.id,
        callId: call.call_id,
        caller: {
          id: call.client_id || 'unknown',
          name: call.client_name || 'Unknown Caller',
          company: call.client_company,
          phone: call.phone_number,
          isSubscriber: call.is_subscriber || false,
          subscriptionHoursRemaining: call.subscription_hours_remaining
        },
        startTime: new Date(call.started_at),
        status: call.status,
        agent: call.agent_name
      })) || [];
      
      setLiveCalls(transformedCalls);
    } catch (error) {
      console.error('Error fetching live calls:', error);
    }
  };

  const fetchCallHistory = async () => {
    try {
      const data = await callsApi.getCallHistory(20);
      
      // Transform data to match our interface
      const transformedHistory = data?.map((call: any) => ({
        id: call.id,
        caller: {
          id: call.client_id || 'unknown',
          name: call.client?.name || 'Unknown Caller',
          company: call.client?.company,
          phone: call.phone_number,
          isSubscriber: call.client?.is_subscriber || false
        },
        startTime: new Date(call.started_at),
        endTime: new Date(call.ended_at || call.started_at),
        duration: call.duration || 0,
        agent: call.agent_id || 'Unknown',
        transcriptAvailable: call.has_transcript || false,
        recordingUrl: call.recording_url,
        billingStatus: call.client?.is_subscriber ? 'included' : 'billable'
      })).filter(call => call.endTime) || [];
      
      setCallHistory(transformedHistory);
    } catch (error) {
      console.error('Error fetching call history:', error);
    }
  };

  const handleAnswerCall = (callId: string) => {
    // In production, this would trigger OpenPhone answer
    console.log('Answering call:', callId);
  };

  const handleSendSMS = (phone: string) => {
    // In production, this would open SMS composer
    console.log('Sending SMS to:', phone);
  };

  const handleViewClient = (clientId: string) => {
    // Navigate to client profile
    window.location.href = `/admin/clients/${clientId}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Support Communications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Live calls and communication center
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="flex items-center gap-1">
            <Activity size={12} className="animate-pulse" />
            System Active
          </Badge>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Calls</p>
                <p className="text-2xl font-bold">{liveCalls.filter(c => c.status === 'connected').length}</p>
              </div>
              <PhoneCall size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Calls Today</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Phone size={24} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</p>
                <p className="text-2xl font-bold">8.5m</p>
              </div>
              <Timer size={24} className="text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Billable Hours</p>
                <p className="text-2xl font-bold">4.2</p>
              </div>
              <DollarSign size={24} className="text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Calls */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhoneIncoming size={20} className="text-green-600" />
              Live Call Queue
            </CardTitle>
            <CardDescription>
              Active and incoming support calls
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : liveCalls.length > 0 ? (
              <div className="space-y-3">
                {liveCalls.map((call) => (
                  <div 
                    key={call.id}
                    className={`p-4 rounded-lg border-2 ${
                      call.status === 'ringing' 
                        ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 animate-pulse' 
                        : 'border-green-400 bg-green-50 dark:bg-green-900/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            call.status === 'ringing' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}>
                            <PhoneIncoming size={20} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {call.caller.name}
                            </h4>
                            {call.caller.company && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {call.caller.company}
                              </p>
                            )}
                            <p className="text-sm text-gray-500">
                              {call.caller.phone}
                            </p>
                          </div>
                        </div>
                        
                        {/* Subscriber Info */}
                        <div className="mt-3 flex items-center gap-4">
                          {call.caller.isSubscriber ? (
                            <Badge variant="success" className="flex items-center gap-1">
                              <Shield size={12} />
                              Subscriber
                            </Badge>
                          ) : (
                            <Badge variant="warning" className="flex items-center gap-1">
                              <DollarSign size={12} />
                              Pay-per-call
                            </Badge>
                          )}
                          
                          {call.caller.subscriptionHoursRemaining !== undefined && (
                            <span className="text-sm text-gray-600">
                              {call.caller.subscriptionHoursRemaining}h remaining
                            </span>
                          )}
                          
                          {call.caller.outstandingBalance && call.caller.outstandingBalance > 0 && (
                            <Badge variant="danger" size="sm">
                              ${call.caller.outstandingBalance} due
                            </Badge>
                          )}
                        </div>

                        {/* Call Info */}
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          {call.status === 'connected' && (
                            <>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {formatDuration(call.duration || 0)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Headphones size={14} />
                                {call.agent}
                              </span>
                            </>
                          )}
                          {call.status === 'ringing' && (
                            <span className="text-yellow-600 font-medium">
                              Incoming call...
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {call.status === 'ringing' && (
                          <Button 
                            size="sm" 
                            variant="primary"
                            onClick={() => handleAnswerCall(call.callId)}
                          >
                            Answer
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewClient(call.caller.id)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Phone size={32} className="mx-auto mb-2 opacity-50" />
                <p>No active calls</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Info Panel */}
        <div className="space-y-6">
          {/* Caller Details */}
          {selectedCall && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Caller Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-lg font-semibold">
                    ${((selectedCall as any).caller.totalRevenue || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Call</p>
                  <p className="text-sm">
                    {(selectedCall as any).caller.lastCallDate || 'First call'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Call Duration</p>
                  <p className="text-sm">
                    {formatDuration((selectedCall as any).caller.averageCallDuration || 0)}
                  </p>
                </div>
                <div className="pt-3 space-y-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    leftIcon={<MessageSquare size={14} />}
                    onClick={() => handleSendSMS((selectedCall as any).caller.phone)}
                    className="w-full"
                  >
                    Send SMS
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    leftIcon={<FileText size={14} />}
                    className="w-full"
                  >
                    View Transcripts
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">OpenPhone</span>
                <Badge variant="success" size="sm">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">QuickBooks</span>
                <Badge variant="success" size="sm">Synced</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Call Recording</span>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={20} />
            Recent Call History
          </CardTitle>
          <CardDescription>
            Today's support calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Caller
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Time
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Duration
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Agent
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {callHistory.map((call) => (
                  <tr 
                    key={call.id} 
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => setSelectedCall(call)}
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {call.caller.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {call.caller.company}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatRelativeTime(call.startTime)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDuration(call.duration)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {call.agent}
                    </td>
                    <td className="py-3 px-4">
                      {call.billingStatus === 'included' && (
                        <Badge variant="success" size="sm">Included</Badge>
                      )}
                      {call.billingStatus === 'billable' && (
                        <Badge variant="warning" size="sm">Billable</Badge>
                      )}
                      {call.billingStatus === 'billed' && (
                        <Badge variant="secondary" size="sm">Billed</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {call.transcriptAvailable && (
                          <Button size="xs" variant="ghost">
                            <FileText size={14} />
                          </Button>
                        )}
                        <Button size="xs" variant="ghost">
                          <User size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationsPage;