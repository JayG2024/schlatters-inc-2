import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon,
  User,
  MapPin,
  Clock,
  Tag,
  X
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

interface Appointment {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  type: 'consultation' | 'meeting' | 'review';
  location?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  description?: string;
}

// Data will be fetched from Supabase
const mockAppointments: Appointment[] = [];

// Helper to get the type badge for appointments
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

// Helper to get the status badge for appointments
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

// Generate days for calendar view
const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Generate days with metadata
  const days = [];
  
  // Add previous month's days to fill first week
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    const day = prevMonthDays - firstDay + i + 1;
    days.push({ 
      date: new Date(year, month - 1, day), 
      isCurrentMonth: false,
      hasAppointments: false,
      appointments: []
    });
  }
  
  // Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dateString = date.toISOString().split('T')[0];
    
    // Check if this day has appointments
    const dayAppointments = mockAppointments.filter(appt => appt.date === dateString);
    
    days.push({ 
      date, 
      isCurrentMonth: true,
      hasAppointments: dayAppointments.length > 0,
      appointments: dayAppointments
    });
  }
  
  // Add next month's days to fill last week
  const remainingDays = 7 - (days.length % 7 || 7);
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ 
      date: new Date(year, month + 1, i), 
      isCurrentMonth: false,
      hasAppointments: false,
      appointments: []
    });
  }
  
  return days;
};

const CalendarPage: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(6); // Default to July
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [view, setView] = useState<'month' | 'week' | 'agenda'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const calendarDays = generateCalendarDays(currentYear, currentMonth);
  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString('default', { month: 'long' });
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Get appointments for a selected date or all if no date is selected
  const getAppointments = () => {
    if (!selectedDate) return mockAppointments;
    
    const dateString = selectedDate.toISOString().split('T')[0];
    return mockAppointments.filter(appt => appt.date === dateString);
  };

  const filteredAppointments = getAppointments();
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">Manage appointments and meetings</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                view === 'month' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setView('month')}
            >
              Month
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                view === 'week' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setView('week')}
            >
              Week
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                view === 'agenda' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setView('agenda')}
            >
              Agenda
            </button>
          </div>
          
          <Button leftIcon={<Plus size={16} />}>
            Add Event
          </Button>
        </div>
      </div>
      
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {monthName} {currentYear}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ChevronLeft size={16} />}
            onClick={prevMonth}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentMonth(today.getMonth());
              setCurrentYear(today.getFullYear());
            }}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            rightIcon={<ChevronRight size={16} />}
            onClick={nextMonth}
          >
            Next
          </Button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      {view === 'month' && (
        <Card className="bg-white">
          <div className="grid grid-cols-7 border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div 
                key={i} 
                className="py-3 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 grid-rows-6 h-[700px]">
            {calendarDays.map((day, idx) => {
              const isToday = day.date.toDateString() === today.toDateString();
              const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
              
              return (
                <div 
                  key={idx} 
                  className={`border-t border-r p-2 ${
                    idx % 7 === 0 ? 'border-l' : ''
                  } ${
                    day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                  } ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className={`h-8 w-8 flex items-center justify-center rounded-full text-sm ${
                        isToday 
                          ? 'bg-blue-600 text-white font-medium' 
                          : isSelected 
                            ? 'border border-blue-600 text-blue-600 font-medium'
                            : ''
                      }`}
                    >
                      {day.date.getDate()}
                    </div>
                    {day.hasAppointments && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="mt-1 space-y-1 max-h-[80px] overflow-hidden">
                    {day.appointments.slice(0, 3).map((appt, i) => (
                      <div 
                        key={i}
                        className={`
                          text-xs rounded px-2 py-1 truncate
                          ${appt.type === 'consultation' ? 'bg-blue-100 text-blue-800' : ''}
                          ${appt.type === 'meeting' ? 'bg-purple-100 text-purple-800' : ''}
                          ${appt.type === 'review' ? 'bg-cyan-100 text-cyan-800' : ''}
                        `}
                      >
                        {appt.startTime} - {appt.title}
                      </div>
                    ))}
                    {day.appointments.length > 3 && (
                      <div className="text-xs text-gray-500 pl-2">
                        +{day.appointments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      
      {view === 'agenda' && (
        <div className="space-y-4">
          {selectedDate ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Appointments for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  leftIcon={<X size={16} />}
                  onClick={() => setSelectedDate(null)}
                >
                  Clear Selection
                </Button>
              </div>
              
              {filteredAppointments.length === 0 ? (
                <Card className="bg-white p-6 text-center">
                  <CalendarIcon size={48} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments scheduled</h3>
                  <p className="text-gray-500 mb-4">
                    There are no appointments scheduled for this date.
                  </p>
                  <Button leftIcon={<Plus size={16} />}>
                    Add Appointment
                  </Button>
                </Card>
              ) : null}
            </>
          ) : (
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                All Upcoming Appointments
              </h3>
            </div>
          )}
          
          {filteredAppointments.map(appointment => (
            <Card key={appointment.id} className="bg-white">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{appointment.title}</h3>
                      {getTypeBadge(appointment.type)}
                      {getStatusBadge(appointment.status)}
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start gap-2 text-gray-600">
                        <CalendarIcon size={16} className="flex-shrink-0 mt-0.5 text-gray-500" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-start gap-2 text-gray-600">
                        <Clock size={16} className="flex-shrink-0 mt-0.5 text-gray-500" />
                        <span>{appointment.startTime} - {appointment.endTime}</span>
                      </div>
                      
                      {appointment.location && (
                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin size={16} className="flex-shrink-0 mt-0.5 text-gray-500" />
                          <span>{appointment.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-2 text-gray-600">
                        <User size={16} className="flex-shrink-0 mt-0.5 text-gray-500" />
                        <span>{appointment.attendees.join(', ')}</span>
                      </div>
                    </div>
                    
                    {appointment.description && (
                      <div className="mt-4 bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-700 text-sm">{appointment.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex md:flex-col gap-2 md:text-right">
                    <Button size="sm" className="min-w-24">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="min-w-24">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;