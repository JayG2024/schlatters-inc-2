import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import KPICard from '../../components/ui/KPICard';
import AdminActivityWidget from '../../components/dashboard/widgets/AdminActivityWidget';
import AutomationsWidget from '../../components/dashboard/widgets/AutomationsWidget';
import CustomerIntelligenceWidget from '../../components/dashboard/widgets/CustomerIntelligenceWidget';
import RealTimeActivityWidget from '../../components/dashboard/widgets/RealTimeActivityWidget';
import { 
  Users,
  DollarSign,
  CreditCard,
  Clock,
  TrendingUp,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

// Mock data removed - data will be fetched from Supabase
const mockActivityEntries: any[] = [];
const mockAlerts: any[] = [];
const mockAutomations: any[] = [];

// Mock Customer Intelligence Data
const mockCustomerMetrics: any[] = [];

// Mock Real-Time Activity Data
const mockRealTimeActivities: any[] = [];

const OverviewPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Business Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive view of your business performance and key metrics
          </p>
        </div>
      </div>

      {/* Enhanced KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Clients"
          value="0"
          icon={<Users size={24} />}
          trend={{
            value: 0,
            label: "from last month",
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
            label: "from last month",
            direction: "up"
          }}
          iconColor="bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400"
        />
        
        <KPICard
          title="Outstanding"
          value={formatCurrency(0)}
          icon={<CreditCard size={24} />}
          trend={{
            value: 0,
            label: "from last month",
            direction: "down"
          }}
          iconColor="bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
        />
        
        <KPICard
          title="Billable Hours"
          value="0"
          icon={<Clock size={24} />}
          trend={{
            value: 0,
            label: "from last month",
            direction: "up"
          }}
          iconColor="bg-purple-50 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              Performance Analytics
            </CardTitle>
            <CardDescription>
              Detailed breakdown of business performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Customer Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Customers</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">New This Month</span>
                    <span className="font-medium text-green-600">+0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Churn Rate</span>
                    <span className="font-medium text-red-600">0%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Contract Value</span>
                    <span className="font-medium">{formatCurrency(0)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Financial Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Recurring Revenue</span>
                    <span className="font-medium">{formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Collection Rate</span>
                    <span className="font-medium text-green-600">0%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Payment Time</span>
                    <span className="font-medium">12 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</span>
                    <span className="font-medium text-green-600">0%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} className="text-green-600" />
              Monthly Goals
            </CardTitle>
            <CardDescription>
              Progress towards monthly targets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Revenue Target</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>New Customers</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Project Completion</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminActivityWidget 
          activities={mockActivityEntries}
          onViewAll={() => {}}
          className="lg:col-span-1"
        />
        
        <AutomationsWidget 
          alerts={mockAlerts}
          automations={mockAutomations}
          onViewAllAlerts={() => {}}
          onViewAllAutomations={() => {}}
          onDismissAlert={(alertId) => {}}
          onCreateAutomation={() => {}}
          onToggleAutomation={(automationId, active) => {}}
          className="lg:col-span-1"
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <BarChart3 size={24} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Open Tickets</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <AlertTriangle size={24} className="text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Team Utilization</p>
                <p className="text-2xl font-bold">0%</p>
              </div>
              <Activity size={24} className="text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;