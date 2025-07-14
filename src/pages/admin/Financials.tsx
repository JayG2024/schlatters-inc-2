import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Building,
  Zap,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Progress from '../../components/ui/Progress';
import { formatCurrency, formatDate, formatPercentage } from '../../lib/utils';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
  account: string;
  client?: string;
}

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  lastUpdated: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  category: string;
  color: string;
}

interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  status: 'paid' | 'due' | 'overdue';
  autoPayEnabled: boolean;
}

interface Investment {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  change: number;
  changePercent: number;
}

// Data will be fetched from Supabase
const mockAccounts: Account[] = [];

const mockTransactions: Transaction[] = [];

const mockBudgetCategories: BudgetCategory[] = [];

const mockFinancialGoals: FinancialGoal[] = [];

const mockBills: Bill[] = [];

const mockInvestments: Investment[] = [];

const FinancialsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budget' | 'goals' | 'bills' | 'investments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showBalances, setShowBalances] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleExport = () => {
    console.log('Exporting financial data...');
    // In a real app, this would generate and download a report
  };

  const getTotalBalance = () => {
    return mockAccounts.reduce((total, account) => total + account.balance, 0);
  };

  const getMonthlyIncome = () => {
    return mockTransactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getMonthlyExpenses = () => {
    return Math.abs(mockTransactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((total, t) => total + t.amount, 0));
  };

  const getNetProfit = () => {
    return getMonthlyIncome() - getMonthlyExpenses();
  };

  const getBudgetUtilization = () => {
    const totalBudgeted = mockBudgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
    const totalSpent = mockBudgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
    return (totalSpent / totalBudgeted) * 100;
  };

  const getInvestmentTotal = () => {
    return mockInvestments.reduce((sum, inv) => sum + inv.totalValue, 0);
  };

  const getInvestmentChange = () => {
    return mockInvestments.reduce((sum, inv) => sum + (inv.shares * inv.change), 0);
  };

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return <CreditCard size={20} className="text-blue-600" />;
      case 'savings':
        return <Target size={20} className="text-green-600" />;
      case 'credit':
        return <CreditCard size={20} className="text-red-600" />;
      case 'investment':
        return <TrendingUp size={20} className="text-purple-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <Badge variant="success">Completed</Badge>;
      case 'pending':
      case 'due':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
      case 'overdue':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: FinancialGoal['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="danger">High Priority</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="info">Low Priority</Badge>;
    }
  };

  const filteredTransactions = mockTransactions
    .filter(transaction => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(search) ||
        transaction.category.toLowerCase().includes(search) ||
        (transaction.client && transaction.client.toLowerCase().includes(search))
      );
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'amount':
          aValue = Math.abs(a.amount);
          bValue = Math.abs(b.amount);
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Financial Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive financial overview and management
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              className={`px-3 py-2 text-sm font-medium ${
                selectedPeriod === 'week' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedPeriod('week')}
            >
              Week
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${
                selectedPeriod === 'month' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${
                selectedPeriod === 'quarter' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedPeriod('quarter')}
            >
              Quarter
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium ${
                selectedPeriod === 'year' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            leftIcon={isRefreshing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            onClick={handleRefresh}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            leftIcon={showBalances ? <EyeOff size={16} /> : <Eye size={16} />}
            onClick={() => setShowBalances(!showBalances)}
          >
            {showBalances ? 'Hide' : 'Show'} Balances
          </Button>
          
          <Button leftIcon={<Download size={16} />} onClick={handleExport}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Balance</p>
                <p className="text-2xl font-bold mt-1">
                  {showBalances ? formatCurrency(getTotalBalance()) : '••••••'}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <DollarSign size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp size={14} className="text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+8.2%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Income</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {showBalances ? formatCurrency(getMonthlyIncome()) : '••••••'}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <ArrowUpRight size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp size={14} className="text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12.4%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Expenses</p>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  {showBalances ? formatCurrency(getMonthlyExpenses()) : '••••••'}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <ArrowDownRight size={24} className="text-red-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingDown size={14} className="text-red-500 mr-1" />
              <span className="text-red-600 font-medium">+3.1%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Net Profit</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">
                  {showBalances ? formatCurrency(getNetProfit()) : '••••••'}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart3 size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp size={14} className="text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+15.7%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8 overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
            { key: 'transactions', label: 'Transactions', icon: <CreditCard size={16} /> },
            { key: 'budget', label: 'Budget', icon: <Target size={16} /> },
            { key: 'goals', label: 'Financial Goals', icon: <TrendingUp size={16} /> },
            { key: 'bills', label: 'Bills & Payments', icon: <Calendar size={16} /> },
            { key: 'investments', label: 'Investments', icon: <PieChart size={16} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Account Balances */}
          <Card>
            <CardHeader>
              <CardTitle>Account Balances</CardTitle>
              <CardDescription>Current balances across all accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockAccounts.map((account) => (
                  <div key={account.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getAccountIcon(account.type)}
                        <span className="font-medium">{account.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 capitalize">{account.type}</span>
                    </div>
                    <div className="text-lg font-bold mb-1">
                      {showBalances ? formatCurrency(account.balance) : '••••••'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Updated {formatDate(new Date(account.lastUpdated))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cash Flow Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Trend</CardTitle>
                <CardDescription>Income vs expenses over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2 p-4">
                  {Array.from({ length: 12 }, (_, i) => {
                    const incomeHeight = Math.random() * 80 + 20;
                    const expenseHeight = Math.random() * 60 + 20;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <div className="w-full flex flex-col gap-1">
                          <div 
                            className="bg-green-500 rounded-t-sm" 
                            style={{ height: `${incomeHeight}px` }}
                            title={`Income: ${formatCurrency(Math.random() * 5000 + 2000)}`}
                          ></div>
                          <div 
                            className="bg-red-500 rounded-b-sm" 
                            style={{ height: `${expenseHeight}px` }}
                            title={`Expenses: ${formatCurrency(Math.random() * 3000 + 1000)}`}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm">Expenses</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Spending by category this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBudgetCategories.map((category) => {
                    const percentage = (category.spent / category.budgeted) * 100;
                    return (
                      <div key={category.id}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-gray-500">
                            {formatCurrency(category.spent)} / {formatCurrency(category.budgeted)}
                          </span>
                        </div>
                        <Progress 
                          value={percentage} 
                          variant={percentage > 80 ? 'danger' : percentage > 60 ? 'warning' : 'default'}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Record Transaction</h3>
                    <p className="text-sm text-gray-500">Add income or expense</p>
                  </div>
                  <Plus size={24} className="text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Pay Bills</h3>
                    <p className="text-sm text-gray-500">Manage upcoming payments</p>
                  </div>
                  <Calendar size={24} className="text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">View Reports</h3>
                    <p className="text-sm text-gray-500">Financial analytics</p>
                  </div>
                  <BarChart3 size={24} className="text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="category">Sort by Category</option>
            </select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
            <Button leftIcon={<Filter size={16} />} variant="outline">
              Filter
            </Button>
            <Button leftIcon={<Plus size={16} />}>
              Add Transaction
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All financial transactions and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Description</th>
                      <th className="px-6 py-3 text-left">Category</th>
                      <th className="px-6 py-3 text-left">Account</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                      <th className="px-6 py-3 text-center">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(new Date(transaction.date))}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {transaction.description}
                          {transaction.client && (
                            <div className="text-xs text-gray-500">{transaction.client}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="info">{transaction.category}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.account}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                          <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                            {transaction.type === 'income' ? '+' : ''}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {getStatusBadge(transaction.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-900" title="Delete">
                              <Trash2 size={16} />
                            </button>
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
      )}

      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Budget Overview</h2>
              <p className="text-gray-600">Track spending against planned budgets</p>
            </div>
            <div className="flex gap-3">
              <Button leftIcon={<Settings size={16} />} variant="outline">
                Manage Categories
              </Button>
              <Button leftIcon={<Plus size={16} />}>
                Create Budget
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{formatPercentage(getBudgetUtilization())}</div>
                  <div className="text-sm text-gray-500">Budget Utilized</div>
                  <Progress value={getBudgetUtilization()} className="mt-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2 text-green-600">
                    {formatCurrency(mockBudgetCategories.reduce((sum, cat) => sum + cat.remaining, 0))}
                  </div>
                  <div className="text-sm text-gray-500">Remaining Budget</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">
                    {mockBudgetCategories.filter(cat => (cat.spent / cat.budgeted) > 0.8).length}
                  </div>
                  <div className="text-sm text-gray-500">Categories Over 80%</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget Categories</CardTitle>
              <CardDescription>Detailed breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockBudgetCategories.map((category) => {
                  const percentage = (category.spent / category.budgeted) * 100;
                  const isOverBudget = percentage > 100;
                  const isNearLimit = percentage > 80;

                  return (
                    <div key={category.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{category.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {formatCurrency(category.spent)} / {formatCurrency(category.budgeted)}
                          </div>
                          <div className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(category.remaining)} remaining
                          </div>
                        </div>
                      </div>

                      <Progress 
                        value={Math.min(percentage, 100)} 
                        variant={isOverBudget ? 'danger' : isNearLimit ? 'warning' : 'default'}
                        className="mb-2"
                      />

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{formatPercentage(percentage)} used</span>
                        {isOverBudget && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle size={14} />
                            <span>Over budget by {formatCurrency(category.spent - category.budgeted)}</span>
                          </div>
                        )}
                        {isNearLimit && !isOverBudget && (
                          <div className="flex items-center gap-1 text-amber-600">
                            <AlertTriangle size={14} />
                            <span>Near limit</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Financial Goals</h2>
              <p className="text-gray-600">Track progress towards your financial objectives</p>
            </div>
            <Button leftIcon={<Plus size={16} />}>
              Add Goal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFinancialGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const daysRemaining = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

              return (
                <Card key={goal.id} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{goal.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{goal.category}</p>
                      </div>
                      {getPriorityBadge(goal.priority)}
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Progress</span>
                        <span className="text-sm font-medium">{formatPercentage(progress)}</span>
                      </div>
                      <Progress value={progress} />
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Current:</span>
                        <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Target:</span>
                        <span className="font-medium">{formatCurrency(goal.targetAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Remaining:</span>
                        <span className="font-medium">{formatCurrency(goal.targetAmount - goal.currentAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Deadline:</span>
                        <span className="font-medium">{formatDate(new Date(goal.deadline))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Days left:</span>
                        <span className={`font-medium ${daysRemaining < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                          {daysRemaining} days
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button size="sm" className="w-full">
                        Contribute
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'bills' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Bills & Payments</h2>
              <p className="text-gray-600">Manage upcoming bills and payment schedules</p>
            </div>
            <Button leftIcon={<Plus size={16} />}>
              Add Bill
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">
                    {mockBills.filter(bill => bill.status === 'due').length}
                  </div>
                  <div className="text-sm text-gray-500">Bills Due</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2 text-green-600">
                    {mockBills.filter(bill => bill.autoPayEnabled).length}
                  </div>
                  <div className="text-sm text-gray-500">Auto-Pay Enabled</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2 text-blue-600">
                    {formatCurrency(mockBills.filter(bill => bill.status === 'due').reduce((sum, bill) => sum + bill.amount, 0))}
                  </div>
                  <div className="text-sm text-gray-500">Total Due</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bills</CardTitle>
              <CardDescription>Bills and payment schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <Calendar size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{bill.name}</h3>
                        <p className="text-sm text-gray-500">{bill.category}</p>
                        <p className="text-xs text-gray-500">Due: {formatDate(new Date(bill.dueDate))}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(bill.amount)}</div>
                        <div className="text-xs text-gray-500">
                          {bill.autoPayEnabled ? 'Auto-pay enabled' : 'Manual payment'}
                        </div>
                      </div>
                      {getStatusBadge(bill.status)}
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'investments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Investment Portfolio</h2>
              <p className="text-gray-600">Track your investment performance</p>
            </div>
            <Button leftIcon={<Plus size={16} />}>
              Add Investment
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">
                    {showBalances ? formatCurrency(getInvestmentTotal()) : '••••••'}
                  </div>
                  <div className="text-sm text-gray-500">Total Portfolio Value</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${getInvestmentChange() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {getInvestmentChange() >= 0 ? '+' : ''}{formatCurrency(getInvestmentChange())}
                  </div>
                  <div className="text-sm text-gray-500">Today's Change</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">
                    {mockInvestments.length}
                  </div>
                  <div className="text-sm text-gray-500">Holdings</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Investment Holdings</CardTitle>
              <CardDescription>Current investment positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Symbol</th>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-right">Shares</th>
                      <th className="px-6 py-3 text-right">Price</th>
                      <th className="px-6 py-3 text-right">Total Value</th>
                      <th className="px-6 py-3 text-right">Change</th>
                      <th className="px-6 py-3 text-right">% Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockInvestments.map((investment) => (
                      <tr key={investment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {investment.symbol}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {investment.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {investment.shares}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {formatCurrency(investment.currentPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(investment.totalValue)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${investment.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {investment.change >= 0 ? '+' : ''}{formatCurrency(investment.change)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${investment.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {investment.changePercent >= 0 ? '+' : ''}{investment.changePercent.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FinancialsPage;