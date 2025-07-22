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
  Phone, 
  MessageSquare, 
  ArrowRight, 
  ArrowUpRight,
  ArrowDownLeft,
  User
} from 'lucide-react';
import { formatDateTime } from '../../../lib/utils';

export interface Communication {
  id: string;
  type: 'call' | 'text';
  direction: 'incoming' | 'outgoing';
  contact: {
    name: string;
    phone: string;
  };
  timestamp: string;
  duration?: number; // in seconds, for calls
  status: 'completed' | 'missed' | 'voicemail';
  messageCount?: number; // for text threads
}

interface CommunicationWidgetProps {
  communications: Communication[];
  onViewAll?: () => void;
  onCall?: (phone: string) => void;
  onText?: (phone: string) => void;
  className?: string;
  loading?: boolean;
}

export const CommunicationWidget: React.FC<CommunicationWidgetProps> = ({
  communications,
  onViewAll,
  onCall,
  onText,
  className,
  loading = false,
}) => {
  // Sort communications by timestamp (newest first)
  const sortedCommunications = [...communications].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const formatCallDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusDisplay = (comm: Communication) => {
    if (comm.type === 'call') {
      if (comm.status === 'missed') {
        return <Badge variant="danger">Missed</Badge>;
      } else if (comm.status === 'voicemail') {
        return <Badge variant="warning">Voicemail</Badge>;
      }
      return <Badge variant="success">Completed</Badge>;
    }
    return <Badge variant="info">{comm.messageCount} messages</Badge>;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Communications</CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Phone size={14} />}
            >
              Call
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<MessageSquare size={14} />}
            >
              Text
            </Button>
          </div>
        </div>
        <CardDescription>
          Recent calls and text messages
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></span>
          </div>
        ) : (
          <>
            {sortedCommunications.slice(0, 5).map((comm) => (
              <div 
                key={comm.id} 
                className="p-3 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {comm.type === 'call' ? (
                      <div className={`p-1.5 rounded-full ${
                        comm.direction === 'incoming' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                      }`}>
                        {comm.direction === 'incoming' 
                          ? <ArrowDownLeft size={14} /> 
                          : <ArrowUpRight size={14} />
                        }
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-full bg-purple-100 text-purple-600">
                        <MessageSquare size={14} />
                      </div>
                    )}
                    
                    <div>
                      <div className="font-medium text-gray-900">
                        {comm.contact.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {comm.contact.phone}
                      </div>
                    </div>
                  </div>
                  
                  {getStatusDisplay(comm)}
                </div>
                
                <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                  <div>
                    {formatDateTime(comm.timestamp)}
                    {comm.type === 'call' && comm.duration && comm.status === 'completed' && (
                      <span className="ml-2">({formatCallDuration(comm.duration)})</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<Phone size={14} />}
                      onClick={() => onCall?.(comm.contact.phone)}
                      className="text-gray-600 hover:text-gray-800"
                      title="Call"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<MessageSquare size={14} />}
                      onClick={() => onText?.(comm.contact.phone)}
                      className="text-gray-600 hover:text-gray-800"
                      title="Text"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {communications.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Phone size={24} className="mx-auto mb-2 text-gray-400" />
                <p>No recent communications</p>
              </div>
            )}
          </>
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
          View All Communications
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommunicationWidget;