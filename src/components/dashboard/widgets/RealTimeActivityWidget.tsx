import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '../../ui/Card';
import Badge from '../../ui/Badge';
import { 
  Phone, 
  MessageSquare, 
  DollarSign, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Activity,
  Calendar,
  Mail,
  Bell,
  TrendingUp
} from 'lucide-react';
import { formatRelativeTime } from '../../../lib/utils';

type ActivityType = 
  | 'call_received' 
  | 'call_completed'
  | 'sms_sent'
  | 'sms_received'
  | 'payment_received'
  | 'invoice_sent'
  | 'invoice_viewed'
  | 'invoice_overdue'
  | 'appointment_scheduled'
  | 'email_sent'
  | 'high_value_activity';

interface Activity {
  id: string;
  type: ActivityType;
  timestamp: Date;
  title: string;
  description: string;
  customerName?: string;
  amount?: number;
  duration?: number; // for calls in seconds
  isImportant?: boolean;
  actionRequired?: boolean;
  relatedActivities?: string[]; // IDs of related activities
}

interface RealTimeActivityWidgetProps {
  activities: Activity[];
  onActivityClick?: (activity: Activity) => void;
  className?: string;
}

const getActivityIcon = (type: ActivityType) => {
  const iconProps = { size: 16 };
  switch (type) {
    case 'call_received':
    case 'call_completed':
      return <Phone {...iconProps} className="text-blue-500" />;
    case 'sms_sent':
    case 'sms_received':
      return <MessageSquare {...iconProps} className="text-purple-500" />;
    case 'payment_received':
      return <DollarSign {...iconProps} className="text-green-500" />;
    case 'invoice_sent':
    case 'invoice_viewed':
    case 'invoice_overdue':
      return <FileText {...iconProps} className="text-orange-500" />;
    case 'appointment_scheduled':
      return <Calendar {...iconProps} className="text-indigo-500" />;
    case 'email_sent':
      return <Mail {...iconProps} className="text-gray-500" />;
    case 'high_value_activity':
      return <TrendingUp {...iconProps} className="text-red-500" />;
    default:
      return <Activity {...iconProps} className="text-gray-500" />;
  }
};

const getActivityColor = (type: ActivityType): string => {
  switch (type) {
    case 'payment_received':
      return 'border-l-green-500';
    case 'invoice_overdue':
      return 'border-l-red-500';
    case 'high_value_activity':
      return 'border-l-yellow-500';
    case 'call_received':
    case 'call_completed':
      return 'border-l-blue-500';
    default:
      return 'border-l-gray-300 dark:border-l-gray-600';
  }
};

export const RealTimeActivityWidget: React.FC<RealTimeActivityWidgetProps> = ({
  activities,
  onActivityClick,
  className
}) => {
  const [liveActivities, setLiveActivities] = useState<Activity[]>(activities);
  const [hasNewActivity, setHasNewActivity] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In production, this would be replaced with WebSocket or webhook listeners
      setHasNewActivity(true);
      setTimeout(() => setHasNewActivity(false), 3000);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Group related activities
  const groupedActivities = liveActivities.reduce((acc, activity) => {
    if (activity.relatedActivities && activity.relatedActivities.length > 0) {
      // Check if this is part of an existing group
      const existingGroup = acc.find(group => 
        group.some(a => a.id === activity.id || activity.relatedActivities?.includes(a.id))
      );
      if (existingGroup) {
        existingGroup.push(activity);
      } else {
        acc.push([activity]);
      }
    } else {
      acc.push([activity]);
    }
    return acc;
  }, [] as Activity[][]);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity size={20} />
              Real-Time Activity Feed
            </CardTitle>
            <CardDescription>
              Live updates from all systems
            </CardDescription>
          </div>
          {hasNewActivity && (
            <Badge variant="success" className="animate-pulse flex items-center gap-1">
              <Bell size={12} />
              New Activity
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {groupedActivities.slice(0, 8).map((group, groupIndex) => {
          const isGrouped = group.length > 1;
          const primaryActivity = group[0];
          
          return (
            <div 
              key={primaryActivity.id}
              className={`relative ${isGrouped ? 'space-y-2' : ''}`}
            >
              {isGrouped && (
                <div className="absolute left-0 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 ml-2" />
              )}
              
              {group.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`
                    flex items-start gap-3 p-3 bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-700 rounded-lg
                    hover:border-gray-300 dark:hover:border-gray-600 transition-colors
                    cursor-pointer border-l-4 ${getActivityColor(activity.type)}
                    ${index > 0 ? 'ml-6' : ''}
                    ${activity.isImportant ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
                  `}
                  onClick={() => onActivityClick?.(activity)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {activity.title}
                        </p>
                        {activity.customerName && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                            {activity.customerName}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {activity.description}
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                        {activity.amount && (
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                            ${activity.amount.toLocaleString()}
                          </p>
                        )}
                        {activity.duration && (
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(activity.duration / 60)}m
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {activity.actionRequired && (
                      <div className="flex items-center gap-1 mt-2">
                        <AlertCircle size={12} className="text-orange-500" />
                        <span className="text-xs text-orange-600 dark:text-orange-400">
                          Action Required
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isGrouped && (
                <div className="ml-6 text-xs text-gray-500 dark:text-gray-400 italic">
                  {group.length} related activities
                </div>
              )}
            </div>
          );
        })}

        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Activity size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
            <p className="text-xs mt-1">Activities will appear here as they happen</p>
          </div>
        )}

        {/* Live Indicator */}
        <div className="flex items-center justify-center pt-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live feed active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeActivityWidget;