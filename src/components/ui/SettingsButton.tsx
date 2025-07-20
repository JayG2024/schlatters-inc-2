import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, X, Search, User, Lock, Bell, Globe, Brush, Volume2, MousePointer, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/SupabaseAuthContext';

interface SettingsButtonProps {
  className?: string;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenSettings = (section?: string) => {
    navigate('/admin/settings');
    setIsOpen(false);
  };

  const settingsCategories = [
    { id: 'account', name: 'Account', icon: <User size={18} /> },
    { id: 'security', name: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'appearance', name: 'Appearance', icon: <Brush size={18} /> },
    { id: 'language', name: 'Language & Region', icon: <Globe size={18} /> },
    { id: 'tts', name: 'Text-to-Speech', icon: <Volume2 size={18} /> },
    { id: 'accessibility', name: 'Accessibility', icon: <MousePointer size={18} /> },
  ];

  const filteredCategories = searchTerm
    ? settingsCategories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : settingsCategories;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
          className
        )}
        aria-label="Settings"
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-scale-in"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search settings..."
                className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                className="flex items-center gap-3 w-full p-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleOpenSettings(category.id)}
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                  {category.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{category.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Configure {category.name.toLowerCase()} settings</div>
                </div>
              </button>
            ))}

            {filteredCategories.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No settings match your search
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
                  {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                </div>
                <span className="text-sm text-gray-900 dark:text-gray-100">Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <button
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => window.open('https://support.example.com', '_blank')}
            >
              <HelpCircle size={16} className="text-gray-600 dark:text-gray-300" />
              <span className="text-sm text-gray-900 dark:text-gray-100">Help & Support</span>
            </button>

            <button
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
              onClick={signOut}
            >
              <LogOut size={16} />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
            <button
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors"
              onClick={() => handleOpenSettings()}
            >
              All Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsButton;