import React, { useState } from 'react';
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
  Calendar as CalendarIcon, 
  ArrowRight, 
  Clock,
  User,
  Plus
} from 'lucide-react';
import { formatDate, formatTime } from '../../../lib/utils';

export interface Appointment {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  type: 'consultation' | 'meeting' | 'review';
  location?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface CalendarWidgetProps {
  appointments: Appointment[];
  onViewAll?: () => void;
  onAddAppointment?: () => void;
  className?: string;
  loading?: boolean;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  appointments,
  onViewAll,
  onAddAppointment,
  className,
  loading = false,
}) => {
  const now = new Date();
  
  // Sort appointments by date (upcoming first)
  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(a.date + 'T' + a.startTime).getTime() - 
    new Date(b.date + 'T' + b.startTime).getTime()
  );

  // Filter to only show future appointments
  const upcomingAppointments = sortedAppointments.filter(appointment => 
    new Date(appointment.date + 'T' + appointment.startTime) > now
  );

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
    }
  };

  const getTypeBadge = (type: Appointment['type']) => {
    switch (type) {
      case 'consultation':
        return <Badge variant="primary">Consultation</Badge>;
      case 'meeting':
        return <Badge variant="secondary">Meeting</Badge>;
      case 'review':
        return <Badge variant="info">Review</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Appointments</CardTitle>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={onAddAppointment}
          >
            Add
          </Button>
        </div>
        <CardDescription>
          Your scheduled appointments and meetings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></span>
          </div>
        ) : (
          <>
            {upcomingAppointments.slice(0, 4).map((appointment) => (
              <div 
                key={appointment.id} 
                className="p-3 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-md p-2 w-12 h-12">
                      <div className="text-xs font-medium">
                        {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-lg font-bold leading-tight">
                        {new Date(appointment.date).getDate()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900">
                        {appointment.title}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>
                          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </span>
                      </div>
                      {appointment.location && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {appointment.location}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(appointment.status)}
                    {getTypeBadge(appointment.type)}
                  </div>
                </div>
                
                {appointment.attendees.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <User size={12} />
                    <span>
                      {appointment.attendees.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            {upcomingAppointments.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <CalendarIcon size={24} className="mx-auto mb-2 text-gray-400" />
                <p>No upcoming appointments</p>
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
          View Full Calendar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CalendarWidget;