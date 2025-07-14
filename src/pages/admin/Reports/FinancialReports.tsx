import React, { useState } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  BarChart, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Download, 
  DollarSign, 
  Filter, 
  Printer, 
  RefreshCw, 
  Share2, 
  TrendingUp 
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { formatCurrency } from '../../../lib/utils';

const FinancialReportsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year' | 'custom'>('month');
  const [reportView, setReportView] = useState<'overview' | 'revenue' | 'expenses' | 'profit'>('overview');
  const [expandedSections, setExpandedSections] = useState<string[]>(['revenue', 'expenses']);
  
  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  // Financial metrics data
  const financialMetrics = {
    revenue: {
      total: 178000,
      previousPeriod: 158500,
      breakdown: [
        { category: 'Service Subscriptions', amount: 125000, change: 12.5 },
        { category: 'Consulting Hours', amount: 38000, change: 8.2 },
        { category: 'Implementation Fees', amount: 15000, change: 5.0 }
      ]
    },
    expenses: {
      total: 98000,
      previousPeriod: 95000,
      breakdown: [
        { category: 'Salaries & Benefits', amount: 65000, change: 2.1 },
        { category: 'Software Licenses', amount: 12000, change: 5.3 },
        { category: 'Office & Admin', amount: 8500, change: -1.2 },
        { category: 'Marketing', amount: 7500, change: 15.4 },
        { category: 'Other Expenses', amount: 5000, change: 0 }
      ]
    },
    profit: {
      total: 80000,
      previousPeriod: 63500,
      margin: 44.94,
      previousMargin: 40.06
    }
  };

  // Monthly revenue data for chart
  const monthlyData = [
    { month: 'Jan', revenue: 145000, expenses: 85000, profit: 60000 },
    { month: 'Feb', revenue: 152000, expenses: 88000, profit: 64000 },
    { month: 'Mar', revenue: 160000, expenses: 92000, profit: 68000 },
    { month: 'Apr', revenue: 168000, expenses: 94000, profit: 74000 },
    { month: 'May', revenue: 178000, expenses: 98000, profit: 80000 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of your business financials</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
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
          
          <Button leftIcon={<RefreshCw size={16} />} variant="outline">
            Refresh
          </Button>
          
          <Button leftIcon={<Filter size={16} />} variant="outline">
            Filter
          </Button>
          
          <Button leftIcon={<Download size={16} />}>
            Export
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
                defaultValue="2025-01-01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-md"
                defaultValue="2025-05-31"
              />
            </div>
            <Button>Apply Range</Button>
          </div>
        </Card>
      )}
      
      {/* Report navigation tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              reportView === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setReportView('overview')}
          >
            Overview
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              reportView === 'revenue'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setReportView('revenue')}
          >
            Revenue
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              reportView === 'expenses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setReportView('expenses')}
          >
            Expenses
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              reportView === 'profit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setReportView('profit')}
          >
            Profit & Loss
          </button>
        </div>
      </div>
      
      {/* Financial Overview */}
      {reportView === 'overview' && (
        <div className="space-y-6">
          {/* Key Financial Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-white hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Revenue</p>
                    <p className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(financialMetrics.revenue.total)}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <ArrowUp size={20} className="text-green-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp size={14} className="text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+{((financialMetrics.revenue.total / financialMetrics.revenue.previousPeriod - 1) * 100).toFixed(1)}%</span>
                  <span className="text-gray-500 ml-1">from last {timeframe}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Expenses</p>
                    <p className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(financialMetrics.expenses.total)}</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <ArrowUp size={20} className="text-amber-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp size={14} className="text-amber-500 mr-1" />
                  <span className="text-amber-600 font-medium">+{((financialMetrics.expenses.total / financialMetrics.expenses.previousPeriod - 1) * 100).toFixed(1)}%</span>
                  <span className="text-gray-500 ml-1">from last {timeframe}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Net Profit</p>
                    <p className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(financialMetrics.profit.total)}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <ArrowUp size={20} className="text-blue-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp size={14} className="text-blue-500 mr-1" />
                  <span className="text-blue-600 font-medium">+{((financialMetrics.profit.total / financialMetrics.profit.previousPeriod - 1) * 100).toFixed(1)}%</span>
                  <span className="text-gray-500 ml-1">from last {timeframe}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend Chart */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Financial Performance Trend</CardTitle>
              <CardDescription>Monthly revenue, expenses, and profit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-end gap-4 mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
                  <span className="text-sm">Revenue</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-500 rounded-sm mr-2"></div>
                  <span className="text-sm">Expenses</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
                  <span className="text-sm">Profit</span>
                </div>
              </div>
              
              <div className="h-[300px]">
                {/* Chart visualization */}
                <div className="h-full flex items-end justify-around gap-2">
                  {monthlyData.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      {/* Revenue Bar */}
                      <div 
                        className="w-full bg-green-500 max-w-[40px] mx-auto mb-px" 
                        style={{ height: `${month.revenue / 2000}px` }}
                        title={`Revenue: ${formatCurrency(month.revenue)}`}
                      ></div>
                      
                      {/* Expenses Bar */}
                      <div 
                        className="w-full bg-amber-500 max-w-[40px] mx-auto mb-px" 
                        style={{ height: `${month.expenses / 2000}px` }}
                        title={`Expenses: ${formatCurrency(month.expenses)}`}
                      ></div>
                      
                      {/* Profit Bar */}
                      <div 
                        className="w-full bg-blue-500 max-w-[40px] mx-auto mb-2" 
                        style={{ height: `${month.profit / 2000}px` }}
                        title={`Profit: ${formatCurrency(month.profit)}`}
                      ></div>
                      
                      <span className="text-xs font-medium">{month.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Sections */}
          {/* Revenue Section */}
          <Card className="bg-white">
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('revenue')}>
              <div className="flex justify-between items-center">
                <CardTitle>Revenue Breakdown</CardTitle>
                {expandedSections.includes('revenue') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </CardHeader>
            
            {expandedSections.includes('revenue') && (
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Revenue Sources</h3>
                    <span className="text-sm text-gray-500">Total: {formatCurrency(financialMetrics.revenue.total)}</span>
                  </div>
                  
                  <div className="space-y-4">
                    {financialMetrics.revenue.breakdown.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{formatCurrency(item.amount)}</span>
                            <span className={`flex items-center ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.change >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                              {Math.abs(item.change)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(item.amount / financialMetrics.revenue.total) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {((item.amount / financialMetrics.revenue.total) * 100).toFixed(1)}% of total revenue
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Expenses Section */}
          <Card className="bg-white">
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('expenses')}>
              <div className="flex justify-between items-center">
                <CardTitle>Expense Breakdown</CardTitle>
                {expandedSections.includes('expenses') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </CardHeader>
            
            {expandedSections.includes('expenses') && (
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Expense Categories</h3>
                    <span className="text-sm text-gray-500">Total: {formatCurrency(financialMetrics.expenses.total)}</span>
                  </div>
                  
                  <div className="space-y-4">
                    {financialMetrics.expenses.breakdown.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{formatCurrency(item.amount)}</span>
                            {item.change !== 0 && (
                              <span className={`flex items-center ${item.change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.change < 0 ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                                {Math.abs(item.change)}%
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-amber-500 h-2.5 rounded-full" 
                            style={{ width: `${(item.amount / financialMetrics.expenses.total) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {((item.amount / financialMetrics.expenses.total) * 100).toFixed(1)}% of total expenses
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Profit & Loss Summary */}
          <Card className="bg-white">
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('profit')}>
              <div className="flex justify-between items-center">
                <CardTitle>Profit & Loss Summary</CardTitle>
                {expandedSections.includes('profit') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </CardHeader>
            
            {expandedSections.includes('profit') && (
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-700 font-medium mb-1">Total Revenue</div>
                      <div className="text-2xl font-bold text-green-900">{formatCurrency(financialMetrics.revenue.total)}</div>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="text-sm text-amber-700 font-medium mb-1">Total Expenses</div>
                      <div className="text-2xl font-bold text-amber-900">{formatCurrency(financialMetrics.expenses.total)}</div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-700 font-medium mb-1">Net Profit</div>
                      <div className="text-2xl font-bold text-blue-900">{formatCurrency(financialMetrics.profit.total)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Profit Margin</span>
                      <span className="font-medium">{financialMetrics.profit.margin.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${financialMetrics.profit.margin}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-end text-sm text-gray-500">
                      Previous period: {financialMetrics.profit.previousMargin.toFixed(1)}%
                      <span className={`flex items-center ml-2 ${financialMetrics.profit.margin > financialMetrics.profit.previousMargin ? 'text-green-600' : 'text-red-600'}`}>
                        {financialMetrics.profit.margin > financialMetrics.profit.previousMargin ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {Math.abs(financialMetrics.profit.margin - financialMetrics.profit.previousMargin).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
      
      {/* Reports Action Bar */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
        <div>
          <span className="text-sm font-medium">Reporting Period: </span>
          <span className="text-sm">May 2025</span>
        </div>
        <div className="flex space-x-3">
          <Button leftIcon={<Calendar size={16} />} variant="outline" size="sm">
            Schedule Reports
          </Button>
          <Button leftIcon={<Share2 size={16} />} variant="outline" size="sm">
            Share
          </Button>
          <Button leftIcon={<Printer size={16} />} variant="outline" size="sm">
            Print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportsPage;