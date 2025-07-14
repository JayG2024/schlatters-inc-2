import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationDropdown from '../ui/NotificationDropdown';
import SettingsButton from '../ui/SettingsButton';
import { cn } from '../../lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
  className?: string;
  notifications?: any[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDismiss?: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onSearch,
  searchPlaceholder = "Search...",
  className,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss
}) => {
  const { user } = useAuth();
  
  return (
    <div className={cn("flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        {subtitle && <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-3">
        {onSearch && (
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        
        <ThemeToggle />
        
        {notifications && onMarkAsRead && onMarkAllAsRead && onDismiss && (
          <NotificationDropdown
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onDismiss={onDismiss}
          />
        )}
        
        <SettingsButton />
        
        <div className="relative">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium border border-gray-200 dark:border-gray-700">
              {user?.name?.[0] || 'U'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;