import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Phone, 
  Calendar, 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Settings, 
  Save, 
  X, 
  Clock, 
  User, 
  Users, 
  FileText
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

interface NotificationSetting {
  id: string;
  category: string;
  name: string;
  description: string;
  email: boolean;
  sms: boolean;
  inApp: boolean;
  push: boolean;
}

const notificationSettings: NotificationSetting[] = [
  {
    id: 'new-client',
    category: 'clients',
    name: 'New Customer',
    description: 'When a new customer is added to the system',
    email: true,
    sms: false,
    inApp: true,
    push: false
  },
  {
    id: 'client-update',
    category: 'clients',
    name: 'Client Updates',
    description: 'When client information is updated',
    email: false,
    sms: false,
    inApp: true,
    push: false
  },
  {
    id: 'new-invoice',
    category: 'billing',
    name: 'New Invoice',
    description: 'When a new invoice is created',
    email: true,
    sms: false,
    inApp: true,
    push: false
  },
  {
    id: 'payment-received',
    category: 'billing',
    name: 'Payment Received',
    description: 'When a payment is received',
    email: true,
    sms: true,
    inApp: true,
    push: true
  },
  {
    id: 'invoice-overdue',
    category: 'billing',
    name: 'Invoice Overdue',
    description: 'When an invoice becomes overdue',
    email: true,
    sms: true,
    inApp: true,
    push: true
  },
  {
    id: 'new-appointment',
    category: 'calendar',
    name: 'New Appointment',
    description: 'When a new appointment is scheduled',
    email: true,
    sms: true,
    inApp: true,
    push: true
  },
  {
    id: 'appointment-reminder',
    category: 'calendar',
    name: 'Appointment Reminder',
    description: 'Reminder before an upcoming appointment',
    email: true,
    sms: true,
    inApp: true,
    push: true
  },
  {
    id: 'missed-call',
    category: 'communications',
    name: 'Missed Call',
    description: 'When you miss a call from a client',
    email: false,
    sms: true,
    inApp: true,
    push: true
  },
  {
    id: 'new-message',
    category: 'communications',
    name: 'New Message',
    description: 'When you receive a new message',
    email: false,
    sms: false,
    inApp: true,
    push: true
  },
  {
    id: 'support-ticket',
    category: 'support',
    name: 'Support Ticket Updates',
    description: 'When there are updates to support tickets',
    email: true,
    sms: false,
    inApp: true,
    push: false
  },
  {
    id: 'system-updates',
    category: 'system',
    name: 'System Updates',
    description: 'Important system updates and maintenance notifications',
    email: true,
    sms: false,
    inApp: true,
    push: false
  }
];

