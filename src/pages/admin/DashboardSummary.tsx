import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import KPICard from '../../components/ui/KPICard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Progress from '../../components/ui/Progress';
import { 
  Users,
  DollarSign,
  Phone,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CreditCard,
  Calendar,
  MessageSquare,
  Timer,
  Percent,
  RefreshCw,
  FileText,
  PhoneCall,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../../lib/utils';
import { useOpenPhoneData, useCallStatistics } from '../../hooks/useOpenPhoneData';
import { useQuickBooksData, useOverdueInvoices } from '../../hooks/useQuickBooksData';

// Main dashboard matching the exact specification
const DashboardSummary: React.FC = () => {
  const { calls, messages, loading: openPhoneLoading, syncData: syncOpenPhone, syncing: openPhoneSyncing } = useOpenPhoneData();
  const { stats: callStats, loading: statsLoading } = useCallStatistics();
  const { stats: qbStats, loading: qbLoading, syncData: syncQB, syncing: qbSyncing } = useQuickBooksData();
  const { overdueInvoices, loading: overdueLoading } = useOverdueInvoices();

  // Calculate all required KPIs
  const calculateKPIs = () => {
    // Financial Overview KPIs
    const activeSubscriptions = 0; // TODO: Connect to subscriptions data
    const annualSubscriptionRevenue = activeSubscriptions * 1500;
    const priorYearCredit = 0; // TODO: Calculate from QB lookback
    const emergencyAddOnRevenue = 0; // TODO: Calculate from after-hours charges
    const dailyInvoicedAmount = 0; // TODO: Calculate from pay-as-you-go
    const avgRevenuePerTicket = 0; // TODO: Calculate
    const customerConversionRate = 0; // TODO: Calculate
    const churnRate = 0; // TODO: Calculate

    // Billing & Collections KPIs
    const unpaidInvoicesCount = overdueInvoices.length;
    const unpaidInvoiceValue = overdueInvoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);
    const overdueDaysAverage = overdueInvoices.length > 0 
      ? overdueInvoices.reduce((sum, inv) => {
          const daysOverdue = Math.floor((new Date().getTime() - new Date(inv.due_date).getTime()) / (1000 * 60 * 60 * 24));
          return sum + daysOverdue;
        }, 0) / overdueInvoices.length
      : 0;
    const expiredCardsPercentage = 0; // TODO: Implement
    const lapsedSubscriptions = 0; // TODO: Implement
    const renewalRemindersSent = 0; // TODO: Implement
    const paymentRecoveryRate = 0; // TODO: Implement

    // Support Call Metrics
    const totalSupportCalls = callStats.totalCalls;
    const avgCallDuration = callStats.averageDuration ? Math.round(callStats.averageDuration / 60) : 0; // Convert to minutes
    const maxCallDuration = 0; // TODO: Calculate from calls data
    const billableCallsRatio = 0; // TODO: Calculate based on duration thresholds
    const dailySupportVolume = 0; // TODO: Calculate
    const supportCostVsRevenue = 0; // TODO: Calculate

    // Text & Communication Tracking
    const textsSent = messages.filter(m => m.direction === 'outbound').length;
    const textsReceived = messages.filter(m => m.direction === 'inbound').length;
    const textToCallRatio = calls.length > 0 ? (textsSent + textsReceived) / calls.length : 0;
    const timeToFirstResponse = 0; // TODO: Calculate
    const automatedReminderEffectiveness = 0; // TODO: Calculate

    return {
      financial: {
        activeSubscriptions,
        annualSubscriptionRevenue,
        priorYearCredit,
        emergencyAddOnRevenue,
        dailyInvoicedAmount,
        avgRevenuePerTicket,
        customerConversionRate,
        churnRate
      },
      billing: {
        unpaidInvoicesCount,
        unpaidInvoiceValue,
        overdueDaysAverage,
        expiredCardsPercentage,
        lapsedSubscriptions,
        renewalRemindersSent,
        paymentRecoveryRate
      },
      support: {
        totalSupportCalls,
        avgCallDuration,
        maxCallDuration,
        billableCallsRatio,
        dailySupportVolume,
        supportCostVsRevenue
      },
      communication: {
        textsSent,
        textsReceived,
        totalTexts: textsSent + textsReceived,
        textToCallRatio,
        timeToFirstResponse,
        automatedReminderEffectiveness
      }
    };
  };

  const kpis = calculateKPIs();
  const isLoading = openPhoneLoading || statsLoading || qbLoading || overdueLoading;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard Summary
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Custom AI Tech App - Financial & Operational Overview
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            leftIcon={openPhoneSyncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            onClick={syncOpenPhone}
            disabled={openPhoneSyncing}
          >
            Sync OpenPhone
          </Button>
          <Button 
            variant="outline"
            leftIcon={qbSyncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            onClick={syncQB}
            disabled={qbSyncing}
          >
            Sync QuickBooks
          </Button>
        </div>
      </div>

      {/* 1. Financial Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <DollarSign size={24} className="text-green-600" />
            Financial Overview (Recurring + Pay-As-You-Go)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Subscriptions</span>
                <Users size={16} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{kpis.financial.activeSubscriptions}</p>
              <p className="text-xs text-gray-500 mt-1">Number of current $1,500 subscribers</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Annual Subscription Revenue</span>
                <TrendingUp size={16} className="text-green-600" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(kpis.financial.annualSubscriptionRevenue)}</p>
              <p className="text-xs text-gray-500 mt-1">$1,500 × active subscribers</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Prior-Year Credit Issued</span>
                <CreditCard size={16} className="text-purple-600" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(kpis.financial.priorYearCredit)}</p>
              <p className="text-xs text-gray-500 mt-1">Total subscription discounts based on QB lookback</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Emergency Add-On Revenue</span>
                <AlertTriangle size={16} className="text-orange-600" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(kpis.financial.emergencyAddOnRevenue)}</p>
              <p className="text-xs text-gray-500 mt-1">After-hours/holiday charges beyond plan</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Daily Invoiced Amount</span>
                <Calendar size={16} className="text-indigo-600" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(kpis.financial.dailyInvoicedAmount)}</p>
              <p className="text-xs text-gray-500 mt-1">From pay-as-you-go support services</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Revenue per Support Ticket</span>
                <FileText size={16} className="text-teal-600" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(kpis.financial.avgRevenuePerTicket)}</p>
              <p className="text-xs text-gray-500 mt-1">Daily total ÷ number of billable tickets</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Customer Conversion Rate</span>
                <Percent size={16} className="text-green-600" />
              </div>
              <p className="text-2xl font-bold">{formatPercent(kpis.financial.customerConversionRate)}</p>
              <p className="text-xs text-gray-500 mt-1">% of pay-as-you-go users converting to subscription</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Churn Rate</span>
                <TrendingDown size={16} className="text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{formatPercent(kpis.financial.churnRate)}</p>
              <p className="text-xs text-gray-500 mt-1">% of subscribers not renewing</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Billing & Collections Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CreditCard size={24} className="text-purple-600" />
            Billing & Collections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Unpaid Invoices Count</span>
                <FileText size={16} className="text-red-600" />
              </div>
              <p className="text-2xl font-bold">{kpis.billing.unpaidInvoicesCount}</p>
              <p className="text-xs text-gray-500 mt-1">Number of overdue invoices</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Unpaid Invoice Value</span>
                <DollarSign size={16} className="text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(kpis.billing.unpaidInvoiceValue)}</p>
              <p className="text-xs text-gray-500 mt-1">Total value of unpaid invoices</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Overdue Days – Average</span>
                <Clock size={16} className="text-orange-600" />
              </div>
              <p className="text-2xl font-bold">{Math.round(kpis.billing.overdueDaysAverage)}</p>
              <p className="text-xs text-gray-500 mt-1">Avg number of days past due</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Expired Cards on File</span>
                <CreditCard size={16} className="text-yellow-600" />
              </div>
              <p className="text-2xl font-bold">{formatPercent(kpis.billing.expiredCardsPercentage)}</p>
              <p className="text-xs text-gray-500 mt-1">% of customers with expired billing info</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Lapsed Subscriptions</span>
                <Users size={16} className="text-gray-600" />
              </div>
              <p className="text-2xl font-bold">{kpis.billing.lapsedSubscriptions}</p>
              <p className="text-xs text-gray-500 mt-1">Count of expired, non-renewed subscribers</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Renewal Reminder Sent</span>
                <MessageSquare size={16} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{formatPercent(kpis.billing.renewalRemindersSent)}</p>
              <p className="text-xs text-gray-500 mt-1">% of upcoming renewals with notice sent</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Payment Recovery Rate</span>
                <TrendingUp size={16} className="text-green-600" />
              </div>
              <p className="text-2xl font-bold">{formatPercent(kpis.billing.paymentRecoveryRate)}</p>
              <p className="text-xs text-gray-500 mt-1">% of unpaid accounts that later paid</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Support Call Metrics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Phone size={24} className="text-blue-600" />
            Support Call Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Support Calls</span>
                <PhoneCall size={16} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{kpis.support.totalSupportCalls}</p>
              <p className="text-xs text-gray-500 mt-1">All support calls (inbound + outbound)</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average Call Duration</span>
                <Timer size={16} className="text-purple-600" />
              </div>
              <p className="text-2xl font-bold">{kpis.support.avgCallDuration} min</p>
              <p className="text-xs text-gray-500 mt-1">Mean duration of support calls</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Max Call Duration</span>
                <Clock size={16} className="text-red-600" />
              </div>
              <p className="text-2xl font-bold">{kpis.support.maxCallDuration} min</p>
              <p className="text-xs text-gray-500 mt-1">Longest support call recorded</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Billable vs Non-Billable</span>
                <Percent size={16} className="text-green-600" />
              </div>
              <p className="text-2xl font-bold">{formatPercent(kpis.support.billableCallsRatio)}</p>
              <p className="text-xs text-gray-500 mt-1">Based on duration thresholds</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Daily Support Volume</span>
                <Calendar size={16} className="text-indigo-600" />
              </div>
              <p className="text-2xl font-bold">{kpis.support.dailySupportVolume}</p>
              <p className="text-xs text-gray-500 mt-1"># of support sessions per day</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Support Cost vs Revenue</span>
                <DollarSign size={16} className="text-orange-600" />
              </div>
              <p className="text-2xl font-bold">{formatPercent(kpis.support.supportCostVsRevenue)}</p>
              <p className="text-xs text-gray-500 mt-1">Total cost to deliver vs earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Text & Communication Tracking Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageSquare size={24} className="text-indigo-600" />
            Text & Communication Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Texts Sent/Received</span>
                <MessageSquare size={16} className="text-indigo-600" />
              </div>
              <p className="text-2xl font-bold">{kpis.communication.totalTexts}</p>
              <p className="text-xs text-gray-500 mt-1">
                Sent: {kpis.communication.textsSent} | Received: {kpis.communication.textsReceived}
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Text-to-Call Ratio</span>
                <Phone size={16} className="text-teal-600" />
              </div>
              <p className="text-2xl font-bold">{kpis.communication.textToCallRatio.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Compares preferred support methods</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Time to First Response</span>
                <Clock size={16} className="text-yellow-600" />
              </div>
              <p className="text-2xl font-bold">{kpis.communication.timeToFirstResponse} min</p>
              <p className="text-xs text-gray-500 mt-1">Delay from customer outreach to reply</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Reminder Effectiveness</span>
                <TrendingUp size={16} className="text-green-600" />
              </div>
              <p className="text-2xl font-bold">{formatPercent(kpis.communication.automatedReminderEffectiveness)}</p>
              <p className="text-xs text-gray-500 mt-1">% of payments within 48 hrs of reminder</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-auto p-4 flex flex-col items-center gap-2"
          onClick={() => window.location.href = '/admin/billing/subscriptions'}
        >
          <Users size={24} />
          <span>Manage Subscriptions</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto p-4 flex flex-col items-center gap-2"
          onClick={() => window.location.href = '/admin/time-tracking'}
        >
          <Clock size={24} />
          <span>Support Logs</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto p-4 flex flex-col items-center gap-2"
          onClick={() => window.location.href = '/admin/billing'}
        >
          <FileText size={24} />
          <span>Invoices & Aging</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto p-4 flex flex-col items-center gap-2"
          onClick={() => window.location.href = '/admin/communications'}
        >
          <MessageSquare size={24} />
          <span>Reminders & Renewals</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardSummary;