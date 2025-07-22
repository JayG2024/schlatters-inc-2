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
import Progress from '../../ui/Progress';
import Badge from '../../ui/Badge';
import { ArrowRight, ZapIcon, CheckCircle, Clock } from 'lucide-react';
import { cn, formatPercentage } from '../../../lib/utils';

export interface PlanInfo {
  name: string;
  tier: 'Lite' | 'Mid' | 'Pro';
  textUsage: {
    used: number;
    total: number;
  };
  callUsage: {
    used: number;
    total: number;
  };
  consultingUsage: {
    used: number;
    total: number;
  };
  renewalDate: string;
}

interface PlanUsageWidgetProps {
  planInfo: PlanInfo;
  onUpgrade?: () => void;
  className?: string;
  loading?: boolean;
}

const getTierColor = (tier: 'Lite' | 'Mid' | 'Pro') => {
  switch (tier) {
    case 'Lite':
      return 'bg-blue-50 text-blue-700';
    case 'Mid':
      return 'bg-purple-50 text-purple-700';
    case 'Pro':
      return 'bg-indigo-50 text-indigo-700';
  }
};

const getUsageVariant = (percentUsed: number) => {
  if (percentUsed < 60) return 'default';
  if (percentUsed < 85) return 'warning';
  return 'danger';
};

export const PlanUsageWidget: React.FC<PlanUsageWidgetProps> = ({
  planInfo,
  onUpgrade,
  className,
  loading = false,
}) => {
  const textPercentage = (planInfo.textUsage.used / planInfo.textUsage.total) * 100;
  const callPercentage = (planInfo.callUsage.used / planInfo.callUsage.total) * 100;
  const consultingPercentage = 
    (planInfo.consultingUsage.used / planInfo.consultingUsage.total) * 100;
  
  const isNearLimit = 
    textPercentage > 80 || 
    callPercentage > 80 || 
    consultingPercentage > 80;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Plan & Usage</CardTitle>
          <div 
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold',
              getTierColor(planInfo.tier)
            )}
          >
            {planInfo.tier} Plan
          </div>
        </div>
        <CardDescription>
          Usage for current billing cycle
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></span>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Text Messages</span>
                <span className="text-gray-500">
                  {planInfo.textUsage.used} / {planInfo.textUsage.total}
                </span>
              </div>
              <Progress 
                value={textPercentage} 
                variant={getUsageVariant(textPercentage)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Phone Calls</span>
                <span className="text-gray-500">
                  {planInfo.callUsage.used} / {planInfo.callUsage.total}
                </span>
              </div>
              <Progress 
                value={callPercentage} 
                variant={getUsageVariant(callPercentage)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Consulting Hours</span>
                <span className="text-gray-500">
                  {planInfo.consultingUsage.used} / {planInfo.consultingUsage.total}
                </span>
              </div>
              <Progress 
                value={consultingPercentage} 
                variant={getUsageVariant(consultingPercentage)}
              />
            </div>

            {isNearLimit && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-md flex items-start gap-2">
                <Clock size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">You're nearing your plan limits</p>
                  <p className="mt-1">Consider upgrading your plan to avoid overages.</p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 pt-0 pb-4">
        <div className="w-full flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>Renews on {planInfo.renewalDate}</span>
          </div>
        </div>
        <Button 
          variant="outline"
          size="sm"
          className="w-full"
          rightIcon={<ArrowRight size={16} />}
          onClick={onUpgrade}
        >
          View Plan Options
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanUsageWidget;