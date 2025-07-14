import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '../../ui/Card';
import Badge from '../../ui/Badge';
import Progress from '../../ui/Progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Phone, 
  MessageSquare, 
  DollarSign, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Users
} from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';

interface CustomerMetrics {
  id: string;
  name: string;
  // Financial metrics from QuickBooks
  totalRevenue: number;
  outstandingBalance: number;
  averagePaymentDays: number;
  paymentTrend: 'improving' | 'stable' | 'declining';
  // Communication metrics from OpenPhone
  lastContactDays: number;
  totalCalls: number;
  totalMessages: number;
  avgCallDuration: number; // in seconds
  responseRate: number; // percentage
  // Combined intelligence
  riskScore: 'low' | 'medium' | 'high';
  recommendedAction?: string;
  lifetimeValue: number;
  communicationHealth: 'excellent' | 'good' | 'needs-attention' | 'poor';
}

interface CustomerIntelligenceWidgetProps {
  customers: CustomerMetrics[];
  className?: string;
}

const getRiskBadge = (risk: CustomerMetrics['riskScore']) => {
  switch (risk) {
    case 'low':
      return <Badge variant="success" className="flex items-center gap-1">
        <CheckCircle size={12} /> Low Risk
      </Badge>;
    case 'medium':
      return <Badge variant="warning" className="flex items-center gap-1">
        <AlertTriangle size={12} /> Medium Risk
      </Badge>;
    case 'high':
      return <Badge variant="danger" className="flex items-center gap-1">
        <AlertTriangle size={12} /> High Risk
      </Badge>;
  }
};

const getCommunicationHealthColor = (health: CustomerMetrics['communicationHealth']) => {
  switch (health) {
    case 'excellent': return 'text-green-600 dark:text-green-400';
    case 'good': return 'text-blue-600 dark:text-blue-400';
    case 'needs-attention': return 'text-yellow-600 dark:text-yellow-400';
    case 'poor': return 'text-red-600 dark:text-red-400';
  }
};

export const CustomerIntelligenceWidget: React.FC<CustomerIntelligenceWidgetProps> = ({
  customers,
  className
}) => {
  // Sort by risk score (high risk first) and outstanding balance
  const prioritizedCustomers = [...customers].sort((a, b) => {
    const riskWeight = { high: 3, medium: 2, low: 1 };
    const riskDiff = riskWeight[b.riskScore] - riskWeight[a.riskScore];
    if (riskDiff !== 0) return riskDiff;
    return b.outstandingBalance - a.outstandingBalance;
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={20} />
          Customer Intelligence
        </CardTitle>
        <CardDescription>
          Combined financial and communication insights
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {prioritizedCustomers.slice(0, 5).map((customer) => (
          <div 
            key={customer.id}
            className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            {/* Customer Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {customer.name}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500">
                    LTV: {formatCurrency(customer.lifetimeValue)}
                  </span>
                  {customer.paymentTrend === 'improving' && (
                    <TrendingUp size={14} className="text-green-500" />
                  )}
                  {customer.paymentTrend === 'declining' && (
                    <TrendingDown size={14} className="text-red-500" />
                  )}
                </div>
              </div>
              {getRiskBadge(customer.riskScore)}
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Financial Health */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Financial</span>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(customer.outstandingBalance)}
                </div>
                <div className="text-xs text-gray-500">
                  Pays in ~{customer.averagePaymentDays} days
                </div>
              </div>

              {/* Communication Health */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Communication</span>
                </div>
                <div className={`text-sm font-medium ${getCommunicationHealthColor(customer.communicationHealth)}`}>
                  {customer.communicationHealth.charAt(0).toUpperCase() + customer.communicationHealth.slice(1)}
                </div>
                <div className="text-xs text-gray-500">
                  {customer.lastContactDays === 0 ? 'Today' : 
                   customer.lastContactDays === 1 ? 'Yesterday' :
                   `${customer.lastContactDays} days ago`}
                </div>
              </div>
            </div>

            {/* Communication Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <Phone size={12} />
                {customer.totalCalls} calls
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={12} />
                {customer.totalMessages} msgs
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {Math.round(customer.avgCallDuration / 60)}m avg
              </span>
            </div>

            {/* Response Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Response Rate</span>
                <span className="text-gray-700 dark:text-gray-300">{customer.responseRate}%</span>
              </div>
              <Progress value={customer.responseRate} className="h-1.5" />
            </div>

            {/* Recommended Action */}
            {customer.recommendedAction && (
              <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300">
                💡 {customer.recommendedAction}
              </div>
            )}
          </div>
        ))}

        {/* Summary Stats */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {customers.filter(c => c.riskScore === 'high').length}
              </div>
              <div className="text-xs text-gray-500">High Risk</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(
                  customers.reduce((sum, c) => sum + c.outstandingBalance, 0)
                )}
              </div>
              <div className="text-xs text-gray-500">Total Outstanding</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {Math.round(
                  customers.reduce((sum, c) => sum + c.responseRate, 0) / customers.length
                )}%
              </div>
              <div className="text-xs text-gray-500">Avg Response</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerIntelligenceWidget;