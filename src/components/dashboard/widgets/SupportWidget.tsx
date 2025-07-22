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
  LifeBuoy, 
  ArrowRight, 
  Plus,
  MessageCircle,
  User,
  Clock,
  ExternalLink,
  FileQuestion
} from 'lucide-react';
import { formatDateTime } from '../../../lib/utils';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  client: string;
}

interface SupportWidgetProps {
  tickets: Ticket[];
  onViewAll?: () => void;
  onCreateTicket?: () => void;
  onViewTicket?: (ticketId: string) => void;
  className?: string;
  userType: 'admin' | 'client';
  loading?: boolean;
}

const getStatusBadge = (status: Ticket['status']) => {
  switch (status) {
    case 'open':
      return <Badge variant="warning">Open</Badge>;
    case 'in-progress':
      return <Badge variant="primary">In Progress</Badge>;
    case 'resolved':
      return <Badge variant="success">Resolved</Badge>;
    case 'closed':
      return <Badge variant="default">Closed</Badge>;
  }
};

const getPriorityBadge = (priority: Ticket['priority']) => {
  switch (priority) {
    case 'low':
      return <Badge variant="info">Low</Badge>;
    case 'medium':
      return <Badge variant="warning">Medium</Badge>;
    case 'high':
      return <Badge variant="danger">High</Badge>;
  }
};

export const SupportWidget: React.FC<SupportWidgetProps> = ({
  tickets,
  onViewAll,
  onCreateTicket,
  onViewTicket,
  className,
  userType,
  loading = false,
}) => {
  // Sort tickets: open and in-progress first, then by priority, then by date
  const sortedTickets = [...tickets].sort((a, b) => {
    // First sort by status
    const statusOrder = { 'open': 0, 'in-progress': 1, 'resolved': 2, 'closed': 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    
    // Then by priority
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Finally by date (newest first)
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  });

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Support & Tickets</CardTitle>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={onCreateTicket}
          >
            New Ticket
          </Button>
        </div>
        <CardDescription>
          {userType === 'admin' 
            ? 'Manage client support tickets' 
            : 'Get help and track your support tickets'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></span>
          </div>
        ) : (
          <>
            {sortedTickets.slice(0, 4).map((ticket) => (
              <div 
                key={ticket.id} 
                className="p-3 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => onViewTicket?.(ticket.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">
                      {ticket.title}
                    </div>
                    
                    {userType === 'admin' && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <User size={12} />
                        <span>{ticket.client}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {ticket.description}
                </div>
                
                <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Updated {formatDateTime(ticket.lastUpdated)}</span>
                  </div>
                  
                  {ticket.assignee && userType === 'admin' && (
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>Assigned to {ticket.assignee}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {tickets.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <LifeBuoy size={24} className="mx-auto mb-2 text-gray-400" />
                <p>No support tickets</p>
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 pt-0 pb-4">
        <Button 
          variant="ghost"
          size="sm"
          className="w-full text-blue-600 hover:text-blue-700"
          rightIcon={<ArrowRight size={16} />}
          onClick={onViewAll}
        >
          View All Tickets
        </Button>
        
        <div className="mt-2 w-full grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<MessageCircle size={14} />}
            className="w-full"
          >
            Live Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileQuestion size={14} />}
            className="w-full"
            rightIcon={<ExternalLink size={14} />}
          >
            Knowledge Base
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SupportWidget;