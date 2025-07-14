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
  Bell, 
  ArrowRight, 
  Plus,
  Settings,
  AlertTriangle,
  Clock,
  CheckCircle,
  X,
} from 'lucide-react';
import { formatDateTime } from '../../../lib/utils';

export interface Alert {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'warning' | 'critical';
  read: boolean;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  isActive: boolean;
}

interface AutomationsWidgetProps {
  alerts: Alert[];
  automations: Automation[];
  onViewAllAlerts?: () => void;
  onViewAllAutomations?: () => void;
  onDismissAlert?: (alertId: string) => void;
  onCreateAutomation?: () => void;
  onToggleAutomation?: (automationId: string, active: boolean) => void;
  className?: string;
}

const getAlertIcon = (type: Alert['type']) => {
  switch (type) {
    case 'info':
      return <Bell size={16} className="text-blue-500" />;
    case 'warning':
      return <AlertTriangle size={16} className="text-amber-500" />;
    case 'critical':
      return <AlertTriangle size={16} className="text-red-500" />;
  }
};

const getAlertBadge = (type: Alert['type']) => {
  switch (type) {
    case 'info':
      return <Badge variant="info">Info</Badge>;
    case 'warning':
      return <Badge variant="warning">Warning</Badge>;
    case 'critical':
      return <Badge variant="danger">Critical</Badge>;
  }
};

export const AutomationsWidget: React.FC<AutomationsWidgetProps> = ({
  alerts,
  automations,
  onViewAllAlerts,
  onViewAllAutomations,
  onDismissAlert,
  onCreateAutomation,
  onToggleAutomation,
  className,
}) => {
  // Sort alerts by timestamp (newest first) and unread first
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (!a.read && b.read) return -1;
    if (a.read && !b.read) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Automations & Alerts</CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Settings size={14} />}
              onClick={onViewAllAutomations}
            >
              Manage
            </Button>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={onCreateAutomation}
            >
              Create
            </Button>
          </div>
        </div>
        <CardDescription>
          Recent alerts and active automations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3">Recent Alerts</h4>
            
            {sortedAlerts.slice(0, 3).map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 mb-2 rounded-md ${
                  alert.read 
                    ? 'bg-white border border-gray-200' 
                    : 'bg-blue-50 border border-blue-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {alert.title}
                        {!alert.read && (
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        {alert.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        {formatDateTime(alert.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getAlertBadge(alert.type)}
                    <button
                      onClick={() => onDismissAlert?.(alert.id)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {sortedAlerts.length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-gray-200 rounded-md">
                <Bell size={20} className="mx-auto mb-1 text-gray-400" />
                <p>No recent alerts</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-sm text-gray-700 mb-3">Active Automations</h4>
            
            {automations.slice(0, 3).map((automation) => (
              <div 
                key={automation.id} 
                className="p-3 mb-2 bg-white border border-gray-200 rounded-md"
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium text-gray-900">{automation.name}</div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={automation.isActive}
                      onChange={(e) => onToggleAutomation?.(automation.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className={`
                      w-9 h-5 rounded-full
                      peer-focus:outline-none 
                      peer-focus:ring-2 
                      peer-focus:ring-blue-300
                      after:content-[''] 
                      after:absolute 
                      after:top-[2px] 
                      after:left-[2px] 
                      after:bg-white 
                      after:rounded-full 
                      after:h-4 
                      after:w-4 
                      after:transition-all
                      ${automation.isActive 
                        ? 'bg-blue-600 after:translate-x-full' 
                        : 'bg-gray-200'
                      }
                    `}></div>
                  </label>
                </div>
                
                <div className="text-sm text-gray-600 mt-1">
                  {automation.description}
                </div>
                
                <div className="mt-2 text-xs grid grid-cols-2 gap-2">
                  <div className="flex items-start gap-1.5">
                    <span className="font-medium text-gray-700">When:</span>
                    <span className="text-gray-600">{automation.trigger}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-medium text-gray-700">Then:</span>
                    <span className="text-gray-600">{automation.action}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {automations.length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-gray-200 rounded-md">
                <Settings size={20} className="mx-auto mb-1 text-gray-400" />
                <p>No automations set up</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 pt-0 pb-4">
        <Button 
          variant="ghost"
          size="sm"
          className="w-full text-blue-600 hover:text-blue-700"
          rightIcon={<ArrowRight size={16} />}
          onClick={onViewAllAlerts}
        >
          View All Alerts
        </Button>
        <Button 
          variant="ghost"
          size="sm"
          className="w-full text-blue-600 hover:text-blue-700"
          rightIcon={<ArrowRight size={16} />}
          onClick={onViewAllAutomations}
        >
          Manage Automations
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AutomationsWidget;