const Notifications: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>(notificationSettings);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  
  const categories = [
    { id: 'all', name: 'All Notifications', icon: <Bell size={16} /> },
    { id: 'clients', name: 'Clients', icon: <Users size={16} /> },
    { id: 'billing', name: 'Billing', icon: <CreditCard size={16} /> },
    { id: 'calendar', name: 'Calendar', icon: <Calendar size={16} /> },
    { id: 'communications', name: 'Communications', icon: <MessageSquare size={16} /> },
    { id: 'support', name: 'Support', icon: <AlertCircle size={16} /> },
    { id: 'system', name: 'System', icon: <Settings size={16} /> }
  ];
  
  const filteredSettings = settings.filter(setting => 
    activeCategory === 'all' || setting.category === activeCategory
  );
  
  const handleToggle = (id: string, channel: 'email' | 'sms' | 'inApp' | 'push') => {
    if (!isEditing) return;
    
    setSettings(settings.map(setting => 
      setting.id === id 
        ? { ...setting, [channel]: !setting[channel] }
        : setting
    ));
  };
  
  const handleSaveChanges = () => {
    setIsEditing(false);
    // In a real app, this would save the settings to the backend
    console.log('Saving notification settings:', settings);
  };
  
  const handleCancelChanges = () => {
    setIsEditing(false);
    setSettings(notificationSettings); // Reset to original settings
  };
  
  const handleEnableAll = (channel: 'email' | 'sms' | 'inApp' | 'push') => {
    if (!isEditing) return;
    
    setSettings(settings.map(setting => ({
      ...setting,
      [channel]: true
    })));
  };
  
  const handleDisableAll = (channel: 'email' | 'sms' | 'inApp' | 'push') => {
    if (!isEditing) return;
    
    setSettings(settings.map(setting => ({
      ...setting,
      [channel]: false
    })));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notification Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Configure how and when you receive notifications</p>
        </div>
        
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                leftIcon={<X size={16} />}
                onClick={handleCancelChanges}
              >
                Cancel
              </Button>
              <Button 
                leftIcon={<Save size={16} />}
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button 
              leftIcon={<Settings size={16} />}
              onClick={() => setIsEditing(true)}
            >
              Edit Settings
            </Button>
          )}
        </div>
      </div>
      
      {/* Categories */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-6 overflow-x-auto pb-1">
          {categories.map(category => (
            <button
              key={category.id}
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeCategory === category.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Notification Channels */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>
            Configure your preferred notification methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                  <Mail size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Email</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
                </div>
              </div>
              <div className="flex justify-between">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                  disabled={!isEditing}
                  onClick={() => handleEnableAll('email')}
                >
                  Enable All
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                  disabled={!isEditing}
                  onClick={() => handleDisableAll('email')}
                >
                  Disable All
                </Button>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-md">
                  <MessageSquare size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">SMS</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex justify-between">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                  disabled={!isEditing}
                  onClick={() => handleEnableAll('sms')}
                >
                  Enable All
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                  disabled={!isEditing}
                  onClick={() => handleDisableAll('sms')}
                >
                  Disable All
                </Button>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                  <Bell size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">In-App</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard notifications</p>
                </div>
              </div>
              <div className="flex justify-between">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                  disabled={!isEditing}
                  onClick={() => handleEnableAll('inApp')}
                >
                  Enable All
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                  disabled={!isEditing}
                  onClick={() => handleDisableAll('inApp')}
                >
                  Disable All
                </Button>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-md">
                  <Bell size={18} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Push</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Mobile app notifications</p>
                </div>
              </div>
              <div className="flex justify-between">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                  disabled={!isEditing}
                  onClick={() => handleEnableAll('push')}
                >
                  Enable All
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                  disabled={!isEditing}
                  onClick={() => handleDisableAll('push')}
                >
                  Disable All
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Notification Settings Table */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose which notifications you want to receive and how
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-750 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Notification</th>
                  <th className="px-6 py-3 text-center">Email</th>
                  <th className="px-6 py-3 text-center">SMS</th>
                  <th className="px-6 py-3 text-center">In-App</th>
                  <th className="px-6 py-3 text-center">Push</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {filteredSettings.map(setting => (
                  <tr key={setting.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{setting.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.email}
                            onChange={() => handleToggle(setting.id, 'email')}
                            className="sr-only peer"
                            disabled={!isEditing}
                          />
                          <div className={`
                            w-11 h-6 rounded-full
                            peer-focus:outline-none 
                            peer-focus:ring-2 
                            peer-focus:ring-blue-300
                            after:content-[''] 
                            after:absolute 
                            after:top-[2px] 
                            after:left-[2px] 
                            after:bg-white 
                            after:rounded-full 
                            after:h-5 
                            after:w-5 
                            after:transition-all
                            ${setting.email 
                              ? 'bg-blue-600 dark:bg-blue-500 after:translate-x-full' 
                              : 'bg-gray-200 dark:bg-gray-700'
                            }
                            ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}
                          `}></div>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.sms}
                            onChange={() => handleToggle(setting.id, 'sms')}
                            className="sr-only peer"
                            disabled={!isEditing}
                          />
                          <div className={`
                            w-11 h-6 rounded-full
                            peer-focus:outline-none 
                            peer-focus:ring-2 
                            peer-focus:ring-blue-300
                            after:content-[''] 
                            after:absolute 
                            after:top-[2px] 
                            after:left-[2px] 
                            after:bg-white 
                            after:rounded-full 
                            after:h-5 
                            after:w-5 
                            after:transition-all
                            ${setting.sms 
                              ? 'bg-blue-600 dark:bg-blue-500 after:translate-x-full' 
                              : 'bg-gray-200 dark:bg-gray-700'
                            }
                            ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}
                          `}></div>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.inApp}
                            onChange={() => handleToggle(setting.id, 'inApp')}
                            className="sr-only peer"
                            disabled={!isEditing}
                          />
                          <div className={`
                            w-11 h-6 rounded-full
                            peer-focus:outline-none 
                            peer-focus:ring-2 
                            peer-focus:ring-blue-300
                            after:content-[''] 
                            after:absolute 
                            after:top-[2px] 
                            after:left-[2px] 
                            after:bg-white 
                            after:rounded-full 
                            after:h-5 
                            after:w-5 
                            after:transition-all
                            ${setting.inApp 
                              ? 'bg-blue-600 dark:bg-blue-500 after:translate-x-full' 
                              : 'bg-gray-200 dark:bg-gray-700'
                            }
                            ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}
                          `}></div>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.push}
                            onChange={() => handleToggle(setting.id, 'push')}
                            className="sr-only peer"
                            disabled={!isEditing}
                          />
                          <div className={`
                            w-11 h-6 rounded-full
                            peer-focus:outline-none 
                            peer-focus:ring-2 
                            peer-focus:ring-blue-300
                            after:content-[''] 
                            after:absolute 
                            after:top-[2px] 
                            after:left-[2px] 
                            after:bg-white 
                            after:rounded-full 
                            after:h-5 
                            after:w-5 
                            after:transition-all
                            ${setting.push 
                              ? 'bg-blue-600 dark:bg-blue-500 after:translate-x-full' 
                              : 'bg-gray-200 dark:bg-gray-700'
                            }
                            ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}
                          `}></div>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: May 10, 2025
            </div>
            {isEditing && (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  leftIcon={<X size={16} />}
                  onClick={handleCancelChanges}
                >
                  Cancel
                </Button>
                <Button 
                  leftIcon={<Save size={16} />}
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {/* Notification Schedule */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={20} className="text-blue-600 dark:text-blue-400" />
            Notification Schedule
          </CardTitle>
          <CardDescription>
            Configure when notifications are sent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Email Digest</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="digest-daily"
                      type="radio"
                      name="digest"
                      className="h-4 w-4 text-blue-600 border-gray-300"
                      defaultChecked
                      disabled={!isEditing}
                    />
                    <label htmlFor="digest-daily" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Daily Digest
                    </label>
                  </div>
                  <select 
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    defaultValue="09:00"
                    disabled={!isEditing}
                  >
                    <option value="06:00">6:00 AM</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="digest-weekly"
                    type="radio"
                    name="digest"
                    className="h-4 w-4 text-blue-600 border-gray-300"
                    disabled={!isEditing}
                  />
                  <label htmlFor="digest-weekly" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Weekly Digest (Monday)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="digest-none"
                    type="radio"
                    name="digest"
                    className="h-4 w-4 text-blue-600 border-gray-300"
                    disabled={!isEditing}
                  />
                  <label htmlFor="digest-none" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    No digest (individual emails only)
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Quiet Hours</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="quiet-hours"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    defaultChecked
                    disabled={!isEditing}
                  />
                  <label htmlFor="quiet-hours" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Enable quiet hours (no notifications)
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">From</label>
                    <select 
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue="20:00"
                      disabled={!isEditing}
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i-12}:00 PM`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">To</label>
                    <select 
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue="08:00"
                      disabled={!isEditing}
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i-12}:00 PM`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={index < 5} // Mon-Fri checked by default
                        disabled={!isEditing}
                      />
                      <div className={`
                        px-2 py-1 text-xs rounded-md cursor-pointer
                        ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}
                        peer-checked:bg-blue-100 peer-checked:text-blue-800 
                        dark:peer-checked:bg-blue-900/30 dark:peer-checked:text-blue-300
                        bg-gray-100 text-gray-800
                        dark:bg-gray-700 dark:text-gray-300
                      `}>
                        {day}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;