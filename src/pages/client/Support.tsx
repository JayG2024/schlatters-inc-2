import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  HelpCircle, 
  User, 
  Send,
  PaperclipIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Settings,
  CreditCard,
  Phone
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatDateTime } from '../../lib/utils';
import type { JSX } from 'react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: 'technical' | 'billing' | 'account' | 'general';
  assignee?: string;
  messages: {
    id: string;
    sender: 'client' | 'support';
    senderName: string;
    message: string;
    timestamp: string;
    attachments?: string[];
  }[];
}

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  updatedAt: string;
  helpful: number;
  notHelpful: number;
}

// Helper to get status badge
const getStatusBadge = (status: Ticket['status']) => {
  switch (status) {
    case 'open':
      return <Badge variant="warning">Open</Badge>;
    case 'in-progress':
      return <Badge variant="primary">In Progress</Badge>;
    case 'resolved':
      return <Badge variant="success">Resolved</Badge>;
    case 'closed':
      return <Badge variant="default">Closed</Badge>;
  }
};

// Helper to get priority badge
const getPriorityBadge = (priority: Ticket['priority']) => {
  switch (priority) {
    case 'low':
      return <Badge variant="info">Low</Badge>;
    case 'medium':
      return <Badge variant="warning">Medium</Badge>;
    case 'high':
      return <Badge variant="danger">High</Badge>;
  }
};

// Helper to get category badge
const getCategoryBadge = (category: Ticket['category']) => {
  switch (category) {
    case 'technical':
      return <Badge variant="primary">Technical</Badge>;
    case 'billing':
      return <Badge variant="success">Billing</Badge>;
    case 'account':
      return <Badge variant="warning">Account</Badge>;
    case 'general':
      return <Badge variant="default">General</Badge>;
  }
};

const SupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'knowledge'>('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search
  };
  
  const handleCreateTicket = () => {
    // In a real app, this would open a form to create a new ticket
  };
  
  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };
  
  const handleViewArticle = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
  };
  
  const handleCloseTicket = () => {
    setSelectedTicket(null);
  };
  
  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // In a real app, this would send the message and update the ticket
    setNewMessage('');
  };
  
  const handleArticleFeedback = (articleId: string, helpful: boolean) => {
    // In a real app, this would submit feedback
  };
  
  const filteredTickets: Ticket[] = [];
  
  const filteredArticles: KnowledgeArticle[] = [];
  
  // Common search and filter section
  const searchAndFilterSection = (
    <div className="flex flex-col sm:flex-row gap-3">
      <form onSubmit={handleSearch} className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder={activeTab === 'tickets' ? "Search tickets..." : "Search knowledge base..."}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600">
            Search
          </button>
        </div>
      </form>
      
      {activeTab === 'tickets' && (
        <Button leftIcon={<Plus size={16} />} onClick={handleCreateTicket}>
          New Ticket
        </Button>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support</h1>
          <p className="text-gray-600 mt-1">Get help and support for your services</p>
        </div>
        
        {searchAndFilterSection}
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'tickets'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('tickets')}
          >
            My Tickets
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'knowledge'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('knowledge')}
          >
            Knowledge Base
          </button>
        </div>
      </div>
      
      {/* Tickets Tab Content */}
      {activeTab === 'tickets' && (
        <>
          {selectedTicket ? (
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle>#{selectedTicket.id}: {selectedTicket.title}</CardTitle>
                  </div>
                  <CardDescription>
                    Created on {formatDateTime(selectedTicket.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleCloseTicket}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3 space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="text-gray-900">{selectedTicket.description}</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                      <div>{getCategoryBadge(selectedTicket.category)}</div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned To</h3>
                      <p className="text-gray-900">{selectedTicket.assignee || 'Unassigned'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                      <p className="text-gray-900">{formatDateTime(selectedTicket.lastUpdated)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Message thread */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Conversation</h3>
                  <div className="space-y-4">
                    {selectedTicket.messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`
                            max-w-[80%] md:max-w-[70%] rounded-lg p-4
                            ${message.sender === 'client' 
                              ? 'bg-blue-50 text-blue-900' 
                              : 'bg-gray-100 text-gray-900'}
                          `}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">{message.senderName}</span>
                            <span className="text-xs text-gray-500 ml-4">
                              {formatDateTime(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <div className="text-xs font-medium text-gray-500 mb-1">
                                Attachments:
                              </div>
                              <div className="space-y-1">
                                {message.attachments.map((attachment, index) => (
                                  <div key={index} className="flex items-center gap-1">
                                    <PaperclipIcon size={12} className="text-gray-400" />
                                    <a 
                                      href="#" 
                                      className="text-xs text-blue-600 hover:underline"
                                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                        e.preventDefault();
                                        // console.log(`Download attachment: ${attachment}`);
                                      }}
                                    >
                                      {attachment}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Reply form */}
                {(selectedTicket.status === 'open' || selectedTicket.status === 'in-progress') && (
                  <div className="pt-4">
                    <form onSubmit={handleSendMessage}>
                      <div className="mb-3">
                        <label 
                          htmlFor="reply-message" 
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Reply
                        </label>
                        <textarea
                          id="reply-message"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                          placeholder="Type your message here..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          leftIcon={<PaperclipIcon size={16} />}
                        >
                          Attach File
                        </Button>
                        <Button 
                          type="submit" 
                          rightIcon={<Send size={16} />}
                          disabled={!newMessage.trim()}
                        >
                          Send Reply
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {filteredTickets.length > 0 ? (
                <div className="space-y-4">
                  {filteredTickets.map(ticket => (
                    <Card 
                      key={ticket.id} 
                      className="bg-white hover:shadow-md transition-shadow cursor-pointer" 
                      onClick={() => handleViewTicket(ticket)}
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                #{ticket.id}: {ticket.title}
                              </h3>
                            </div>
                            
                            <p className="mt-2 text-gray-600 line-clamp-2">
                              {ticket.description}
                            </p>
                            
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>Opened: {formatDateTime(ticket.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>Updated: {formatDateTime(ticket.lastUpdated)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                            <div className="flex gap-2">
                              {getStatusBadge(ticket.status)}
                              {getPriorityBadge(ticket.priority)}
                              {getCategoryBadge(ticket.category)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white p-6 text-center">
                  <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No tickets found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? `No results for "${searchTerm}"`
                      : "You haven't created any support tickets yet."}
                  </p>
                  <Button leftIcon={<Plus size={16} />} onClick={handleCreateTicket}>
                    Create New Ticket
                  </Button>
                </Card>
              )}
              
              {/* Help section */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>Choose the support option that works best for you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={20} className="text-blue-600" />
                        <h3 className="font-medium text-blue-800">Create a Ticket</h3>
                      </div>
                      <p className="text-sm text-blue-700 mb-3">
                        Submit a detailed description of your issue for our support team to help.
                      </p>
                      <Button 
                        size="sm" 
                        leftIcon={<Plus size={14} />}
                        onClick={handleCreateTicket}
                      >
                        New Ticket
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle size={20} className="text-green-600" />
                        <h3 className="font-medium text-green-800">Knowledge Base</h3>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        Find answers to common questions in our extensive knowledge base.
                      </p>
                      <Button 
                        size="sm" 
                        leftIcon={<ExternalLink size={14} />}
                        onClick={() => setActiveTab('knowledge')}
                      >
                        Browse Articles
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={20} className="text-purple-600" />
                        <h3 className="font-medium text-purple-800">Contact Us</h3>
                      </div>
                      <p className="text-sm text-purple-700 mb-3">
                        Call or email our support team for urgent matters.
                      </p>
                      <div className="text-sm text-purple-800">
                        <div>support@example.com</div>
                        <div>+1 (800) 123-4567</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
      
      {/* Knowledge Base Tab Content */}
      {activeTab === 'knowledge' && (
        <>
          {selectedArticle ? (
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle>{selectedArticle.title}</CardTitle>
                    <Badge variant="info">{selectedArticle.category}</Badge>
                  </div>
                  <CardDescription>
                    Last updated on {formatDateTime(selectedArticle.updatedAt)}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCloseArticle}
                >
                  Close
                </Button>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-900">{selectedArticle.content}</p>
                  {/* In a real app, this would be rich HTML content */}
                  
                  {/* Example content for demonstration */}
                  <h2 className="text-xl font-bold mt-6 mb-3">Introduction</h2>
                  <p className="mb-4">This guide will help you understand the basics of our platform and how to make the most of its features.</p>
                  
                  <h2 className="text-xl font-bold mt-6 mb-3">Getting Started</h2>
                  <p className="mb-4">To get started with our service, follow these simple steps:</p>
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>Sign in to your account using your credentials</li>
                    <li>Complete your profile setup</li>
                    <li>Explore the dashboard to familiarize yourself with the interface</li>
                    <li>Check out the available features and tools</li>
                  </ol>
                  
                  <h2 className="text-xl font-bold mt-6 mb-3">Best Practices</h2>
                  <p className="mb-4">To make the most of our platform, consider these best practices:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Regularly update your information</li>
                    <li>Check notifications for important updates</li>
                    <li>Use the search function to quickly find what you need</li>
                    <li>Contact support if you encounter any issues</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500 mb-3 sm:mb-0">
                  Was this article helpful?
                </div>
                <div className="flex gap-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    leftIcon={<ThumbsUp size={14} />}
                    onClick={() => handleArticleFeedback(selectedArticle.id, true)}
                  >
                    Yes ({selectedArticle.helpful})
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    leftIcon={<ThumbsDown size={14} />}
                    onClick={() => handleArticleFeedback(selectedArticle.id, false)}
                  >
                    No ({selectedArticle.notHelpful})
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <>
              {/* Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                        <HelpCircle size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Getting Started</h3>
                        <p className="text-sm text-gray-500">Basic guides and tutorials</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 text-green-600 rounded-md">
                        <Settings size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Technical Guides</h3>
                        <p className="text-sm text-gray-500">Advanced how-to guides</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-md">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Billing & Payments</h3>
                        <p className="text-sm text-gray-500">Invoice and payment help</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 text-amber-600 rounded-md">
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Troubleshooting</h3>
                        <p className="text-sm text-gray-500">Common issues and fixes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Articles list */}
              {filteredArticles.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Popular Articles</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredArticles.map(article => (
                      <Card 
                        key={article.id} 
                        className="bg-white hover:shadow-md transition-shadow cursor-pointer" 
                        onClick={() => handleViewArticle(article)}
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-blue-600 hover:underline">
                                {article.title}
                              </h3>
                              <Badge variant="info" className="mt-1">{article.category}</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <ThumbsUp size={14} />
                              <span>{article.helpful}</span>
                            </div>
                          </div>
                          
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {article.content}
                          </p>
                          
                          <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>Updated {formatDateTime(article.updatedAt)}</span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-blue-600"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                handleViewArticle(article);
                              }}
                            >
                              Read More
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="bg-white p-6 text-center">
                  <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No articles found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? `No results for "${searchTerm}"`
                      : "There are no knowledge base articles available."}
                  </p>
                  {searchTerm && (
                    <Button onClick={() => setSearchTerm('')}>
                      Clear Search
                    </Button>
                  )}
                </Card>
              )}
              
              {/* Contact section */}
              <Card className="bg-white mt-6">
                <CardHeader>
                  <CardTitle>Can't find what you're looking for?</CardTitle>
                  <CardDescription>
                    Our support team is ready to help you with any questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={20} className="text-blue-600" />
                        <h3 className="font-medium text-blue-800">Create a Ticket</h3>
                      </div>
                      <p className="text-sm text-blue-700 mb-3">
                        Submit a detailed description of your issue for our support team to help.
                      </p>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setActiveTab('tickets');
                          setTimeout(handleCreateTicket, 100);
                        }}
                      >
                        New Ticket
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={20} className="text-green-600" />
                        <h3 className="font-medium text-green-800">Live Chat</h3>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        Chat with our support team for immediate assistance with simple questions.
                      </p>
                      <Button 
                        size="sm" 
                        onClick={() => console.log('Start live chat')}
                      >
                        Start Chat
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone size={20} className="text-purple-600" />
                        <h3 className="font-medium text-purple-800">Phone Support</h3>
                      </div>
                      <p className="text-sm text-purple-700 mb-3">
                        Call our support team for urgent matters.
                      </p>
                      <div className="text-sm font-medium text-purple-800">
                        +1 (800) 123-4567
                      </div>
                      <div className="text-xs text-purple-700 mt-1">
                        Available Mon-Fri, 9am-5pm EST
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SupportPage;