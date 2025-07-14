// Mock data for time tracking
export interface TimeEntry {
  id: string;
  clientName: string;
  projectName: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in seconds
  billable: boolean;
  status: 'active' | 'paused' | 'completed';
  description: string;
  rate: number;
  userId: string;
  userName: string;
}

export const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    clientName: 'Smith & Associates',
    projectName: 'Network Setup',
    startTime: new Date('2025-01-14T09:00:00'),
    endTime: new Date('2025-01-14T11:30:00'),
    duration: 9000,
    billable: true,
    status: 'completed',
    description: 'Initial network configuration and router setup',
    rate: 150,
    userId: 'user1',
    userName: 'John Doe'
  },
  {
    id: '2',
    clientName: 'Johnson Tech',
    projectName: 'Server Maintenance',
    startTime: new Date('2025-01-14T14:00:00'),
    endTime: null,
    duration: 3600,
    billable: true,
    status: 'active',
    description: 'Monthly server maintenance and updates',
    rate: 175,
    userId: 'user1',
    userName: 'John Doe'
  }
];

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};