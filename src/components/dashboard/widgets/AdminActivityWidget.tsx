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
import { 
  ArrowRight, 
  Activity,
  User,
  Clock,
  CreditCard,
  FileText,
  Bell,
  MessageSquare,
  UserPlus,
  Edit,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { formatDateTime } from '../../../lib/utils';

export interface ActivityEntry {
  id: string;
  action: 'created' | 'updated' | 'deleted' | 'approved' | 'rejected' | 'assigned' | 'sent';
  target: 'invoice' | 'client' | 'document' | 'estimate' | 'notification' | 'ticket' | 'message';
  user: {
    id: string;
    name: string;
  };
  details: string;
  timestamp: string;
}

interface AdminActivityWidgetProps {
  activities: ActivityEntry[];
  onViewAll?: () => void;
  className?: string;
}

const getActivityIcon = (activity: ActivityEntry) => {
  // Get icon based on target
  const targetIcons = {
    invoice: <CreditCard size={16} />,
    client: <User size={16} />,
    document: <FileText size={16} />,
    estimate: <FileText size={16} />,
    notification: <Bell size={16} />,
    ticket: <MessageSquare size={16} />,
    message: <MessageSquare size={16} />,
  };

  // Override with action-specific icons
  if (activity.action === 'created' && activity.target === 'client') {
    return <UserPlus size={16} />;
  } else if (activity.action === 'updated') {
    return <Edit size={16} />;
  } else if (activity.action === 'deleted') {
    return <Trash2 size={16} />;
  } else if (activity.action === 'approved') {
    return <CheckCircle size={16} />;
  }

  return targetIcons[activity.target] || <Activity size={16} />;
};

const getActivityDescription = (activity: ActivityEntry): string => {
  const actionVerb = {
    created: 'created',
    updated: 'updated',
    deleted: 'deleted',
    approved: 'approved',
    rejected: 'rejected',
    assigned: 'assigned',
    sent: 'sent',
  }[activity.action];

  const targetName = {
    invoice: 'an invoice',
    client: 'a client',
    document: 'a document',
    estimate: 'an estimate',
    notification: 'a notification',
    ticket: 'a support ticket',
    message: 'a message',
  }[activity.target];

  return `${activity.user.name} ${actionVerb} ${targetName}`;
};

export const AdminActivityWidget: React.FC<AdminActivityWidgetProps> = ({
  activities,
  onViewAll,
  className,
}) => {
  // Sort activities by timestamp (newest first)
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">Team Activity</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Recent actions taken by team members
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="border-l-2 border-primary-200 dark:border-primary-700 ml-1.5 pl-6 space-y-6">
          {sortedActivities.slice(0, 8).map((activity) => (
            <div key={activity.id} className="relative">
              {/* Activity dot */}
              <div className="absolute -left-[29px] mt-1.5 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-2 border-brand-yellow"></div>
              
              <div>
                <div className="flex items-start gap-2">
                  <div className="p-1.5 rounded-md bg-brand-yellow/10 text-primary-800 dark:text-primary-200">
                    {getActivityIcon(activity)}
                  </div>
                  <div>
                    <p className="font-medium text-primary-900 dark:text-primary-100">
                      {getActivityDescription(activity)}
                    </p>
                    <p className="text-sm text-primary-600 dark:text-primary-400 mt-0.5">
                      {activity.details}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-primary-500 dark:text-primary-400">
                      <Clock size={12} />
                      <span>{formatDateTime(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-6 text-primary-500 dark:text-primary-400">
              <Activity size={24} className="mx-auto mb-2 text-primary-400 dark:text-primary-500" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Button 
          variant="ghost"
          size="sm"
          className="w-full text-primary-700 hover:text-primary-900 dark:text-primary-300 dark:hover:text-primary-100"
          rightIcon={<ArrowRight size={16} />}
          onClick={onViewAll}
        >
          View All Activity
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminActivityWidget;