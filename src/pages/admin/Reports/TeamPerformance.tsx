import React, { useState } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  Award, 
  BarChart, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Download, 
  Filter, 
  LineChart, 
  MessageSquare, 
  Phone, 
  RefreshCw, 
  Star, 
  Target, 
  TrendingUp, 
  User, 
  Users,
  Activity,
  DollarSign
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Progress from '../../../components/ui/Progress';
import { formatCurrency, formatPercentage } from '../../../lib/utils';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  metrics: {
    callCompletion: number;
    callsPerDay: number;
    avgCallDuration: string;
    taskCompletion: number;
    customerRating: number;
    revenueGenerated: number;
    clientRetention: number;
    timeTracking: {
      billable: number;
      nonBillable: number;
      total: number;
      utilization: number;
    };
  };
  performance: {
    current: number;
    target: number;
    previousPeriod: number;
  };
  strengths: string[];
  improvement: string[];
}

interface TeamMetric {
  name: string;
  values: number[];
  target: number;
  unit: string;
  change: number;
  description: string;
}

// Mock data for team performance
const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Jane Smith',
    role: 'Account Manager',
    metrics: {
      callCompletion: 96,
      callsPerDay: 8.5,
      avgCallDuration: '14m 30s',
      taskCompletion: 94,
      customerRating: 4.8,
      revenueGenerated: 45200,
      clientRetention: 98,
      timeTracking: {
        billable: 32,
        nonBillable: 6,
        total: 38,
        utilization: 84,
      }
    },
    performance: {
      current: 93,
      target: 85,
      previousPeriod: 89,
    },
    strengths: ['Client Relationship', 'Problem Solving', 'Follow-up'],
    improvement: ['Documentation', 'Time Management']
  },
  {
    id: '2',
    name: 'John Doe',
    role: 'Sales Representative',
    metrics: {
      callCompletion: 92,
      callsPerDay: 11.2,
      avgCallDuration: '12m 45s',
      taskCompletion: 88,
      customerRating: 4.5,
      revenueGenerated: 38500,
      clientRetention: 92,
      timeTracking: {
        billable: 29,
        nonBillable: 9,
        total: 38,
        utilization: 76,
      }
    },
    performance: {
      current: 87,
      target: 85,
      previousPeriod: 85,
    },
    strengths: ['Prospecting', 'Negotiation', 'Product Knowledge'],
    improvement: ['Follow-up Consistency', 'CRM Usage']
  },
  {
    id: '3',
    name: 'Mike Wilson',
    role: 'Support Specialist',
    metrics: {
      callCompletion: 98,
      callsPerDay: 9.8,
      avgCallDuration: '18m 20s',
      taskCompletion: 95,
      customerRating: 4.9,
      revenueGenerated: 12300,
      clientRetention: 97,
      timeTracking: {
        billable: 34,
        nonBillable: 5,
        total: 39,
        utilization: 87,
      }
    },
    performance: {
      current: 96,
      target: 85,
      previousPeriod: 94,
    },
    strengths: ['Technical Knowledge', 'Communication', 'Issue Resolution'],
    improvement: ['Upselling Opportunities']
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    role: 'Customer Success',
    metrics: {
      callCompletion: 94,
      callsPerDay: 7.4,
      avgCallDuration: '16m 50s',
      taskCompletion: 92,
      customerRating: 4.7,
      revenueGenerated: 28900,
      clientRetention: 95,
      timeTracking: {
        billable: 30,
        nonBillable: 8,
        total: 38,
        utilization: 79,
      }
    },
    performance: {
      current: 91,
      target: 85,
      previousPeriod: 88,
    },
    strengths: ['Client Training', 'Relationship Building', 'Strategic Planning'],
    improvement: ['Technical Knowledge', 'Response Time']
  },
];

// Aggregate team metrics
const teamMetrics: TeamMetric[] = [
  {
    name: 'Call Completion',
    values: [91, 93, 94, 95, 96],
    target: 90,
    unit: '%',
    change: 2.5,
    description: 'Percentage of scheduled calls successfully completed'
  },
  {
    name: 'Task Completion',
    values: [87, 89, 91, 93, 94],
    target: 85,
    unit: '%',
    change: 3.1,
    description: 'Percentage of assigned tasks completed on time'
  },
  {
    name: 'Customer Satisfaction',
    values: [4.3, 4.4, 4.5, 4.6, 4.7],
    target: 4.5,
    unit: '/5',
    change: 4.4,
    description: 'Average rating from customer feedback'
  },
  {
    name: 'Client Retention',
    values: [92, 94, 95, 95, 96],
    target: 90,
    unit: '%',
    change: 1.5,
    description: 'Percentage of clients retained during this period'
  },
  {
    name: 'Billable Utilization',
    values: [75, 78, 80, 83, 84],
    target: 80,
    unit: '%',
    change: 5.0,
    description: 'Percentage of time spent on billable activities'
  },
];

// Months for the charts
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

const TeamPerformancePage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'individual'>('overview');
  const [sortBy, setSortBy] = useState<'name' | 'performance' | 'revenue'>('performance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sort team members based on selected criteria
  const sortedTeamMembers = [...teamMembers].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'performance':
        aValue = a.performance.current;
        bValue = b.performance.current;
        break;
      case 'revenue':
        aValue = a.metrics.revenueGenerated;
        bValue = b.metrics.revenueGenerated;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Performance</h1>
          <p className="text-gray-600 mt-1">Performance metrics and analytics for your team</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
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
                timeframe === 'quarter' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setTimeframe('quarter')}
            >
              Quarter
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === 'year' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setTimeframe('year')}
            >
              Year
            </button>
          </div>
          
          <Button leftIcon={<Filter size={16} />} variant="outline">
            Filter
          </Button>
          
          <Button leftIcon={<Download size={16} />}>
            Export
          </Button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Team Overview
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'individual'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('individual')}
          >
            Individual Performance
          </button>
        </div>
      </div>
      
      {/* Team Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Team Performance Score */}
          <Card className="bg-blue-50 border border-blue-100">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h2 className="text-lg font-semibold text-blue-900">Team Performance Score</h2>
                  <p className="text-sm text-blue-700 mt-1 mb-4">Combined performance metrics for your entire team</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">92%</div>
                      <div className="text-sm text-blue-600">Current Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">85%</div>
                      <div className="text-sm text-blue-600">Target</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-3xl font-bold text-green-600">+3%</span>
                        <ArrowUp size={24} className="text-green-600 ml-1" />
                      </div>
                      <div className="text-sm text-blue-600">vs Last {timeframe}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 flex flex-col justify-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Performance Over Time</h3>
                  <div className="h-24 relative">
                    {/* Simple sparkline chart */}
                    <svg viewBox="0 0 100 50" className="w-full h-full">
                      <path
                        d="M0,35 L20,30 L40,25 L60,20 L80,15 L100,10"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                      <circle cx="100" cy="10" r="3" fill="#3b82f6" />
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg. Completion Rate</p>
                    <p className="text-2xl font-bold mt-1">94%</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-md">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <ArrowUp size={14} className="text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+2.5%</span>
                  <span className="text-gray-500 ml-1">from last {timeframe}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer Satisfaction</p>
                    <p className="text-2xl font-bold mt-1">4.7/5</p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-md">
                    <Star size={20} className="text-amber-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <ArrowUp size={14} className="text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+0.2</span>
                  <span className="text-gray-500 ml-1">from last {timeframe}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Billable Utilization</p>
                    <p className="text-2xl font-bold mt-1">84%</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-md">
                    <Clock size={20} className="text-blue-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <ArrowUp size={14} className="text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+5%</span>
                  <span className="text-gray-500 ml-1">from last {timeframe}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Revenue Per Member</p>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(31225)}</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-md">
                    <Target size={20} className="text-purple-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <ArrowUp size={14} className="text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+8.2%</span>
                  <span className="text-gray-500 ml-1">from last {timeframe}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Team Metrics Trends */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Team Metrics Trends</CardTitle>
              <CardDescription>Performance metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {teamMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{metric.name}</h3>
                        <p className="text-sm text-gray-500">{metric.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {metric.values[metric.values.length - 1]}{metric.unit}
                        </div>
                        <div className="flex items-center justify-end text-sm">
                          {metric.change > 0 ? (
                            <ArrowUp size={14} className="text-green-500" />
                          ) : (
                            <ArrowDown size={14} className="text-red-500" />
                          )}
                          <span className={metric.change > 0 ? 'text-green-600' : 'text-red-600'}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative pt-2">
                      <div className="flex items-end h-20 gap-1">
                        {metric.values.map((value, i) => {
                          // Calculate height based on value
                          const height = typeof value === 'number' ? 
                            (value / Math.max(...metric.values, metric.target)) * 100 : 0;
                          
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div 
                                className={`w-full max-w-[30px] rounded-t-sm ${
                                  value >= metric.target ? 'bg-green-500' : 'bg-amber-400'
                                }`} 
                                style={{ height: `${height}%` }}
                              ></div>
                              <span className="text-xs mt-1">{months[i]}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Target line */}
                      <div 
                        className="absolute border-t-2 border-dashed border-red-400 left-0 right-0"
                        style={{ 
                          top: `${(1 - metric.target / Math.max(...metric.values, metric.target)) * 80}px`,
                        }}
                      >
                        <div className="absolute right-0 -top-6 text-xs text-red-500 font-medium">
                          Target: {metric.target}{metric.unit}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Individual Performance */}
      {activeTab === 'individual' && (
        <div className="space-y-6">
          {/* Sort controls */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name">Name</option>
              <option value="performance">Performance Score</option>
              <option value="revenue">Revenue Generated</option>
            </select>
            
            <button
              className="p-2 border border-gray-300 rounded-md"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            </button>
          </div>
          
          {/* Team Member Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedTeamMembers.map((member) => (
              <Card key={member.id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-bold">
                        {member.performance.current}%
                      </div>
                      <div className="flex items-center text-xs">
                        <span className="text-gray-500 mr-1">vs target:</span>
                        <span className={member.performance.current >= member.performance.target ? 'text-green-600' : 'text-red-600'}>
                          {member.performance.current >= member.performance.target ? '+' : ''}
                          {member.performance.current - member.performance.target}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance metrics grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-semibold">{member.metrics.callCompletion}%</div>
                      <div className="text-xs text-gray-500">Call Completion</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold">{member.metrics.customerRating}</div>
                      <div className="text-xs text-gray-500">Customer Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold">{member.metrics.timeTracking.utilization}%</div>
                      <div className="text-xs text-gray-500">Utilization</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold">{formatCurrency(member.metrics.revenueGenerated)}</div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                  </div>
                  
                  {/* Progress bars */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Performance</span>
                        <span>Target: {member.performance.target}%</span>
                      </div>
                      <Progress 
                        value={member.performance.current} 
                        variant={member.performance.current >= member.performance.target ? 'success' : 'warning'}
                      />
                      <div className="flex justify-end text-xs text-gray-500 mt-1">
                        <div className="flex items-center">
                          {member.performance.current > member.performance.previousPeriod ? (
                            <ArrowUp size={12} className="text-green-500 mr-1" />
                          ) : (
                            <ArrowDown size={12} className="text-red-500 mr-1" />
                          )}
                          <span>
                            {member.performance.current > member.performance.previousPeriod ? '+' : ''}
                            {member.performance.current - member.performance.previousPeriod}% vs last {timeframe}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Billable Hours</span>
                        <span>{member.metrics.timeTracking.billable}h / {member.metrics.timeTracking.total}h</span>
                      </div>
                      <Progress 
                        value={member.metrics.timeTracking.utilization}
                        variant={member.metrics.timeTracking.utilization >= 80 ? 'success' : 'default'}
                      />
                    </div>
                  </div>
                  
                  {/* Strengths and improvement areas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Strengths</h4>
                      <div className="space-y-1">
                        {member.strengths.map((strength, i) => (
                          <div key={i} className="flex items-center text-sm">
                            <CheckCircle size={14} className="text-green-500 mr-2" />
                            <span>{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Areas for Improvement</h4>
                      <div className="space-y-1">
                        {member.improvement.map((area, i) => (
                          <div key={i} className="flex items-center text-sm">
                            <Target size={14} className="text-amber-500 mr-2" />
                            <span>{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Team Performance Comparison */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Team Performance Comparison</CardTitle>
              <CardDescription>Comparing key metrics across team members</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simple comparison chart */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Performance Score</h3>
                  <div className="space-y-2">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{member.name}</span>
                          <span className="text-sm font-medium">{member.performance.current}%</span>
                        </div>
                        <Progress 
                          value={member.performance.current} 
                          variant={member.performance.current >= member.performance.target ? 'success' : 'warning'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Revenue Generated</h3>
                  <div className="space-y-2">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{member.name}</span>
                          <span className="text-sm font-medium">{formatCurrency(member.metrics.revenueGenerated)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full" 
                            style={{ width: `${(member.metrics.revenueGenerated / 50000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Customer Rating</h3>
                  <div className="space-y-2">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{member.name}</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium mr-1">{member.metrics.customerRating}</span>
                            <Star size={14} className="text-amber-500" fill="#f59e0b" />
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-amber-500 h-2.5 rounded-full" 
                            style={{ width: `${(member.metrics.customerRating / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Performer Recognition */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Award size={32} className="text-amber-500" />
                <h2 className="text-xl font-semibold text-gray-900">Top Performer of the Month</h2>
              </div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-3xl">
                    M
                  </div>
                  <div className="mt-3 text-center">
                    <h3 className="font-semibold text-lg">Mike Wilson</h3>
                    <p className="text-gray-500">Support Specialist</p>
                    <div className="flex items-center justify-center mt-1">
                      <Badge variant="success" className="mt-1">96% Performance</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Achievements</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-500" />
                        <span>Highest customer satisfaction rating (4.9/5)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-500" />
                        <span>98% call completion rate</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-500" />
                        <span>87% billable utilization</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-500" />
                        <span>Resolved 95% of support tickets within SLA</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
                    <div className="font-medium mb-1">Manager's Note:</div>
                    <p>
                      Mike has consistently exceeded expectations this month, demonstrating excellent technical expertise and customer service skills. His attention to detail and proactive approach to client issues has resulted in exceptionally high customer satisfaction scores.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeamPerformancePage;