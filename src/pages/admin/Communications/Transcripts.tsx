import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  MessageSquare, 
  User, 
  Clock, 
  Copy, 
  ExternalLink,
  Loader,
  ArrowDown,
  ArrowUp,
  CheckCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { formatDateTime } from '../../../lib/utils';

interface TranscriptPageProps {}

const TranscriptsPage: React.FC<TranscriptPageProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTranscript, setSelectedTranscript] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const itemsPerPage = 20;

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort transcripts
  const filteredTranscripts = mockTranscripts.filter(transcript => {
    // Apply search filter
    if (searchTerm && !transcript.clientName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !transcript.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transcript.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }

    // Apply date filter
    const transcriptDate = new Date(transcript.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999); // End of the day
    
    if (transcriptDate < startDate || transcriptDate > endDate) {
      return false;
    }

    // Apply type filter
    if (typeFilter !== 'all' && transcript.type !== typeFilter) {
      return false;
    }

    // Apply sentiment filter
    if (sentimentFilter !== 'all' && transcript.sentiment !== sentimentFilter) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Apply sorting
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortField === 'duration') {
      return sortDirection === 'asc' 
        ? a.duration - b.duration
        : b.duration - a.duration;
    } else if (sortField === 'client') {
      return sortDirection === 'asc' 
        ? a.clientName.localeCompare(b.clientName)
        : b.clientName.localeCompare(a.clientName);
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTranscripts.length / itemsPerPage);
  const paginatedTranscripts = filteredTranscripts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleViewTranscript = (transcript: any) => {
    setSelectedTranscript(transcript);
  };

  const handleCloseTranscript = () => {
    setSelectedTranscript(null);
  };

  const handleDownloadTranscript = (id: string) => {
    // In a real app, this would trigger a download
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Badge variant="success">Positive</Badge>;
      case 'neutral':
        return <Badge variant="info">Neutral</Badge>;
      case 'negative':
        return <Badge variant="danger">Negative</Badge>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'support':
        return <Badge variant="primary">Support</Badge>;
      case 'sales':
        return <Badge variant="success">Sales</Badge>;
      case 'onboarding':
        return <Badge variant="info">Onboarding</Badge>;
      case 'technical':
        return <Badge variant="warning">Technical</Badge>;
      case 'billing':
        return <Badge variant="danger">Billing</Badge>;
      default:
        return <Badge variant="default">{type}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader size={40} className="animate-spin text-blue-600 dark:text-blue-400 mb-4" />
          <p className="text-blue-600 dark:text-blue-400 font-medium">Loading transcripts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Call Transcripts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and analyze conversation transcripts from customer calls
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transcripts..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
          
          <Button leftIcon={<Filter size={16} />} variant="outline">
            Filters
          </Button>
          
          <Button leftIcon={<Download size={16} />} variant="outline">
            Export
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
                <span className="flex items-center text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Call Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="support">Support</option>
                <option value="sales">Sales</option>
                <option value="onboarding">Onboarding</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sentiment
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <div className="flex space-x-2">
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="duration">Duration</option>
                  <option value="client">Client Name</option>
                </select>
                <button
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  onClick={toggleSortDirection}
                  title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedTranscript ? (
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-gray-100">
                Transcript: Call with {selectedTranscript.clientName}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {formatDateTime(selectedTranscript.date)} • {selectedTranscript.duration} minutes
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getSentimentBadge(selectedTranscript.sentiment)}
              {getTypeBadge(selectedTranscript.type)}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCloseTranscript}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Call Summary</h3>
                <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-750 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                  {selectedTranscript.summary}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Participants</h3>
                <div className="space-y-3">
                  {selectedTranscript.participants.map((participant: any) => (
                    <div key={participant.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-750 rounded-md border border-gray-200 dark:border-gray-700">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                        {participant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{participant.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{participant.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Transcript Content</h3>
                <Button 
                  size="sm" 
                  variant="outline" 
                  leftIcon={copiedText === selectedTranscript.content ? <CheckCircle size={14} /> : <Copy size={14} />}
                  onClick={() => handleCopyText(selectedTranscript.content)}
                >
                  {copiedText === selectedTranscript.content ? 'Copied!' : 'Copy Text'}
                </Button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-md border border-gray-200 dark:border-gray-700 max-h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-gray-900 dark:text-gray-100 text-sm">
                  {selectedTranscript.content}
                </pre>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button 
              variant="outline" 
              leftIcon={<Download size={16} />}
              onClick={() => handleDownloadTranscript(selectedTranscript.id)}
            >
              Download Transcript
            </Button>
            <Button 
              leftIcon={<ExternalLink size={16} />}
              onClick={() => console.log('View full analysis')}
            >
              View Sentiment Analysis
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          {/* Transcripts List */}
          <Card className="bg-white dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-750 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Date & Time</th>
                    <th className="px-6 py-3 text-left">Client</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Duration</th>
                    <th className="px-6 py-3 text-left">Participants</th>
                    <th className="px-6 py-3 text-center">Sentiment</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedTranscripts.map((transcript) => (
                    <tr key={transcript.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {formatDateTime(transcript.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {transcript.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(transcript.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {transcript.duration} minutes
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {transcript.participants.map(p => p.name).join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getSentimentBadge(transcript.sentiment)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            onClick={() => handleViewTranscript(transcript)}
                          >
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                            onClick={() => handleDownloadTranscript(transcript.id)}
                          >
                            <Download size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {paginatedTranscripts.length === 0 && (
              <div className="text-center py-10">
                <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No transcripts found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm || typeFilter !== 'all' || sentimentFilter !== 'all'
                    ? "No transcripts match your current filters"
                    : "There are no call transcripts available yet"}
                </p>
                {(searchTerm || typeFilter !== 'all' || sentimentFilter !== 'all') && (
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setTypeFilter('all');
                      setSentimentFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
            
            {/* Pagination */}
            {paginatedTranscripts.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTranscripts.length)} of {filteredTranscripts.length} transcripts
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<ChevronLeft size={16} />}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-9"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="text-gray-500 dark:text-gray-400">...</span>}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="w-9"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ChevronRight size={16} />}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
          
          {/* Transcript Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Transcript Statistics</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Overview of call transcript data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageSquare size={20} className="text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-900 dark:text-gray-100">Total Transcripts</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{mockTranscripts.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-900 dark:text-gray-100">Avg. Call Duration</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {Math.round(mockTranscripts.reduce((sum, t) => sum + t.duration, 0) / mockTranscripts.length)} min
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-green-600 dark:text-green-400" />
                      <span className="text-gray-900 dark:text-gray-100">Unique Clients</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {new Set(mockTranscripts.map(t => t.clientName)).size}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Sentiment Distribution</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Breakdown of call sentiment analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {['positive', 'neutral', 'negative'].map(sentiment => {
                    const count = mockTranscripts.filter(t => t.sentiment === sentiment).length;
                    const percentage = Math.round((count / mockTranscripts.length) * 100);
                    
                    return (
                      <div key={sentiment} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-750">
                        <div className={`text-2xl font-bold mb-1 ${
                          sentiment === 'positive' ? 'text-green-600 dark:text-green-400' :
                          sentiment === 'neutral' ? 'text-blue-600 dark:text-blue-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {percentage}%
                        </div>
                        <div className="capitalize text-gray-700 dark:text-gray-300">{sentiment}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{count} calls</div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    rightIcon={<ExternalLink size={16} />}
                    onClick={() => console.log('Navigate to sentiment analysis')}
                  >
                    View Detailed Sentiment Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default TranscriptsPage;