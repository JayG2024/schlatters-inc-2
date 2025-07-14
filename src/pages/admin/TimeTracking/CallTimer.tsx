import React, { useState, useEffect } from 'react';
import { 
  Phone,
  Mic,
  MicOff,
  Clock,
  User,
  FileText,
  Check,
  X,
  Save,
  PlusCircle,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const CallTimer: React.FC = () => {
  const [callNotes, setCallNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [callDescription, setCallDescription] = useState('');
  const [isBillable, setIsBillable] = useState(true);
  const [recordingEnabled, setRecordingEnabled] = useState(true);

  // Mock clients and projects for the demo
  const mockClients = [
    { id: '1', name: 'Acme Corp' },
    { id: '2', name: 'TechSolutions Inc' },
    { id: '3', name: 'Global Ventures' },
    { id: '4', name: 'Innovate LLC' },
    { id: '5', name: 'Premier Services' }
  ];
  
  const mockProjects = [
    { id: '1', name: 'Implementation', client: '1' },
    { id: '2', name: 'Consulting', client: '1' },
    { id: '3', name: 'Training', client: '2' },
    { id: '4', name: 'Support', client: '3' },
    { id: '5', name: 'Strategy', client: '4' },
    { id: '6', name: 'Technical Support', client: '5' }
  ];

  // Filter projects based on selected client
  const filteredProjects = selectedClient
    ? mockProjects.filter(project => project.client === selectedClient)
    : [];

  // Mock recent calls
  const recentCalls = [
    {
      id: '1',
      client: 'TechSolutions Inc',
      project: 'Technical Support',
      description: 'Technical Support Call',
      duration: '00:45:12',
      timestamp: 'Today at 10:30 AM',
      billable: true,
      notes: 'Discussed technical issues with the client\'s integration. Provided solutions for API connection problems.'
    },
    {
      id: '2',
      client: 'Global Ventures',
      project: 'Quarterly Review',
      description: 'Quarterly Review Meeting',
      duration: '01:15:30',
      timestamp: 'Yesterday at 2:00 PM',
      billable: true,
      notes: 'Reviewed Q1 performance metrics. Client satisfied with progress. Discussed strategy for Q2.'
    },
    {
      id: '3',
      client: 'Internal',
      project: 'Team Meeting',
      description: 'Internal Team Meeting',
      duration: '00:30:45',
      timestamp: 'Yesterday at 9:00 AM',
      billable: false,
      notes: 'Weekly team sync. Discussed current projects and resource allocation.'
    },
    {
      id: '4',
      client: 'Acme Corp',
      project: 'Implementation',
      description: 'Implementation Planning',
      duration: '00:55:20',
      timestamp: '2 days ago at 11:15 AM',
      billable: true,
      notes: 'Planned implementation timeline and resource requirements. Set up follow-up meeting for next week.'
    },
    {
      id: '5',
      client: 'Premier Services',
      project: 'Support',
      description: 'Support Call - Login Issues',
      duration: '00:22:10',
      timestamp: '3 days ago at 3:30 PM',
      billable: true,
      notes: 'Helped client resolve login issues. Recommended password reset and 2FA setup.'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Call History</CardTitle>
          <CardDescription>View and manage your tracked calls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Call History */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {recentCalls.map((call) => (
                  <div key={call.id} className={`p-4 border ${call.id === '1' ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800' : 'border-gray-200 dark:border-gray-700'} rounded-lg`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className={call.id === '1' ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"} />
                          <span className="font-medium">{call.client} - {call.description}</span>
                          <Badge variant={call.billable ? "success" : "default"}>
                            {call.billable ? 'Billable' : 'Non-billable'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-6">
                          Duration: {call.duration} • {call.timestamp}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-6">
                          Project: {call.project}
                        </div>
                      </div>
                      <div className="flex">
                        <Button size="sm" variant="ghost" leftIcon={<FileText size={14} />}>
                          {call.id === '1' ? 'Edit Notes' : 'View Notes'}
                        </Button>
                      </div>
                    </div>
                    
                    {call.id === '1' && (
                      <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                        <textarea
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          value={call.notes}
                          readOnly
                        ></textarea>
                        <div className="flex justify-end mt-2">
                          <Button size="sm" leftIcon={<Save size={16} />}>
                            Save Notes
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* New Call Form */}
            <div className="lg:col-span-2">
              <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-gray-100">Log New Call</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Client *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                  >
                    <option value="">Select a client</option>
                    {mockClients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    disabled={!selectedClient}
                  >
                    <option value="">Select a project</option>
                    {filteredProjects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                  {!selectedClient && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select a client first</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Call Description *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={callDescription}
                    onChange={(e) => setCallDescription(e.target.value)}
                    placeholder="Brief description of the call"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="billable"
                    type="checkbox"
                    checked={isBillable}
                    onChange={(e) => setIsBillable(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="billable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Billable Call
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="recording"
                    type="checkbox"
                    checked={recordingEnabled}
                    onChange={(e) => setRecordingEnabled(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="recording" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Call Recording
                  </label>
                </div>

                <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-md">
                  <h4 className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">Call Participants</h4>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400 dark:text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Admin User (You)</span>
                      </div>
                      <Badge variant="success">Host</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400 dark:text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Client Representative</span>
                      </div>
                      <Badge variant="info">Client</Badge>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    leftIcon={<PlusCircle size={14} />}
                  >
                    Add Participant
                  </Button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Call Notes
                  </label>
                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 min-h-[150px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Add notes about the call here..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <Button leftIcon={<Phone size={16} />} className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700">
                    Log Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">
              <AlertTriangle size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-300">Call Tracking Tips</h3>
              <ul className="mt-2 text-sm text-blue-700 dark:text-blue-400 space-y-2">
                <li>Log calls immediately after completion for accurate tracking</li>
                <li>Include detailed notes about the conversation and action items</li>
                <li>Mark calls as billable or non-billable appropriately</li>
                <li>Use the project dropdown to associate calls with specific client projects</li>
                <li>Call recordings are securely stored and can be accessed from the Time Logs page</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallTimer;