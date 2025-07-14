import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  Clock, 
  Play,
  Pause,
  User,
  MoreVertical,
  Download,
  ArrowDown,
  ArrowUp,
  BarChart,
  Loader,
  DollarSign
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Progress from '../../../components/ui/Progress';

// Import sub-pages
import CallTimer from './CallTimer';
import TimeLogs from './TimeLogs';
import BillableHours from './BillableHours';

// Time tracking mock data
import { mockTimeEntries, formatDuration } from './mockData';

const TimeTrackingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const isMainPage = location.pathname === '/admin/time-tracking';
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Calculate time statistics
  const totalTime = mockTimeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const billableTime = mockTimeEntries
    .filter(entry => entry.billable)
    .reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const billablePercentage = Math.round((billableTime / totalTime) * 100);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader size={40} className="animate-spin text-navy-600 mb-4" />
          <p className="text-navy-600 font-medium">Loading time tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Tracking</h1>
          <p className="text-gray-600 mt-1">Track and manage consulting time</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search time entries..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <Button leftIcon={<Filter size={16} />} variant="outline">
            Filter
          </Button>
          
          <Button leftIcon={<Calendar size={16} />} variant="outline">
            Date Range
          </Button>
          
          <Button leftIcon={<Play size={16} />} className="bg-green-600 hover:bg-green-700">
            Start Timer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Hours</p>
                <p className="text-2xl font-bold mt-1">{(totalTime / 60).toFixed(1)}h</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-md">
                <Clock size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Billable Hours</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{(billableTime / 60).toFixed(1)}h</p>
              </div>
              <div className="p-2 bg-green-50 rounded-md">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-gray-500">Billable ratio</span>
                <span className="font-medium">{billablePercentage}%</span>
              </div>
              <Progress value={billablePercentage} size="sm" variant={billablePercentage >= 80 ? 'success' : 'default'} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Tracked This Week</p>
                <p className="text-2xl font-bold mt-1">0h</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-md">
                <Calendar size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-gray-500">Weekly target</span>
                <span className="font-medium">0h</span>
              </div>
              <Progress value={0} size="sm" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Daily Hours</p>
                <p className="text-2xl font-bold mt-1">0h</p>
              </div>
              <div className="p-2 bg-amber-50 rounded-md">
                <BarChart size={20} className="text-amber-600" />
              </div>
            </div>
            <div className="mt-2 flex space-x-1 text-xs">
              <div className="flex items-center">
                <ArrowUp size={14} className="text-green-500 mr-1" />
                <span className="text-green-600">0%</span>
              </div>
              <span className="text-gray-500">from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              isMainPage
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => navigate('/admin/time-tracking')}
          >
            Call Timer
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              location.pathname.includes('/logs')
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => navigate('/admin/time-tracking/logs')}
          >
            Time Logs
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              location.pathname.includes('/billable')
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => navigate('/admin/time-tracking/billable')}
          >
            Billable Hours
          </button>
        </div>
      </div>
      
      {/* Page content based on route */}
      <Routes>
        <Route path="/" element={<CallTimer />} />
        <Route path="/logs" element={<TimeLogs />} />
        <Route path="/billable" element={<BillableHours />} />
      </Routes>
    </div>
  );
};

export default TimeTrackingPage;