import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  User, 
  Users, 
  Clock, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Check, 
  Image, 
  File, 
  Loader,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { formatDateTime } from '../../../lib/utils';

interface MessagesPageProps {}

const MessagesPage: React.FC<MessagesPageProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactFilter, setContactFilter] = useState<'all' | 'unread' | 'client' | 'team' | 'internal'>('all');
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedContact) {
      // This part would typically fetch messages from a database
      // For now, it will just generate some mock messages for the selected contact
      // In a real application, you'd call a Supabase function to get messages
      // setMessages(generateMockMessages(selectedContact.id)); 
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredContacts = [
    // This would typically be fetched from a database
    // For now, it's a placeholder
    { 
      id: '1', 
      name: 'Acme Corporation', 
      avatar: null, 
      lastMessage: 'Thanks for the update on our project status.',
      lastMessageTime: '2025-05-10T14:30:00',
      unread: 2,
      online: true,
      type: 'client'
    },
    { 
      id: '2', 
      name: 'TechSolutions Inc', 
      avatar: null, 
      lastMessage: 'When can we schedule the next consultation call?',
      lastMessageTime: '2025-05-09T11:20:00',
      unread: 0,
      online: false,
      type: 'client'
    },
    { 
      id: '3', 
      name: 'Global Ventures', 
      avatar: null, 
      lastMessage: 'The invoice has been paid. Thank you.',
      lastMessageTime: '2025-05-08T16:45:00',
      unread: 0,
      online: true,
      type: 'client'
    },
    { 
      id: '4', 
      name: 'Innovate LLC', 
      avatar: null, 
      lastMessage: 'We need to discuss the new requirements.',
      lastMessageTime: '2025-05-07T09:30:00',
      unread: 1,
      online: false,
      type: 'client'
    },
    { 
      id: '5', 
      name: 'Premier Services', 
      avatar: null, 
      lastMessage: 'Looking forward to our meeting tomorrow.',
      lastMessageTime: '2025-05-06T13:15:00',
      unread: 0,
      online: true,
      type: 'client'
    },
    { 
      id: '6', 
      name: 'Support Team', 
      avatar: null, 
      lastMessage: 'New ticket assigned to your team.',
      lastMessageTime: '2025-05-10T10:00:00',
      unread: 3,
      online: true,
      type: 'internal'
    },
    { 
      id: '7', 
      name: 'Sales Department', 
      avatar: null, 
      lastMessage: 'New lead qualification needed.',
      lastMessageTime: '2025-05-09T15:45:00',
      unread: 0,
      online: true,
      type: 'internal'
    },
    { 
      id: '8', 
      name: 'Jane Smith', 
      avatar: null, 
      lastMessage: 'Can you review the proposal before I send it?',
      lastMessageTime: '2025-05-08T11:30:00',
      unread: 0,
      online: false,
      type: 'team'
    },
    { 
      id: '9', 
      name: 'John Doe', 
      avatar: null, 
      lastMessage: 'Client meeting notes attached.',
      lastMessageTime: '2025-05-07T14:20:00',
      unread: 0,
      online: true,
      type: 'team'
    },
    { 
      id: '10', 
      name: 'Mike Wilson', 
      avatar: null, 
      lastMessage: 'Updated the project timeline.',
      lastMessageTime: '2025-05-06T16:10:00',
      unread: 0,
      online: false,
      type: 'team'
    }
  ].filter(contact => {
    // Apply search filter
    if (searchTerm && !contact.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply contact type filter
    if (contactFilter === 'unread' && contact.unread === 0) {
      return false;
    } else if (contactFilter === 'client' && contact.type !== 'client') {
      return false;
    } else if (contactFilter === 'team' && contact.type !== 'team') {
      return false;
    } else if (contactFilter === 'internal' && contact.type !== 'internal') {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by unread first, then by last message time
    if (a.unread > 0 && b.unread === 0) return -1;
    if (a.unread === 0 && b.unread > 0) return 1;
    return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
  });

  const handleSelectContact = (contact: any) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;
    
    const newMsg = {
      id: `msg-${selectedContact.id}-${messages.length}`,
      sender: 'me',
      senderName: 'Me',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'client':
        return <Badge variant="primary">Client</Badge>;
      case 'team':
        return <Badge variant="success">Team</Badge>;
      case 'internal':
        return <Badge variant="info">Internal</Badge>;
      default:
        return null;
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image size={16} />;
      case 'document':
        return <File size={16} />;
      case 'spreadsheet':
        return <File size={16} />;
      default:
        return <File size={16} />;
    }
  };

  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1000) {
      return `${sizeInKB} KB`;
    }
    return `${(sizeInKB / 1000).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader size={40} className="animate-spin text-blue-600 dark:text-blue-400 mb-4" />
          <p className="text-blue-600 dark:text-blue-400 font-medium">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and respond to client and team communications
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
        {/* Contacts List */}
        <Card className="bg-white dark:bg-gray-800 overflow-hidden flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-gray-100">Conversations</CardTitle>
              <Button size="sm" variant="ghost" leftIcon={<Filter size={16} />}>
                Filter
              </Button>
            </div>
            <div className="relative mt-2">
              <input
                type="text"
                placeholder="Search conversations..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </CardHeader>
          
          <div className="px-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant={contactFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setContactFilter('all')}
                className="flex-1"
              >
                All
              </Button>
              <Button 
                size="sm" 
                variant={contactFilter === 'unread' ? 'default' : 'outline'}
                onClick={() => setContactFilter('unread')}
                className="flex-1"
              >
                Unread
              </Button>
              <Button 
                size="sm" 
                variant={contactFilter === 'client' ? 'default' : 'outline'}
                onClick={() => setContactFilter('client')}
                className="flex-1"
              >
                Clients
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredContacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id 
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                    }`}
                    onClick={() => handleSelectContact(contact)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {contact.avatar ? (
                          <img 
                            src={contact.avatar} 
                            alt={contact.name} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                            {getInitials(contact.name)}
                          </div>
                        )}
                        {contact.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {contact.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                            {formatMessageTime(contact.lastMessageTime)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {contact.lastMessage}
                          </div>
                          {contact.unread > 0 && (
                            <div className="ml-2 bg-blue-600 text-white text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                              {contact.unread}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <MessageSquare size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No conversations found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm 
                    ? `No results for "${searchTerm}"`
                    : contactFilter !== 'all' 
                      ? `No ${contactFilter} conversations found`
                      : "You don't have any conversations yet"}
                </p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
        
        {/* Message Thread */}
        <Card className="bg-white dark:bg-gray-800 lg:col-span-2 flex flex-col">
          {selectedContact ? (
            <>
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="lg:hidden">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => setSelectedContact(null)}
                      >
                        <ArrowLeft size={16} />
                      </Button>
                    </div>
                    
                    <div className="relative">
                      {selectedContact.avatar ? (
                        <img 
                          src={selectedContact.avatar} 
                          alt={selectedContact.name} 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                          {getInitials(selectedContact.name)}
                        </div>
                      )}
                      {selectedContact.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedContact.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {selectedContact.online ? 'Online' : 'Offline'}
                        {getContactTypeLabel(selectedContact.type)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                      <Phone size={18} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                      <Video size={18} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                      <MoreVertical size={18} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => {
                  const isFirstInGroup = index === 0 || messages[index - 1].sender !== message.sender;
                  const isLastInGroup = index === messages.length - 1 || messages[index + 1].sender !== message.sender;
                  const showSender = isFirstInGroup;
                  
                  // Check if this is a new day compared to previous message
                  const showDateSeparator = index === 0 || 
                    new Date(message.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString();
                  
                  return (
                    <React.Fragment key={message.id}>
                      {showDateSeparator && (
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-600 dark:text-gray-300">
                            {new Date(message.timestamp).toLocaleDateString(undefined, { 
                              weekday: 'long', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] ${isLastInGroup ? 'mb-4' : 'mb-1'}`}>
                          {showSender && message.sender !== 'me' && (
                            <div className="flex items-center mb-1 ml-12">
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {message.senderName}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-start gap-2">
                            {message.sender !== 'me' && showSender && (
                              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium mt-1">
                                {getInitials(message.senderName)}
                              </div>
                            )}
                            
                            <div className={`flex flex-col ${message.sender !== 'me' && !showSender ? 'ml-10' : ''}`}>
                              <div className={`rounded-lg px-4 py-2 ${
                                message.sender === 'me'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                              }`}>
                                {message.content}
                              </div>
                              
                              {message.attachment && (
                                <div className={`mt-2 rounded-lg p-3 ${
                                  message.sender === 'me'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                }`}>
                                  <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-md ${
                                      message.sender === 'me'
                                        ? 'bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-600'
                                    }`}>
                                      {getAttachmentIcon(message.attachment.type)}
                                    </div>
                                    <div>
                                      <div className="font-medium">{message.attachment.name}</div>
                                      <div className="text-xs opacity-80">{formatFileSize(message.attachment.size)}</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <div className={`text-xs mt-1 ${
                                message.sender === 'me'
                                  ? 'text-right text-gray-500 dark:text-gray-400'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {formatMessageTime(message.timestamp)}
                                {message.sender === 'me' && (
                                  <span className="ml-1">
                                    {message.read ? (
                                      <Check size={14} className="inline text-blue-500" />
                                    ) : (
                                      <Check size={14} className="inline text-gray-400" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              
              <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-4">
                <form onSubmit={handleSendMessage} className="w-full">
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500 dark:text-gray-400"
                    >
                      <Paperclip size={18} />
                    </Button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button 
                      type="submit" 
                      disabled={!newMessage.trim()}
                      size="sm"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </form>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <MessageSquare size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No Conversation Selected</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                Select a conversation from the list to view messages or start a new conversation.
              </p>
              <Button leftIcon={<Users size={16} />}>
                Start New Conversation
              </Button>
            </div>
          )}
        </Card>
      </div>
      
      {/* Message Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Message Statistics</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Overview of messaging activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare size={20} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-900 dark:text-gray-100">Total Conversations</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {/* This would typically be fetched from a database */}
                  {5}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-900 dark:text-gray-100">Client Conversations</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {/* This would typically be fetched from a database */}
                  {3}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare size={20} className="text-red-600 dark:text-red-400" />
                  <span className="text-gray-900 dark:text-gray-100">Unread Messages</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {/* This would typically be fetched from a database */}
                  {2}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-green-600 dark:text-green-400" />
                  <span className="text-gray-900 dark:text-gray-100">Response Time</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  ~15 min
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Recent Activity</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Latest messaging activity across all conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would typically be fetched from a database */}
              {[
                { 
                  id: '1', 
                  name: 'Acme Corporation', 
                  avatar: null, 
                  lastMessage: 'Thanks for the update on our project status.',
                  lastMessageTime: '2025-05-10T14:30:00',
                  unread: 2,
                  online: true,
                  type: 'client'
                },
                { 
                  id: '2', 
                  name: 'TechSolutions Inc', 
                  avatar: null, 
                  lastMessage: 'When can we schedule the next consultation call?',
                  lastMessageTime: '2025-05-09T11:20:00',
                  unread: 0,
                  online: false,
                  type: 'client'
                },
                { 
                  id: '3', 
                  name: 'Global Ventures', 
                  avatar: null, 
                  lastMessage: 'The invoice has been paid. Thank you.',
                  lastMessageTime: '2025-05-08T16:45:00',
                  unread: 0,
                  online: true,
                  type: 'client'
                },
                { 
                  id: '4', 
                  name: 'Innovate LLC', 
                  avatar: null, 
                  lastMessage: 'We need to discuss the new requirements.',
                  lastMessageTime: '2025-05-07T09:30:00',
                  unread: 1,
                  online: false,
                  type: 'client'
                },
                { 
                  id: '5', 
                  name: 'Premier Services', 
                  avatar: null, 
                  lastMessage: 'Looking forward to our meeting tomorrow.',
                  lastMessageTime: '2025-05-06T13:15:00',
                  unread: 0,
                  online: true,
                  type: 'client'
                },
                { 
                  id: '6', 
                  name: 'Support Team', 
                  avatar: null, 
                  lastMessage: 'New ticket assigned to your team.',
                  lastMessageTime: '2025-05-10T10:00:00',
                  unread: 3,
                  online: true,
                  type: 'internal'
                },
                { 
                  id: '7', 
                  name: 'Sales Department', 
                  avatar: null, 
                  lastMessage: 'New lead qualification needed.',
                  lastMessageTime: '2025-05-09T15:45:00',
                  unread: 0,
                  online: true,
                  type: 'internal'
                },
                { 
                  id: '8', 
                  name: 'Jane Smith', 
                  avatar: null, 
                  lastMessage: 'Can you review the proposal before I send it?',
                  lastMessageTime: '2025-05-08T11:30:00',
                  unread: 0,
                  online: false,
                  type: 'team'
                },
                { 
                  id: '9', 
                  name: 'John Doe', 
                  avatar: null, 
                  lastMessage: 'Client meeting notes attached.',
                  lastMessageTime: '2025-05-07T14:20:00',
                  unread: 0,
                  online: true,
                  type: 'team'
                },
                { 
                  id: '10', 
                  name: 'Mike Wilson', 
                  avatar: null, 
                  lastMessage: 'Updated the project timeline.',
                  lastMessageTime: '2025-05-06T16:10:00',
                  unread: 0,
                  online: false,
                  type: 'team'
                }
              ].slice(0, 5).map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {contact.avatar ? (
                        <img 
                          src={contact.avatar} 
                          alt={contact.name} 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                          {getInitials(contact.name)}
                        </div>
                      )}
                      {contact.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-750"></div>
                      )}
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {contact.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                        {contact.lastMessage}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatMessageTime(contact.lastMessageTime)}
                    </div>
                    {contact.unread > 0 && (
                      <div className="mt-1 bg-blue-600 text-white text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                        {contact.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                size="sm"
                rightIcon={<ChevronRight size={16} />}
              >
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;