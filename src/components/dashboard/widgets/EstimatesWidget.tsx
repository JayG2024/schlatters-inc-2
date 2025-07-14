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
import { 
  FileText, 
  ArrowRight, 
  Download, 
  Check,
  X,
  Plus
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../lib/utils';

export interface Estimate {
  id: string;
  number: string;
  clientName: string;
  date: string;
  expiryDate: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected' | 'expired';
}

interface EstimatesWidgetProps {
  estimates: Estimate[];
  onViewAll?: () => void;
  onCreateEstimate?: () => void;
  onApproveEstimate?: (estimateId: string) => void;
  onRejectEstimate?: (estimateId: string) => void;
  onDownloadEstimate?: (estimateId: string) => void;
  className?: string;
  userType: 'admin' | 'client';
}

const getStatusBadge = (status: Estimate['status']) => {
  switch (status) {
    case 'approved':
      return <Badge variant="success">Approved</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'rejected':
      return <Badge variant="danger">Rejected</Badge>;
    case 'expired':
      return <Badge variant="default">Expired</Badge>;
  }
};

export const EstimatesWidget: React.FC<EstimatesWidgetProps> = ({
  estimates,
  onViewAll,
  onCreateEstimate,
  onApproveEstimate,
  onRejectEstimate,
  onDownloadEstimate,
  className,
  userType,
}) => {
  // Sort estimates by date (newest first), but pending first
  const sortedEstimates = [...estimates].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Estimates & Proposals</CardTitle>
          {userType === 'admin' && (
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={onCreateEstimate}
            >
              Create
            </Button>
          )}
        </div>
        <CardDescription>
          {userType === 'admin' 
            ? 'Recent estimates sent to clients' 
            : 'Your estimates and proposals'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {sortedEstimates.slice(0, 4).map((estimate) => (
          <div 
            key={estimate.id} 
            className="p-3 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-900">
                    Estimate #{estimate.number}
                  </span>
                </div>
                
                {userType === 'admin' && (
                  <div className="text-sm text-gray-500 mt-1 ml-6">
                    {estimate.clientName}
                  </div>
                )}
              </div>
              {getStatusBadge(estimate.status)}
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold">
                  {formatCurrency(estimate.amount)}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Created {formatDate(estimate.date)}
                  {estimate.status === 'pending' && (
                    <span> • Expires {formatDate(estimate.expiryDate)}</span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Download size={14} />}
                  onClick={() => onDownloadEstimate?.(estimate.id)}
                  title="Download Estimate"
                />
                
                {estimate.status === 'pending' && userType === 'client' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<X size={14} />}
                      onClick={() => onRejectEstimate?.(estimate.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<Check size={14} />}
                      onClick={() => onApproveEstimate?.(estimate.id)}
                    >
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {estimates.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <FileText size={24} className="mx-auto mb-2 text-gray-400" />
            <p>No estimates found</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Button 
          variant="ghost"
          size="sm"
          className="w-full text-blue-600 hover:text-blue-700"
          rightIcon={<ArrowRight size={16} />}
          onClick={onViewAll}
        >
          View All Estimates
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EstimatesWidget;