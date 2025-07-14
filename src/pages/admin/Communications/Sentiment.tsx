import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  Filter, 
  Smile, 
  Frown, 
  Meh, 
  BarChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Users, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  Loader,
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Progress from '../../../components/ui/Progress';
import { formatPercentage } from '../../../lib/utils';

interface SentimentPageProps {}

const SentimentPage: React.FC<SentimentPageProps> = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview', 'keyPhrases', 'byParticipant']);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  const getSentimentColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getSentimentBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-blue-100 dark:bg-blue-900/30';
    if (score >= 40) return 'bg-amber-100 dark:bg-amber-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="text-green-500 dark:text-green-400" />;
      case 'neutral':
        return <Meh className="text-amber-500 dark:text-amber-400" />;
      case 'negative':
        return <Frown className="text-red-500 dark:text-red-400" />;
      default:
        return null;
    }
  };

  const getSentimentVariant = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'primary';
    if (score >= 40) return 'warning';
    return 'danger';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <ArrowUp size={14} className="text-green-500 dark:text-green-400" />;
    } else if (trend < 0) {
      return <ArrowDown size={14} className="text-red-500 dark:text-red-400" />;
    }
    return null;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600 dark:text-green-400';
    if (trend < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  // Filter key phrases based on search term
  const filteredKeyPhrases = searchTerm
    ? mockSentimentData.keyPhrases.filter(phrase => 
        phrase.phrase.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockSentimentData.keyPhrases;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader size={40} className="animate-spin text-blue-600 dark:text-blue-400 mb-4" />
          <p className="text-blue-600 dark:text-blue-400 font-medium">Loading sentiment analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sentiment Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyze customer sentiment from calls and communications
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === 'week' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
              }`}
              onClick={() => setTimeframe('week')}
            >
              Week
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === 'month' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
              }`}
              onClick={() => setTimeframe('month')}
            >
              Month
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === 'quarter' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
              }`}
              onClick={() => setTimeframe('quarter')}
            >
              Quarter
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === 'year' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
              }`}
              onClick={() => setTimeframe('year')}
            >
              Year
            </button>
          </div>
          
          <Button leftIcon={<Filter size={16} />} variant="outline">
            Filter
          </Button>
          
          <Button leftIcon={<Download size={16} />}>
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Overall Sentiment Score */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection('overview')}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-900 dark:text-gray-100">Overall Sentiment Score</CardTitle>
            {expandedSections.includes('overview') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </CardHeader>
        
        {expandedSections.includes('overview') && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48">
                    {/* Circular progress indicator */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        className="dark:stroke-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                        stroke={mockSentimentData.overall.score >= 80 ? "#10b981" : 
                               mockSentimentData.overall.score >= 60 ? "#3b82f6" : 
                               mockSentimentData.overall.score >= 40 ? "#f59e0b" : "#ef4444"}
                        strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 45 * mockSentimentData.overall.score / 100} ${2 * Math.PI * 45 * (1 - mockSentimentData.overall.score / 100)}`}
                        strokeDashoffset={2 * Math.PI * 45 * 0.25}
                        className={mockSentimentData.overall.score >= 80 ? "dark:stroke-green-500" : 
                                  mockSentimentData.overall.score >= 60 ? "dark:stroke-blue-500" : 
                                  mockSentimentData.overall.score >= 40 ? "dark:stroke-amber-500" : "dark:stroke-red-500"}
                      />
                    </svg>
                    
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className={`text-4xl font-bold ${getSentimentColor(mockSentimentData.overall.score)}`}>
                        {mockSentimentData.overall.score}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Sentiment Score</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    {mockSentimentData.overall.trend > 0 ? (
                      <TrendingUp size={20} className="text-green-500 dark:text-green-400 mr-2" />
                    ) : (
                      <TrendingDown size={20} className="text-red-500 dark:text-red-400 mr-2" />
                    )}
                    <span className={mockSentimentData.overall.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {mockSentimentData.overall.trend > 0 ? '+' : ''}{mockSentimentData.overall.trend}%
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">vs previous {timeframe}</span>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Sentiment Trend</h3>
                
                {/* Simple line chart visualization */}
                <div className="h-64 relative">
                  <div className="absolute inset-0 flex items-end">
                    {mockSentimentData.overall.history.map((point, index) => {
                      const height = (point.score / 100) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className={`w-4 rounded-t-sm ${
                              point.score >= 80 ? 'bg-green-500' : 
                              point.score >= 60 ? 'bg-blue-500' : 
                              point.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                            }`} 
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
                    <div className="flex justify-center mb-2">
                      <Smile size={24} className="text-green-500 dark:text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {mockSentimentData.overall.breakdown.positive}%
                    </div>
                    <div className="text-sm text-green-800 dark:text-green-300">Positive</div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                    <div className="flex justify-center mb-2">
                      <Meh size={24} className="text-blue-500 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {mockSentimentData.overall.breakdown.neutral}%
                    </div>
                    <div className="text-sm text-blue-800 dark:text-blue-300">Neutral</div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
                    <div className="flex justify-center mb-2">
                      <Frown size={24} className="text-red-500 dark:text-red-400" />
                    </div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {mockSentimentData.overall.breakdown.negative}%
                    </div>
                    <div className="text-sm text-red-800 dark:text-red-300">Negative</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Key Phrases */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection('keyPhrases')}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-900 dark:text-gray-100">Key Phrases Analysis</CardTitle>
            {expandedSections.includes('keyPhrases') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </CardHeader>
        
        {expandedSections.includes('keyPhrases') && (
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search phrases..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Top Positive Phrases</h3>
                <div className="space-y-3">
                  {filteredKeyPhrases
                    .filter(phrase => phrase.sentiment === 'positive')
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((phrase, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Smile size={16} className="text-green-500 dark:text-green-400" />
                          <span className="text-gray-900 dark:text-gray-100">"{phrase.phrase}"</span>
                        </div>
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                          {phrase.count} mentions
                        </div>
                      </div>
                    ))}
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-6 mb-4">Top Negative Phrases</h3>
                <div className="space-y-3">
                  {filteredKeyPhrases
                    .filter(phrase => phrase.sentiment === 'negative')
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((phrase, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Frown size={16} className="text-red-500 dark:text-red-400" />
                          <span className="text-gray-900 dark:text-gray-100">"{phrase.phrase}"</span>
                        </div>
                        <div className="text-sm font-medium text-red-600 dark:text-red-400">
                          {phrase.count} mentions
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Phrase Frequency</h3>
                
                {/* Simple bar chart visualization */}
                <div className="space-y-4">
                  {filteredKeyPhrases
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10)
                    .map((phrase, index) => {
                      const maxCount = Math.max(...filteredKeyPhrases.map(p => p.count));
                      const width = (phrase.count / maxCount) * 100;
                      
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-900 dark:text-gray-100">"{phrase.phrase}"</span>
                            <span className="text-gray-500 dark:text-gray-400">{phrase.count} mentions</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                phrase.sentiment === 'positive' ? 'bg-green-500' : 
                                phrase.sentiment === 'neutral' ? 'bg-blue-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${width}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Positive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Neutral</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Negative</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Sentiment by Participant */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection('byParticipant')}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-900 dark:text-gray-100">Sentiment by Participant</CardTitle>
            {expandedSections.includes('byParticipant') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </CardHeader>
        
        {expandedSections.includes('byParticipant') && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Agent Performance</h3>
                <div className="space-y-4">
                  {mockSentimentData.byParticipant
                    .filter(p => p.role === 'Agent')
                    .sort((a, b) => b.score - a.score)
                    .map((participant, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                              {participant.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{participant.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${getSentimentColor(participant.score)}`}>
                              {participant.score}
                            </span>
                            <div className={getTrendColor(participant.trend)}>
                              {getTrendIcon(participant.trend)}
                              <span className="text-xs ml-1">{Math.abs(participant.trend)}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <Progress 
                          value={participant.score} 
                          variant={getSentimentVariant(participant.score)}
                        />
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                          Based on {participant.calls} calls
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Client Sentiment</h3>
                <div className="space-y-4">
                  {mockSentimentData.byParticipant
                    .filter(p => p.role === 'Client')
                    .sort((a, b) => b.score - a.score)
                    .map((participant, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{participant.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${getSentimentColor(participant.score)}`}>
                              {participant.score}
                            </span>
                            <div className={getTrendColor(participant.trend)}>
                              {getTrendIcon(participant.trend)}
                              <span className="text-xs ml-1">{Math.abs(participant.trend)}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <Progress 
                          value={participant.score} 
                          variant={getSentimentVariant(participant.score)}
                        />
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                          Based on {participant.calls} calls
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Sentiment by Topic */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="cursor-pointer" onClick={() => toggleSection('byTopic')}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-900 dark:text-gray-100">Sentiment by Topic</CardTitle>
            {expandedSections.includes('byTopic') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </CardHeader>
        
        {expandedSections.includes('byTopic') && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Topic Sentiment Scores</h3>
                <div className="space-y-4">
                  {mockSentimentData.byTopic
                    .sort((a, b) => b.score - a.score)
                    .map((topic, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{topic.topic}</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${getSentimentColor(topic.score)}`}>
                              {topic.score}
                            </span>
                            <div className={getTrendColor(topic.trend)}>
                              {getTrendIcon(topic.trend)}
                              <span className="text-xs ml-1">{Math.abs(topic.trend)}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <Progress 
                          value={topic.score} 
                          variant={getSentimentVariant(topic.score)}
                        />
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                          Based on {topic.calls} calls
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Topic Distribution</h3>
                
                {/* Simple pie chart visualization */}
                <div className="relative w-64 h-64 mx-auto">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {mockSentimentData.byTopic.map((topic, index, arr) => {
                      const total = arr.reduce((sum, t) => sum + t.calls, 0);
                      const percentage = (topic.calls / total) * 100;
                      
                      // Calculate the slice
                      let startAngle = 0;
                      for (let i = 0; i < index; i++) {
                        const prevTopic = arr[i];
                        startAngle += (prevTopic.calls / total) * 360;
                      }
                      
                      const endAngle = startAngle + (percentage * 3.6);
                      
                      // Convert angles to radians
                      const startRad = (startAngle - 90) * (Math.PI / 180);
                      const endRad = (endAngle - 90) * (Math.PI / 180);
                      
                      // Calculate points
                      const x1 = 50 + 40 * Math.cos(startRad);
                      const y1 = 50 + 40 * Math.sin(startRad);
                      const x2 = 50 + 40 * Math.cos(endRad);
                      const y2 = 50 + 40 * Math.sin(endRad);
                      
                      // Determine if the arc should be drawn as a large arc
                      const largeArcFlag = percentage > 50 ? 1 : 0;
                      
                      // Generate a color based on index
                      const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
                      const color = colors[index % colors.length];
                      
                      return (
                        <path
                          key={topic.topic}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={color}
                          stroke="white"
                          strokeWidth="1"
                          className="dark:stroke-gray-800"
                        />
                      );
                    })}
                  </svg>
                </div>
                
                <div className="mt-6 space-y-2">
                  {mockSentimentData.byTopic.map((topic, index) => {
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-red-500'];
                    const total = mockSentimentData.byTopic.reduce((sum, t) => sum + t.calls, 0);
                    const percentage = (topic.calls / total) * 100;
                    
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-sm`}></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{topic.topic}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatPercentage(percentage)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Recent Calls with Sentiment */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Recent Calls with Sentiment Analysis</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Latest calls with detailed sentiment scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSentimentData.recentCalls.map((call, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-full ${getSentimentBgColor(call.score)}`}>
                        {call.score >= 80 ? (
                          <Smile size={16} className="text-green-600 dark:text-green-400" />
                        ) : call.score >= 60 ? (
                          <Meh size={16} className="text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Frown size={16} className="text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{call.client}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Agent: {call.agent} • {call.duration} min
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key Phrases:</div>
                      <div className="flex flex-wrap gap-2">
                        {call.keyPhrases.map((phrase, i) => (
                          <Badge key={i} variant="default">{phrase}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className={`text-2xl font-bold ${getSentimentColor(call.score)}`}>
                      {call.score}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Sentiment Score
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      leftIcon={<FileText size={14} />}
                      onClick={() => console.log('View transcript for call', call.id)}
                    >
                      View Transcript
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm"
              rightIcon={<ExternalLink size={16} />}
              onClick={() => console.log('View all calls')}
            >
              View All Analyzed Calls
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentPage;