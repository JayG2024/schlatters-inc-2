import React, { useState } from 'react';
import { 
  BarChart, 
  Calendar, 
  Clock, 
  Download, 
  Filter, 
  LineChart, 
  Phone, 
  PieChart, 
  RefreshCw, 
  Search, 
  Share2, 
  Smile, 
  Frown, 
  Meh,
  TrendingUp, 
  TrendingDown, 
  User, 
  FileText,
  MessageSquare,
  Volume2
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Progress from '../../../components/ui/Progress';
import { formatDateTime } from '../../../lib/utils';

// Mock data for call analytics
const callsSummary = {
  total: 428,
  completed: 387,
  missed: 24,
  voicemail: 17,
  inbound: 156,
  outbound: 272,
  avgDuration: '12m 18s',
  totalDuration: '87h 30m',
};

const callsOverTime = [
  { date: 'Mon', inbound: 32, outbound: 48 },
  { date: 'Tue', inbound: 28, outbound: 52 },
  { date: 'Wed', inbound: 35, outbound: 59 },
  { date: 'Thu', inbound: 22, outbound: 43 },
  { date: 'Fri', inbound: 39, outbound: 70 },
];

const topCallers = [
  { name: 'Jane Smith', role: 'Account Manager', calls: 98, duration: '23h 15m', avgCallTime: '14m 12s' },
  { name: 'John Doe', role: 'Sales Representative', calls: 87, duration: '18h 40m', avgCallTime: '12m 54s' },
  { name: 'Mike Wilson', role: 'Support Specialist', calls: 72, duration: '15h 36m', avgCallTime: '13m 00s' },
  { name: 'Sarah Johnson', role: 'Customer Success', calls: 65, duration: '12h 22m', avgCallTime: '11m 24s' },
];

const sentimentAnalysis = {
  positive: 215,
  neutral: 142,
  negative: 30,
  topPhrases: [
    { phrase: 'easy to use', count: 42, sentiment: 'positive' },
    { phrase: 'very helpful', count: 38, sentiment: 'positive' },
    { phrase: 'having issues with', count: 24, sentiment: 'negative' },
    { phrase: 'thank you for', count: 54, sentiment: 'positive' },
    { phrase: 'need assistance', count: 31, sentiment: 'neutral' },
  ]
};

const recentCalls = [
  {
    id: '1',
    caller: 'Acme Corp',
    type: 'inbound',
    duration: '14m 22s',
    timestamp: '2025-05-15T14:30:00',
    agent: 'Jane Smith',
    sentiment: 'positive',
    topics: ['billing question', 'service upgrade', 'positive feedback'],
  },
  {
    id: '2',
    caller: 'TechSolutions Inc',
    type: 'outbound',
    duration: '8m 45s',
    timestamp: '2025-05-15T13:15:00',
    agent: 'John Doe',
    sentiment: 'neutral',
    topics: ['product demo', 'follow-up scheduled'],
  },
  {
    id: '3',
    caller: 'Global Ventures',
    type: 'inbound',
    duration: '22m 10s',
    timestamp: '2025-05-15T11:30:00',
    agent: 'Mike Wilson',
    sentiment: 'negative',
    topics: ['technical issue', 'escalation', 'resolution pending'],
  },
  {
    id: '4',
    caller: 'Premier Services',
    type: 'outbound',
    duration: '11m 05s',
    timestamp: '2025-05-15T10:20:00',
    agent: 'Sarah Johnson',
    sentiment: 'positive',
    topics: ['quarterly review', 'upsell opportunity', 'client satisfaction'],
  },
];

const CallAnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'custom'>('week');
  const [filterBy, setFilterBy] = useState<'all' | 'inbound' | 'outbound'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="text-green-500" />;
      case 'neutral':
        return <Meh className="text-amber-500" />;
      case 'negative':
        return <Frown className="text-red-500" />;
      default:
        return null;
    }
  };
  
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'neutral':
        return 'text-amber-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Analytics</h1>
          <p className="text-gray-600 mt-1">Insights and metrics from your team's phone conversations</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search calls..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === 'day' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setTimeframe('day')}
            >
              Day
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === 'week' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setTimeframe('week')}
            >
              Week
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === 'month' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setTimeframe('month')}
            >
              Month
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === 'custom' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setTimeframe('custom')}
            >
              Custom
            </button>
          </div>
          
          <Button leftIcon={<Download size={16} />}>
            Export Data
          </Button>
        </div>
      </div>
      
      {timeframe === 'custom' && (
        <Card className="bg-white p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-md"
                defaultValue="2025-05-08"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-md"
                defaultValue="2025-05-15"
              />
            </div>
            <Button>Apply Range</Button>
          </div>
        </Card>
      )}
      
      {/* Call Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Calls</p>
                <p className="text-2xl font-bold mt-1">{callsSummary.total}</p>
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <TrendingUp size={12} className="mr-1 text-green-500" />
                  <span>+12% from previous period</span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-blue-50">
                <Phone size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Call Duration</p>
                <p className="text-2xl font-bold mt-1">{callsSummary.avgDuration}</p>
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <TrendingUp size={12} className="mr-1 text-green-500" />
                  <span>+2m 10s from previous period</span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-purple-50">
                <Clock size={20} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Sentiment Score</p>
                <p className="text-2xl font-bold mt-1">85%</p>
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <TrendingUp size={12} className="mr-1 text-green-500" />
                  <span>+5% from previous period</span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-green-50">
                <Smile size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Missed Calls</p>
                <p className="text-2xl font-bold mt-1">{callsSummary.missed}</p>
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <TrendingDown size={12} className="mr-1 text-green-500" />
                  <span>-8% from previous period</span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-red-50">
                <Phone size={20} className="text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Call Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Call Volume Trend</CardTitle>
            <CardDescription>Daily call volume for the current period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-end gap-4 mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
                <span className="text-sm">Inbound</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-sm mr-2"></div>
                <span className="text-sm">Outbound</span>
              </div>
            </div>
            
            <div className="h-[300px]">
              {/* Bar chart visualization */}
              <div className="h-full flex items-end justify-around gap-8">
                {callsOverTime.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full max-w-[60px] mb-2">
                      {/* Outbound calls bar */}
                      <div 
                        className="w-full bg-purple-500 rounded-t-sm" 
                        style={{ height: `${day.outbound * 2}px` }}
                        title={`${day.outbound} outbound calls`}
                      ></div>
                      {/* Inbound calls bar, stacked below */}
                      <div 
                        className="w-full bg-blue-500 rounded-b-sm mt-px" 
                        style={{ height: `${day.inbound * 2}px` }}
                        title={`${day.inbound} inbound calls`}
                      ></div>
                      
                      {/* Total calls label */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                        {day.inbound + day.outbound}
                      </div>
                    </div>
                    <span className="text-xs font-medium">{day.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Call Distribution</CardTitle>
            <CardDescription>Breakdown of call types and results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Direction Pie Chart */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Call Direction</h3>
                <div className="relative h-[150px] flex items-center justify-center">
                  {/* Simple donut chart */}
                  <svg viewBox="0 0 100 100" width="150" height="150" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                    />
                    
                    {/* Outbound segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#a855f7"
                      strokeWidth="12"
                      strokeDasharray={`${(callsSummary.outbound / callsSummary.total) * 251.2} 251.2`}
                      strokeDashoffset="0"
                    />
                    
                    {/* Inbound segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      strokeDasharray={`${(callsSummary.inbound / callsSummary.total) * 251.2} 251.2`}
                      strokeDashoffset={`${(callsSummary.outbound / callsSummary.total) * -251.2}`}
                    />
                  </svg>
                  
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{callsSummary.total}</div>
                      <div className="text-xs text-gray-500">Total Calls</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">Inbound: {callsSummary.inbound}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm">Outbound: {callsSummary.outbound}</span>
                  </div>
                </div>
              </div>
              
              {/* Status Pie Chart */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Call Status</h3>
                <div className="relative h-[150px] flex items-center justify-center">
                  {/* Simple donut chart */}
                  <svg viewBox="0 0 100 100" width="150" height="150" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                    />
                    
                    {/* Completed segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="12"
                      strokeDasharray={`${(callsSummary.completed / callsSummary.total) * 251.2} 251.2`}
                      strokeDashoffset="0"
                    />
                    
                    {/* Missed segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="12"
                      strokeDasharray={`${(callsSummary.missed / callsSummary.total) * 251.2} 251.2`}
                      strokeDashoffset={`${(callsSummary.completed / callsSummary.total) * -251.2}`}
                    />
                    
                    {/* Voicemail segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="12"
                      strokeDasharray={`${(callsSummary.voicemail / callsSummary.total) * 251.2} 251.2`}
                      strokeDashoffset={`${((callsSummary.completed + callsSummary.missed) / callsSummary.total) * -251.2}`}
                    />
                  </svg>
                  
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Math.round((callsSummary.completed / callsSummary.total) * 100)}%</div>
                      <div className="text-xs text-gray-500">Completion</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs">Completed: {callsSummary.completed}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span className="text-xs">Missed: {callsSummary.missed}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
                    <span className="text-xs">Voicemail: {callsSummary.voicemail}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sentiment Analysis */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
          <CardDescription>Customer sentiment detected during calls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentiment Distribution */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Sentiment Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <Smile size={16} className="text-green-500 mr-2" />
                      <span className="text-sm">Positive</span>
                    </div>
                    <span className="text-sm font-medium">{sentimentAnalysis.positive} calls</span>
                  </div>
                  <Progress 
                    value={(sentimentAnalysis.positive / (sentimentAnalysis.positive + sentimentAnalysis.neutral + sentimentAnalysis.negative)) * 100} 
                    variant="success"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <Meh size={16} className="text-amber-500 mr-2" />
                      <span className="text-sm">Neutral</span>
                    </div>
                    <span className="text-sm font-medium">{sentimentAnalysis.neutral} calls</span>
                  </div>
                  <Progress 
                    value={(sentimentAnalysis.neutral / (sentimentAnalysis.positive + sentimentAnalysis.neutral + sentimentAnalysis.negative)) * 100} 
                    variant="warning"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <Frown size={16} className="text-red-500 mr-2" />
                      <span className="text-sm">Negative</span>
                    </div>
                    <span className="text-sm font-medium">{sentimentAnalysis.negative} calls</span>
                  </div>
                  <Progress 
                    value={(sentimentAnalysis.negative / (sentimentAnalysis.positive + sentimentAnalysis.neutral + sentimentAnalysis.negative)) * 100} 
                    variant="danger"
                  />
                </div>
                
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-800 mb-1">Overall Sentiment Score</div>
                  <div className="text-2xl font-bold text-green-900">85%</div>
                  <div className="text-xs text-green-700 mt-1">5% increase from previous period</div>
                </div>
              </div>
            </div>
            
            {/* Common Phrases */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Most Common Phrases</h3>
              <div className="space-y-4">
                {sentimentAnalysis.topPhrases.map((phrase, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {phrase.sentiment === 'positive' && <Smile size={16} className="text-green-500" />}
                      {phrase.sentiment === 'neutral' && <Meh size={16} className="text-amber-500" />}
                      {phrase.sentiment === 'negative' && <Frown size={16} className="text-red-500" />}
                      <span className="text-sm font-medium">"{phrase.phrase}"</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {phrase.count} mentions
                    </span>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                leftIcon={<MessageSquare size={14} />}
              >
                View All Detected Phrases
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Top Callers Performance */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Team members with highest call volume and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Team Member</th>
                  <th className="px-6 py-3 text-center">Total Calls</th>
                  <th className="px-6 py-3 text-center">Call Duration</th>
                  <th className="px-6 py-3 text-center">Avg. Call Time</th>
                  <th className="px-6 py-3 text-center">Sentiment Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {topCallers.map((caller, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {caller.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{caller.name}</div>
                          <div className="text-sm text-gray-500">{caller.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">{caller.calls}</div>
                      <div className="text-xs text-gray-500">
                        {index === 0 ? (
                          <span className="text-green-600">+12% vs avg</span>
                        ) : index === 1 ? (
                          <span className="text-green-600">+8% vs avg</span>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">{caller.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">{caller.avgCallTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="w-full max-w-[120px]">
                          <Progress 
                            value={90 - index * 5} 
                            variant={index < 2 ? "success" : "default"}
                            size="sm"
                          />
                        </div>
                        <span className="ml-2 text-sm font-medium">{90 - index * 5}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Calls with Sentiment Analysis */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>Latest calls with sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCalls.map((call) => (
              <div key={call.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-blue-50">
                        <Phone size={16} className={call.type === 'inbound' ? 'text-blue-600' : 'text-purple-600'} />
                      </div>
                      <div>
                        <div className="font-medium">{call.caller}</div>
                        <div className="text-sm text-gray-500 capitalize">{call.type} call • {call.duration}</div>
                      </div>
                    </div>
                    
                    <div className="mt-2 ml-10">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User size={14} className="text-gray-400" />
                        <span>{call.agent}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Clock size={14} className="text-gray-400" />
                        <span>{formatDateTime(call.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`flex items-center ${getSentimentColor(call.sentiment)}`}>
                        {getSentimentIcon(call.sentiment)}
                        <span className="ml-1 text-sm font-medium capitalize">{call.sentiment} sentiment</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {call.topics.map((topic, i) => (
                        <Badge key={i} variant="default">{topic}</Badge>
                      ))}
                    </div>
                    
                    <div className="mt-3 flex justify-end gap-2">
                      <Button size="sm" variant="outline" leftIcon={<FileText size={14} />}>
                        Transcript
                      </Button>
                      <Button size="sm" leftIcon={<Volume2 size={14} />}>
                        Listen
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" size="sm" className="w-full mt-4">
            View All Calls
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallAnalyticsPage;