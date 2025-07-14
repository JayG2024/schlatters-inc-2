import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  DollarSign, 
  Calendar,
  FileText,
  Clock,
  Shield,
  Package,
  History,
  Send,
  User,
  MapPin,
  Building,
  Hash,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';

interface Purchase {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'product' | 'service' | 'subscription';
}

interface Communication {
  id: string;
  type: 'call' | 'sms' | 'email';
  direction: 'inbound' | 'outbound';
  timestamp: string;
  duration?: number; // for calls
  content?: string; // for sms/email
  transcriptUrl?: string; // for calls
  recordingUrl?: string; // for calls
}

interface Subscription {
  id: string;
  planName: string;
  hoursIncluded: number;
  hoursUsed: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  monthlyRate: number;
}

interface Client {
  id: string;
  // Basic Info
  name: string;
  company?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  
  // QuickBooks Integration
  quickbooksId?: string;
  
  // Subscription Info
  subscription?: Subscription;
  isPayPerCall: boolean;
  
  // Financial
  totalRevenue: number;
  outstandingBalance: number;
  
  // Purchase History
  purchases: Purchase[];
  
  // Communication History
  communications: Communication[];
  
  // Metadata
  createdAt: string;
  lastContactDate: string;
  tags: string[];
  notes?: string;
}

interface ClientProfileProps {
  client: Client;
  onSendSMS: (clientId: string, message: string) => void;
  onSendEmail: (clientId: string, subject: string, body: string) => void;
  onMakeCall: (clientId: string) => void;
  onViewTranscript: (communicationId: string) => void;
}

export const ClientProfile: React.FC<ClientProfileProps> = ({
  client,
  onSendSMS,
  onSendEmail,
  onMakeCall,
  onViewTranscript
}) => {
  const [showSMSComposer, setShowSMSComposer] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const handleSendSMS = () => {
    onSendSMS(client.id, smsMessage);
    setSmsMessage('');
    setShowSMSComposer(false);
  };

  const handleSendEmail = () => {
    onSendEmail(client.id, emailSubject, emailBody);
    setEmailSubject('');
    setEmailBody('');
    setShowEmailComposer(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {client.name}
          </h1>
          {client.company && (
            <p className="text-gray-600 dark:text-gray-400">{client.company}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Phone size={16} />}
            onClick={() => onMakeCall(client.id)}
          >
            Call
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<MessageSquare size={16} />}
            onClick={() => setShowSMSComposer(true)}
          >
            SMS
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Mail size={16} />}
            onClick={() => setShowEmailComposer(true)}
          >
            Email
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact Info & Subscription */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <span className="text-sm">{client.phone}</span>
              </div>
              {client.alternatePhone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm">{client.alternatePhone} (alt)</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-sm">{client.email}</span>
              </div>
              {client.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <div className="text-sm">
                    <p>{client.address.street}</p>
                    <p>{client.address.city}, {client.address.state} {client.address.zip}</p>
                  </div>
                </div>
              )}
              {client.quickbooksId && (
                <div className="flex items-center gap-2">
                  <Hash size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">QB: {client.quickbooksId}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield size={20} />
                Support Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client.subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{client.subscription.planName}</span>
                    <Badge variant={client.subscription.status === 'active' ? 'success' : 'danger'}>
                      {client.subscription.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hours Used</span>
                      <span>{client.subscription.hoursUsed} / {client.subscription.hoursIncluded}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(client.subscription.hoursUsed / client.subscription.hoursIncluded) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>Expires: {formatDate(new Date(client.subscription.endDate))}</p>
                    <p>Monthly: {formatCurrency(client.subscription.monthlyRate)}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-sm text-gray-600">Pay-per-call customer</p>
                  <Button size="sm" className="mt-2">
                    Offer Support Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="font-medium">{formatCurrency(client.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Outstanding</span>
                <span className={`font-medium ${client.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(client.outstandingBalance)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Purchase History */}
        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package size={20} />
                Purchase History
              </CardTitle>
              <CardDescription>
                All products and services purchased
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {client.purchases.map((purchase) => (
                  <div 
                    key={purchase.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{purchase.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(new Date(purchase.date))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{formatCurrency(purchase.amount)}</p>
                        <Badge size="xs" variant={
                          purchase.type === 'subscription' ? 'primary' : 'secondary'
                        }>
                          {purchase.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Communication History */}
        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History size={20} />
                Communication History
              </CardTitle>
              <CardDescription>
                All calls, texts, and emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {client.communications.map((comm) => (
                  <div 
                    key={comm.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => comm.transcriptUrl && onViewTranscript(comm.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {comm.type === 'call' && <Phone size={16} className="text-blue-500" />}
                        {comm.type === 'sms' && <MessageSquare size={16} className="text-purple-500" />}
                        {comm.type === 'email' && <Mail size={16} className="text-green-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium">
                            {comm.direction === 'inbound' ? 'Received' : 'Sent'} {comm.type}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(new Date(comm.timestamp))}
                          </p>
                        </div>
                        {comm.duration && (
                          <p className="text-xs text-gray-600 mt-1">
                            Duration: {Math.round(comm.duration / 60)}m
                          </p>
                        )}
                        {comm.content && (
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {comm.content}
                          </p>
                        )}
                        {comm.transcriptUrl && (
                          <p className="text-xs text-blue-600 mt-1">
                            View transcript →
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Communication Composers */}
      {showSMSComposer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Send SMS to {client.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full h-32 p-3 border rounded-lg"
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">{smsMessage.length}/160</p>
            </CardContent>
            <div className="flex justify-end gap-2 p-4">
              <Button variant="ghost" onClick={() => setShowSMSComposer(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendSMS} leftIcon={<Send size={16} />}>
                Send SMS
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showEmailComposer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Send Email to {client.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Subject"
                className="w-full p-3 border rounded-lg"
              />
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Email body..."
                className="w-full h-64 p-3 border rounded-lg"
              />
            </CardContent>
            <div className="flex justify-end gap-2 p-4">
              <Button variant="ghost" onClick={() => setShowEmailComposer(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail} leftIcon={<Send size={16} />}>
                Send Email
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;