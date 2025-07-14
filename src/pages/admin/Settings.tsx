import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  Settings as SettingsIcon,
  Users,
  Bell,
  Building,
  Zap,
  UserPlus,
  Mail,
  Shield,
  Lock,
  Globe,
  Palette,
  Save,
  X,
  Check,
  Edit,
  Trash,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

// Import sub-pages
import UserManagement from './Settings/UserManagement';
import Integrations from './Settings/Integrations';
import Notifications from './Settings/Notifications';
import CompanySettings from './Settings/CompanySettings';

const SettingsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMainPage = location.pathname === '/admin/settings';

  const settingsCategories = [
    { 
      id: 'users', 
      name: 'User Management', 
      icon: <Users size={20} className="text-blue-600 dark:text-blue-400" />,
      description: 'Manage user accounts, roles, and permissions',
      path: '/admin/settings/users'
    },
    { 
      id: 'integrations', 
      name: 'Integrations', 
      icon: <Zap size={20} className="text-purple-600 dark:text-purple-400" />,
      description: 'Connect with third-party services and APIs',
      path: '/admin/settings/integrations'
    },
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: <Bell size={20} className="text-amber-600 dark:text-amber-400" />,
      description: 'Configure notification preferences and alerts',
      path: '/admin/settings/notifications'
    },
    { 
      id: 'company', 
      name: 'Company Settings', 
      icon: <Building size={20} className="text-green-600 dark:text-green-400" />,
      description: 'Manage company information and branding',
      path: '/admin/settings/company'
    },
    { 
      id: 'security', 
      name: 'Security', 
      icon: <Shield size={20} className="text-red-600 dark:text-red-400" />,
      description: 'Security settings and access controls',
      path: '/admin/settings/security'
    },
    { 
      id: 'appearance', 
      name: 'Appearance', 
      icon: <Palette size={20} className="text-indigo-600 dark:text-indigo-400" />,
      description: 'Customize the look and feel of your dashboard',
      path: '/admin/settings/appearance'
    },
  ];

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Configure your system preferences and integrations</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search settings..."
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settingsCategories.map((category) => (
                <Card 
                  key={category.id} 
                  className="bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">{category.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-between text-blue-600 dark:text-blue-400"
                      onClick={() => navigate(category.path)}
                    >
                      Configure
                      <SettingsIcon size={16} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle size={20} className="text-blue-600 dark:text-blue-400" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">System Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Version:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">2.5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Environment:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Production</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Integration Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">QuickBooks:</span>
                        <Badge variant="success">Connected</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">OpenPhone:</span>
                        <Badge variant="success">Connected</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Gmail:</span>
                        <Badge variant="warning">Setup Required</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        } 
      />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/integrations" element={<Integrations />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/company" element={<CompanySettings />} />
      <Route path="*" element={
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings Page Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">The settings page you're looking for does not exist or is still in development.</p>
            <Button onClick={() => navigate('/admin/settings')}>
              Back to Settings
            </Button>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default SettingsPage;