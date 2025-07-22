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

// Mock data removed - will be fetched from Supabase
export const mockTimeEntries: TimeEntry[] = [];

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};