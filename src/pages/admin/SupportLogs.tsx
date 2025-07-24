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
  DollarSign,
  Timer,
  Calendar,
  Download,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText,
  User,
  Shield
} from 'lucide-react';
import { formatCurrency, formatDate, formatDuration, formatRelativeTime } from '../../lib/utils';
import { useOpenPhoneData, useCallStatistics } from '../../hooks/useOpenPhoneData';
import { callsApi } from '../../lib/supabase';

interface CallLog {
  id: string;
  callId: string;
  clientId: string;
  clientName: string;
  company: string;
  phone: string;
  direction: 'inbound' | 'outbound';
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  billable: boolean;
  billingType: 'subscription' | 'pay-per-call' | 'emergency' | 'non-billable';
  rate?: number;
  charge?: number;
  agent: string;
  status: 'completed' | 'missed' | 'voicemail' | 'dropped';
  notes?: string;
  transcriptAvailable: boolean;
  recordingUrl?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  tags?: string[];
}

interface TextLog {
  id: string;
  clientId: string;
  clientName: string;
  phone: string;
  direction: 'inbound' | 'outbound';
  timestamp: Date;
  message: string;
  agent?: string;
  responseTime?: number; // in minutes
  automated: boolean;
  type: 'support' | 'reminder' | 'follow-up';
}

const SupportLogs: React.FC = () => {
  const { calls, messages, loading: dataLoading } = useOpenPhoneData();
  const { stats: callStats } = useCallStatistics();
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [textLogs, setTextLogs] = useState<TextLog[]>([]);
  const [activeTab, setActiveTab] = useState<'calls' | 'texts'>('calls');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBillable, setFilterBillable] = useState<'all' | 'billable' | 'non-billable'>('all');
  
  useEffect(() => {
    processCallData();
    processTextData();
  }, [calls, messages]);

  const processCallData = () => {
    // Transform calls into detailed logs
    const logs: CallLog[] = calls.map((call: any) => ({
      id: call.id,
      callId: call.call_id,
      clientId: call.client_id || 'unknown',
      clientName: call.client?.name || 'Unknown Caller',
      company: call.client?.company || '',
      phone: call.from_number || call.to_number,
      direction: call.direction,
      startTime: new Date(call.start_time),
      endTime: call.end_time ? new Date(call.end_time) : new Date(call.start_time),
      duration: call.duration || 0,
      billable: (call.duration || 0) > 300, // Billable if > 5 minutes
      billingType: determineBillingType(call),
      rate: 3.00, // $3/minute for pay-per-call
      charge: calculateCharge(call),
      agent: call.agent_id || 'System',
      status: call.status || 'completed',
      transcriptAvailable: call.has_transcript || false,
      recordingUrl: call.recording_url,
      sentiment: determineSentiment(call),
      tags: call.tags || []
    }));
    
    setCallLogs(logs);
  };

  const processTextData = () => {
    // Transform messages into text logs
    const logs: TextLog[] = messages.map((msg: any) => ({
      id: msg.id,
      clientId: msg.client_id || 'unknown',
      clientName: msg.client?.name || 'Unknown',
      phone: msg.from_number || msg.to_number,
      direction: msg.direction,
      timestamp: new Date(msg.created_at),
      message: msg.body || '',
      agent: msg.agent_id,
      responseTime: calculateResponseTime(msg),
      automated: msg.automated || false,
      type: determineMessageType(msg)
    }));
    
    setTextLogs(logs);
  };

  const determineBillingType = (call: any) => {
    if (!call.client?.is_subscriber) return 'pay-per-call';
    if (isAfterHours(call.start_time)) return 'emergency';
    if (call.duration < 300) return 'non-billable';
    return 'subscription';
  };

  const calculateCharge = (call: any) => {
    if (call.client?.is_subscriber || call.duration < 300) return 0;
    const minutes = Math.ceil(call.duration / 60);
    return minutes * 3.00;
  };

  const isAfterHours = (timestamp: string) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const day = date.getDay();
    return hour < 8 || hour >= 17 || day === 0 || day === 6;
  };

  const determineSentiment = (call: any) => {
    // Mock sentiment analysis
    const random = Math.random();
    if (random < 0.7) return 'positive';
    if (random < 0.9) return 'neutral';
    return 'negative';
  };

  const determineMessageType = (msg: any) => {
    const body = msg.body?.toLowerCase() || '';
    if (body.includes('reminder') || body.includes('payment')) return 'reminder';
    if (body.includes('follow up') || body.includes('checking in')) return 'follow-up';
    return 'support';
  };

  const calculateResponseTime = (msg: any) => {
    // Mock response time calculation
    return Math.floor(Math.random() * 30) + 1;
  };

  // Calculate statistics
  const stats = {
    totalCalls: callLogs.length,
    billableCalls: callLogs.filter(c => c.billable).length,
    avgCallDuration: callLogs.length > 0 
      ? callLogs.reduce((sum, c) => sum + c.duration, 0) / callLogs.length / 60 
      : 0,
    maxCallDuration: callLogs.length > 0
      ? Math.max(...callLogs.map(c => c.duration)) / 60
      : 0,
    totalTexts: textLogs.length,
    avgResponseTime: textLogs.filter(t => t.responseTime).length > 0
      ? textLogs.filter(t => t.responseTime).reduce((sum, t) => sum + (t.responseTime || 0), 0) / textLogs.filter(t => t.responseTime).length
      : 0,
    textToCallRatio: callLogs.length > 0 ? textLogs.length / callLogs.length : 0,
    payPerCallRevenue: callLogs.filter(c => c.billingType === 'pay-per-call').reduce((sum, c) => sum + (c.charge || 0), 0)
  };

  // Filter logs
  const filteredCallLogs = callLogs.filter(log => {
    const matchesSearch = searchTerm === '' ||
      log.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.phone.includes(searchTerm);
    
    const matchesBillable = filterBillable === 'all' ||
      (filterBillable === 'billable' && log.billable) ||
      (filterBillable === 'non-billable' && !log.billable);
    
    return matchesSearch && matchesBillable;
  });

  const filteredTextLogs = textLogs.filter(log => {
    return searchTerm === '' ||
      log.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.phone.includes(searchTerm) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Support Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detailed call and text communication logs
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            leftIcon={<Download size={16} />}
          >
            Export Logs
          </Button>
          <Button 
            variant="outline"
            leftIcon={<FileText size={16} />}
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Calls</p>
                <p className="text-2xl font-bold">{stats.totalCalls}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.billableCalls} billable ({((stats.billableCalls / stats.totalCalls) * 100).toFixed(0)}%)
                </p>
              </div>
              <Phone size={24} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Call Duration</p>
                <p className="text-2xl font-bold">{stats.avgCallDuration.toFixed(1)}m</p>
                <p className="text-xs text-gray-500 mt-1">
                  Max: {stats.maxCallDuration.toFixed(1)}m
                </p>
              </div>
              <Timer size={24} className="text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Text Messages</p>
                <p className="text-2xl font-bold">{stats.totalTexts}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Ratio: {stats.textToCallRatio.toFixed(2)}:1
                </p>
              </div>
              <MessageSquare size={24} className="text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Response Time</p>
                <p className="text-2xl font-bold">{stats.avgResponseTime.toFixed(0)}m</p>
                <p className="text-xs text-gray-500 mt-1">
                  Average first response
                </p>
              </div>
              <Clock size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, company, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
              
              {activeTab === 'calls' && (
                <select
                  value={filterBillable}
                  onChange={(e) => setFilterBillable(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Calls</option>
                  <option value="billable">Billable Only</option>
                  <option value="non-billable">Non-Billable</option>
                </select>
              )}
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`py-2 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'calls'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('calls')}
              >
                Call Logs ({filteredCallLogs.length})
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'texts'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('texts')}
              >
                Text Logs ({filteredTextLogs.length})
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      {activeTab === 'calls' ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Call Details</th>
                  <th className="px-6 py-3 text-left">Duration</th>
                  <th className="px-6 py-3 text-left">Billing</th>
                  <th className="px-6 py-3 text-left">Agent</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCallLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{log.clientName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{log.company}</p>
                        <p className="text-xs text-gray-500">{log.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {log.direction === 'inbound' ? (
                          <PhoneIncoming size={16} className="text-blue-600" />
                        ) : (
                          <PhoneOutgoing size={16} className="text-green-600" />
                        )}
                        <div>
                          <p className="text-sm">{formatRelativeTime(log.startTime)}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(log.startTime)} at {log.startTime.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{formatDuration(log.duration)}</p>
                      {log.duration > 600 && (
                        <p className="text-xs text-orange-600">Long call</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {log.billingType === 'subscription' && (
                          <Badge variant="success" size="sm">Included</Badge>
                        )}
                        {log.billingType === 'pay-per-call' && (
                          <div>
                            <Badge variant="warning" size="sm">Pay-per-call</Badge>
                            <p className="text-xs text-gray-600 mt-1">{formatCurrency(log.charge || 0)}</p>
                          </div>
                        )}
                        {log.billingType === 'emergency' && (
                          <div>
                            <Badge variant="danger" size="sm">Emergency</Badge>
                            <p className="text-xs text-gray-600 mt-1">After hours</p>
                          </div>
                        )}
                        {log.billingType === 'non-billable' && (
                          <Badge variant="secondary" size="sm">Non-billable</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{log.agent}</p>
                      {log.sentiment && (
                        <p className={`text-xs mt-1 ${
                          log.sentiment === 'positive' ? 'text-green-600' :
                          log.sentiment === 'negative' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {log.sentiment} sentiment
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={
                        log.status === 'completed' ? 'success' :
                        log.status === 'missed' ? 'danger' :
                        'secondary'
                      } size="sm">
                        {log.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {log.transcriptAvailable && (
                          <Button size="xs" variant="ghost" title="View Transcript">
                            <FileText size={14} />
                          </Button>
                        )}
                        <Button size="xs" variant="ghost" title="View Customer">
                          <User size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Message</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Response</th>
                  <th className="px-6 py-3 text-center">Direction</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTextLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{log.clientName}</p>
                        <p className="text-xs text-gray-500">{log.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">{log.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(log.timestamp)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        log.type === 'reminder' ? 'warning' :
                        log.type === 'follow-up' ? 'info' :
                        'secondary'
                      } size="sm">
                        {log.type}
                      </Badge>
                      {log.automated && (
                        <p className="text-xs text-gray-500 mt-1">Automated</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {log.responseTime && (
                        <div>
                          <p className="text-sm">{log.responseTime} min</p>
                          <p className="text-xs text-gray-500">Response time</p>
                        </div>
                      )}
                      {log.agent && (
                        <p className="text-xs text-gray-600">{log.agent}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {log.direction === 'inbound' ? (
                        <Badge variant="info" size="sm">Received</Badge>
                      ) : (
                        <Badge variant="success" size="sm">Sent</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SupportLogs;