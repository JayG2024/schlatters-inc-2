import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import { FileText, ArrowRight, Download, CreditCard, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../lib/utils';

export interface Invoice {
  id: string;
  number: string;
  clientName: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  // Enhanced with communication data
  lastContactDate?: string;
  lastContactType?: 'call' | 'sms' | 'email';
  communicationCount?: number;
  paymentLikelihood?: 'high' | 'medium' | 'low';
}

interface InvoiceWidgetProps {
  invoices: Invoice[];
  onViewAll?: () => void;
  onPayInvoice?: (invoiceId: string) => void;
  onDownloadInvoice?: (invoiceId: string) => void;
  className?: string;
  userType: 'admin' | 'client';
}

const getStatusBadge = (status: Invoice['status']) => {
  switch (status) {
    case 'paid':
      return <Badge variant="success">Paid</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'overdue':
      return <Badge variant="danger">Overdue</Badge>;
  }
};

export const InvoiceWidget: React.FC<InvoiceWidgetProps> = ({
  invoices,
  onViewAll,
  onPayInvoice,
  onDownloadInvoice,
  className,
  userType,
}) => {
  // Sort invoices by due date (oldest first for pending/overdue)
  const sortedInvoices = [...invoices].sort((a, b) => {
    if (a.status === 'pending' || a.status === 'overdue') {
      if (b.status === 'pending' || b.status === 'overdue') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return -1;
    }
    if (b.status === 'pending' || b.status === 'overdue') {
      return 1;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">Invoices & Payments</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {userType === 'admin' 
            ? 'Recent invoices and payment status' 
            : 'Your recent invoices and payment status'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {sortedInvoices.slice(0, 4).map((invoice) => (
          <div 
            key={invoice.id} 
            className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-400 dark:text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Invoice #{invoice.number}
                  </span>
                </div>
                
                {userType === 'admin' && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-6">
                    {invoice.clientName}
                  </div>
                )}
              </div>
              {getStatusBadge(invoice.status)}
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(invoice.amount)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {invoice.status === 'paid' 
                    ? `Paid on ${formatDate(new Date(invoice.date))}`
                    : `Due ${formatDate(new Date(invoice.dueDate))}`
                  }
                </div>
                
                {/* Communication Intelligence */}
                {invoice.status !== 'paid' && invoice.lastContactDate && (
                  <div className="flex items-center gap-2 mt-2">
                    {invoice.lastContactType === 'call' && <Phone size={12} className="text-gray-400" />}
                    {invoice.lastContactType === 'sms' && <MessageSquare size={12} className="text-gray-400" />}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last contact: {formatDate(new Date(invoice.lastContactDate))}
                    </span>
                    {invoice.communicationCount && invoice.communicationCount > 3 && (
                      <Badge variant="warning" className="text-xs">
                        {invoice.communicationCount} attempts
                      </Badge>
                    )}
                  </div>
                )}
                
                {/* Payment Likelihood Indicator */}
                {invoice.status === 'overdue' && invoice.paymentLikelihood && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle size={12} className={
                      invoice.paymentLikelihood === 'high' ? 'text-green-500' :
                      invoice.paymentLikelihood === 'medium' ? 'text-yellow-500' : 'text-red-500'
                    } />
                    <span className="text-xs text-gray-500">
                      Payment likelihood: {invoice.paymentLikelihood}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Download size={14} />}
                  onClick={() => onDownloadInvoice?.(invoice.id)}
                  title="Download Invoice"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                />
                
                {(invoice.status === 'pending' || invoice.status === 'overdue') && 
                  userType === 'client' && (
                  <Button
                    size="sm"
                    leftIcon={<CreditCard size={14} />}
                    onClick={() => onPayInvoice?.(invoice.id)}
                  >
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {invoices.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <FileText size={24} className="mx-auto mb-2 text-gray-400 dark:text-gray-600" />
            <p>No invoices found</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Button 
          variant="ghost"
          size="sm"
          className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          rightIcon={<ArrowRight size={16} />}
          onClick={onViewAll}
        >
          View All Invoices
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceWidget;