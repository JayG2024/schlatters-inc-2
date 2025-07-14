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
import { Clock, Play, Square, Plus, User, CheckCircle, X } from 'lucide-react';
import { formatDateTime } from '../../../lib/utils';

export interface TimeEntry {
  id: string;
  description: string;
  project: string;
  client: string;
  consultant: string;
  startTime: string;
  endTime: string | null;
  billable: boolean;
  duration?: number; // in minutes
  notes?: string;
}

interface TimeTrackingWidgetProps {
  timeEntries: TimeEntry[];
  totalHours: number;
  billableHours: number;
  onAddEntry?: () => void;
  className?: string;
}

export const TimeTrackingWidget: React.FC<TimeTrackingWidgetProps> = ({
  timeEntries,
  totalHours,
  billableHours,
  onAddEntry,
  className,
}) => {
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerTime, setTimerTime] = useState<number>(0);
  const [showBillablePrompt, setShowBillablePrompt] = useState<boolean>(false);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);

  // Sort entries by start time (newest first)
  const sortedEntries = [...timeEntries].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleStartTimer = (entryId: string) => {
    setActiveTimer(entryId);
    setTimerTime(0);
    // In a real app, we would start a timer and update the backend
  };

  const handleStopTimer = () => {
    setCurrentEntryId(activeTimer);
    setActiveTimer(null);
    setShowBillablePrompt(true);
    // In a real app, we would stop the timer and update the backend
  };

  const handleBillableResponse = (isBillable: boolean) => {
    // In a real app, we would update the entry's billable status in the backend
    console.log(`Entry ${currentEntryId} marked as ${isBillable ? 'billable' : 'non-billable'}`);
    setShowBillablePrompt(false);
    setCurrentEntryId(null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Time Tracking</CardTitle>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={onAddEntry}
          >
            New Entry
          </Button>
        </div>
        <CardDescription>
          Track and manage consulting time
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-navy-50 rounded-lg p-4">
            <div className="text-sm text-navy-600 font-medium">Total Hours</div>
            <div className="text-2xl font-bold text-navy-700 mt-1">{totalHours}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">Billable Hours</div>
            <div className="text-2xl font-bold text-green-700 mt-1">{billableHours}</div>
          </div>
        </div>

        {/* Billable Prompt Modal */}
        {showBillablePrompt && (
          <div className="mt-2 mb-2 p-4 border border-gold-300 bg-gold-50 rounded-lg">
            <div className="text-center mb-3">
              <h3 className="font-medium text-lg text-navy-800">Is this time entry billable?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose whether this time should be billed to the client.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
                leftIcon={<X size={16} />}
                onClick={() => handleBillableResponse(false)}
              >
                No, Non-billable
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                leftIcon={<CheckCircle size={16} />}
                onClick={() => handleBillableResponse(true)}
              >
                Yes, Billable
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Recent Entries</h4>
          
          {sortedEntries.slice(0, 4).map((entry) => (
            <div 
              key={entry.id} 
              className="p-3 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">{entry.description}</div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <User size={12} />
                    <span>{entry.consultant}</span>
                    <span className="mx-1">•</span>
                    <span>{entry.client}</span>
                    <span className="mx-1">•</span>
                    <span>{entry.project}</span>
                  </div>
                </div>
                <Badge variant={entry.billable ? 'success' : 'default'}>
                  {entry.billable ? 'Billable' : 'Non-billable'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center mt-2 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={14} />
                  <span>
                    {entry.endTime ? (
                      formatDuration(entry.duration || 0)
                    ) : (
                      'In progress'
                    )}
                  </span>
                </div>
                
                {entry.endTime ? (
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Play size={14} />}
                    onClick={() => handleStartTimer(entry.id)}
                  >
                    Start
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Square size={14} />}
                    onClick={handleStopTimer}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Stop
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Button 
          variant="ghost"
          size="sm"
          className="w-full text-navy-600 hover:text-navy-700"
        >
          View All Time Entries
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TimeTrackingWidget;