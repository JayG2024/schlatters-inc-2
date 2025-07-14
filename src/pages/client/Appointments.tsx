import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Video, 
  Phone, 
  MessageSquare,
  X
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatDate, formatDateTime } from '../../lib/utils';

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
  notes?: string;
  joinUrl?: string;
  dialIn?: string;
}

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
    // const dayAppointments = mockAppointments.filter(appt => appt.date === dateString);
    
    days.push({ 
      date, 
      isCurrentMonth: true,
      hasAppointments: false,
      appointments: []
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

const AppointmentsPage: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(6); // Default to July
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [view, setView] = useState<'month' | 'list'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
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
    if (!selectedDate && !searchTerm) {
      return [];
    }
    
    let filtered: Appointment[] = [];
    
    // Filter by date if selected
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      filtered = filtered.filter(appt => appt.date === dateString);
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        appt => 
          appt.title.toLowerCase().includes(search) ||
          (appt.description || '').toLowerCase().includes(search) ||
          appt.location?.toLowerCase().includes(search) ||
          appt.attendees.some(a => a.toLowerCase().includes(search))
      );
    }
    
    return filtered;
  };

  const filteredAppointments = getAppointments();
  
  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };
  
  const handleCloseAppointmentDetail = () => {
    setSelectedAppointment(null);
  };
  
  const handleRequestReschedule = (appointmentId: string) => {
    // In a real app, this would trigger a reschedule flow
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    // In a real app, this would trigger a cancellation flow
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">View and manage your scheduled appointments</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search appointments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
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
                view === 'list' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setView('list')}
            >
              List
            </button>
          </div>
          
          <Button leftIcon={<Plus size={16} />}>
            Request Appointment
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
      
      {selectedAppointment ? (
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle>{selectedAppointment.title}</CardTitle>
                {getTypeBadge(selectedAppointment.type)}
              </div>
              <CardDescription>
                {formatDate(new Date(selectedAppointment.date))}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(selectedAppointment.status)}
              <Button 
                variant="ghost" 
                size="sm"
                leftIcon={<X size={16} />}
                onClick={handleCloseAppointmentDetail}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Time</h3>
              <div className="flex items-center text-gray-900">
                <Clock size={18} className="mr-2 text-gray-400" />
                <span>{selectedAppointment.startTime} - {selectedAppointment.endTime}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
              <div className="flex items-center text-gray-900">
                {selectedAppointment.location?.includes('Zoom') || selectedAppointment.location?.includes('Teams') ? (
                  <Video size={18} className="mr-2 text-gray-400" />
                ) : selectedAppointment.location?.includes('Phone') ? (
                  <Phone size={18} className="mr-2 text-gray-400" />
                ) : (
                  <MapPin size={18} className="mr-2 text-gray-400" />
                )}
                <span>{selectedAppointment.location}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Attendees</h3>
              <div className="flex items-start">
                <User size={18} className="mr-2 text-gray-400 mt-0.5" />
                <div>
                  {selectedAppointment.attendees.map((attendee, idx) => (
                    <div key={idx} className="text-gray-900">{attendee}</div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-900">
                {selectedAppointment.description || "No description provided."}
              </p>
            </div>
            
            {selectedAppointment.joinUrl && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                <h3 className="text-sm font-medium text-blue-700 mb-2">Join Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Video size={16} className="mr-2 text-blue-600" />
                    <a href={selectedAppointment.joinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Join Online Meeting
                    </a>
                  </div>
                  {selectedAppointment.dialIn && (
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2 text-blue-600" />
                      <span className="text-gray-700">{selectedAppointment.dialIn}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {selectedAppointment.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                <p className="text-gray-900">{selectedAppointment.notes}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              className="text-red-600 hover:bg-red-50"
              onClick={() => handleCancelAppointment(selectedAppointment.id)}
            >
              Cancel Appointment
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleRequestReschedule(selectedAppointment.id)}
            >
              Request Reschedule
            </Button>
            {selectedAppointment.joinUrl && (
              <Button
                leftIcon={<Video size={16} />}
                onClick={() => window.open(selectedAppointment.joinUrl, '_blank')}
              >
                Join Meeting
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : view === 'month' ? (
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
                          text-xs rounded px-2 py-1 truncate cursor-pointer
                          ${appt.type === 'consultation' ? 'bg-blue-100 text-blue-800' : ''}
                          ${appt.type === 'meeting' ? 'bg-purple-100 text-purple-800' : ''}
                          ${appt.type === 'review' ? 'bg-cyan-100 text-cyan-800' : ''}
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewAppointment(appt);
                        }}
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
      ) : (
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
              
              {filteredAppointments.length === 0 && (
                <Card className="bg-white p-6 text-center">
                  <CalendarIcon size={48} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments scheduled</h3>
                  <p className="text-gray-500 mb-4">
                    There are no appointments scheduled for this date.
                  </p>
                  <Button leftIcon={<Plus size={16} />}>
                    Request Appointment
                  </Button>
                </Card>
              )}
            </>
          ) : searchTerm ? (
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Search Results: "{searchTerm}"
              </h3>
              <Button 
                size="sm" 
                variant="ghost" 
                leftIcon={<X size={16} />}
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                All Upcoming Appointments
              </h3>
            </div>
          )}
          
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(appointment => (
              <Card key={appointment.id} className="bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewAppointment(appointment)}>
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
                            {appointment.location.includes('Zoom') || appointment.location.includes('Teams') ? (
                              <Video size={16} className="flex-shrink-0 mt-0.5 text-gray-500" />
                            ) : appointment.location.includes('Phone') ? (
                              <Phone size={16} className="flex-shrink-0 mt-0.5 text-gray-500" />
                            ) : (
                              <MapPin size={16} className="flex-shrink-0 mt-0.5 text-gray-500" />
                            )}
                            <span>{appointment.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-start gap-2 text-gray-600">
                          <User size={16} className="flex-shrink-0 mt-0.5 text-gray-500" />
                          <span>{appointment.attendees.join(', ')}</span>
                        </div>
                      </div>
                      
                      {appointment.description && (
                        <div className="mt-4 text-gray-700 text-sm">
                          <p className="line-clamp-2">{appointment.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex gap-2">
                      {appointment.joinUrl && (
                        <Button size="sm" leftIcon={<Video size={16} />} className="whitespace-nowrap">
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : !selectedDate && !searchTerm && (
            <Card className="bg-white p-6 text-center">
              <CalendarIcon size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming appointments</h3>
              <p className="text-gray-500 mb-4">
                You have no appointments scheduled at this time.
              </p>
              <Button leftIcon={<Plus size={16} />}>
                Request Appointment
              </Button>
            </Card>
          )}
        </div>
      )}
      
      {/* Quick Tips */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Appointment Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Video size={20} className="text-blue-600" />
                <h3 className="font-medium text-blue-800">Online Meetings</h3>
              </div>
              <p className="text-sm text-blue-700">
                Use the "Join" button to quickly access your virtual meetings. Test your connection 5 minutes before the start time.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-green-600" />
                <h3 className="font-medium text-green-800">Be Prepared</h3>
              </div>
              <p className="text-sm text-green-700">
                Review any related documents before your appointment and prepare questions to make the most of your time.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={20} className="text-purple-600" />
                <h3 className="font-medium text-purple-800">Need Changes?</h3>
              </div>
              <p className="text-sm text-purple-700">
                If you need to reschedule, please provide at least 24 hours notice using the "Request Reschedule" option.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsPage;