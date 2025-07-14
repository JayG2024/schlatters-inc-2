import React, { useState } from 'react';
import { 
  Play,
  Pause,
  MoreVertical,
  Download,
  Filter,
  Clock,
  Check,
  X,
  Edit,
  Trash2,
  Plus,
  FileText,
  Calendar,
  ArrowDownCircle,
  Search,
  DollarSign
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { formatDateTime } from '../../../lib/utils';
import { mockTimeEntries, filterTimeEntries, formatDuration } from './mockData';

const TimeLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('week');
  const [statusFilter, setStatusFilter] = useState<'all' | 'billable' | 'non-billable'>('all');
  
  // Apply all filters
  const filteredEntries = filterTimeEntries(mockTimeEntries, searchTerm).filter(entry => {
    // Filter by status (billable/non-billable)
    if (statusFilter === 'billable' && !entry.billable) return false;
    if (statusFilter === 'non-billable' && entry.billable) return false;
    
    // Filter by date
    if (dateFilter !== 'all') {
      const entryDate = new Date(entry.startTime);
      const today = new Date();
      
      if (dateFilter === 'today') {
        return entryDate.toDateString() === today.toDateString();
      }
      
      if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        return entryDate >= weekAgo;
      }
      
      if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        return entryDate >= monthAgo;
      }
    }
    
    return true;
  });
  
  // Calculate stats for filtered entries
  const totalFilteredTime = filteredEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const billableFilteredTime = filteredEntries
    .filter(entry => entry.billable)
    .reduce((sum, entry) => sum + (entry.duration || 0), 0);
  
  // Sort entries by date (newest first)
  const sortedEntries = [...filteredEntries].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  const handleEditEntry = (id: string) => {
    setSelectedEntry(id);
    setShowEditModal(true);
  };

  const handleDeleteEntry = (id: string) => {
    setSelectedEntry(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log(`Deleting entry ${selectedEntry}`);
    setShowDeleteConfirm(false);
    setSelectedEntry(null);
    // In a real app, this would delete the entry
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex space-x-2 items-center">
          <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Date Range:</label>
          <select
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
          </select>
        </div>
        
        <div className="flex space-x-2 items-center">
          <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Status:</label>
          <select
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Entries</option>
            <option value="billable">Billable</option>
            <option value="non-billable">Non-billable</option>
          </select>
        </div>
        
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search time entries..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>
        
        <Button leftIcon={<Filter size={16} />} variant="outline" size="sm">
          More Filters
        </Button>
        
        <Button leftIcon={<Plus size={16} />} size="sm" className="ml-auto">
          Add Time Entry
        </Button>
        
        <Button leftIcon={<Download size={16} />} variant="outline" size="sm">
          Export
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                <Clock size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Time</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatDuration(totalFilteredTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-md">
                <DollarSign size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Billable Time</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatDuration(billableFilteredTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                <FileText size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time Entries</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{filteredEntries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Entries Table */}
      <Card className="bg-white dark:bg-gray-800 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Time Entries</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Log of recorded time for tasks and calls
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-750 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Project</th>
                <th className="px-6 py-3 text-left">Client</th>
                <th className="px-6 py-3 text-left">Consultant</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Duration</th>
                <th className="px-6 py-3 text-center">Billable</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {sortedEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {entry.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {entry.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {entry.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {entry.consultant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDateTime(entry.startTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {entry.endTime ? formatDuration(entry.duration || 0) : 'In progress'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Badge variant={entry.billable ? 'success' : 'default'}>
                      {entry.billable ? 'Billable' : 'Non-billable'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      {entry.endTime ? (
                        <button 
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          title="Resume Timer"
                          onClick={() => console.log('Resume timer for', entry.id)}
                        >
                          <Play size={16} />
                        </button>
                      ) : (
                        <button 
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          title="Stop Timer"
                          onClick={() => console.log('Stop timer for', entry.id)}
                        >
                          <Pause size={16} />
                        </button>
                      )}
                      <button 
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200" 
                        title="Edit"
                        onClick={() => handleEditEntry(entry.id)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200" 
                        title="Delete"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedEntries.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center">
                    <Clock size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No time entries found matching your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {sortedEntries.length > 0 && (
          <CardFooter className="px-6 py-3 bg-gray-50 dark:bg-gray-750 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {sortedEntries.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" leftIcon={<ArrowDownCircle size={14} />}>
                Load More
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Group By Time Period Card */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Time Entry Summary</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Time entries grouped by period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Today</h3>
              <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatDuration(
                        sortedEntries
                          .filter(entry => new Date(entry.startTime).toDateString() === new Date().toDateString())
                          .reduce((sum, entry) => sum + (entry.duration || 0), 0)
                      )}
                    </span>
                  </div>
                  <div>
                    <Badge variant="primary">
                      {sortedEntries.filter(entry => new Date(entry.startTime).toDateString() === new Date().toDateString()).length} entries
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">This Week</h3>
              <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatDuration(
                        sortedEntries
                          .filter(entry => {
                            const entryDate = new Date(entry.startTime);
                            const today = new Date();
                            const weekAgo = new Date();
                            weekAgo.setDate(today.getDate() - 7);
                            return entryDate >= weekAgo && entryDate <= today;
                          })
                          .reduce((sum, entry) => sum + (entry.duration || 0), 0)
                      )}
                    </span>
                  </div>
                  <div>
                    <Badge variant="primary">
                      {sortedEntries.filter(entry => {
                        const entryDate = new Date(entry.startTime);
                        const today = new Date();
                        const weekAgo = new Date();
                        weekAgo.setDate(today.getDate() - 7);
                        return entryDate >= weekAgo && entryDate <= today;
                      }).length} entries
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">This Month</h3>
              <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatDuration(
                        sortedEntries
                          .filter(entry => {
                            const entryDate = new Date(entry.startTime);
                            const today = new Date();
                            return entryDate.getMonth() === today.getMonth() && 
                                   entryDate.getFullYear() === today.getFullYear();
                          })
                          .reduce((sum, entry) => sum + (entry.duration || 0), 0)
                      )}
                    </span>
                  </div>
                  <div>
                    <Badge variant="primary">
                      {sortedEntries.filter(entry => {
                        const entryDate = new Date(entry.startTime);
                        const today = new Date();
                        return entryDate.getMonth() === today.getMonth() && 
                               entryDate.getFullYear() === today.getFullYear();
                      }).length} entries
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Entry Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Edit Time Entry</h3>
            
            {/* Form would go here */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                  <input type="datetime-local" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                  <input type="datetime-local" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="edit-billable"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded mr-2 bg-white dark:bg-gray-700"
                />
                <label htmlFor="edit-billable" className="text-sm text-gray-900 dark:text-gray-100">
                  Billable
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" leftIcon={<X size={16} />} onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button leftIcon={<Check size={16} />} onClick={() => setShowEditModal(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Delete Time Entry</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to delete this time entry? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" leftIcon={<X size={16} />} onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" leftIcon={<Trash2 size={16} />} onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeLogs;