import React, { useRef, useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { 
  ChevronDown, 
  ChevronRight,
  LayoutDashboard,
  Users,
  Phone,
  CreditCard,
  Clock,
  Calendar as CalendarIcon,
  BarChart,
  FileText,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Tag,
  Clock as ClockIcon,
  CreditCard as CreditCardIcon,
  FileText as FileTextIcon,
  Shield,
  Building,
  Zap,
  UserCog,
  Bell,
  MessageSquare,
  TrendingUp,
  PhoneCall,
  Headphones,
  Timer,
  BookOpen,
  Target,
  PieChart
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
  children?: { to: string; label: string; icon?: React.ReactNode }[];
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  label,
  exact = false,
  children,
}) => {
  const { pathname } = useLocation();
  const isActive = exact ? pathname === to : pathname.startsWith(to);
  const [expanded, setExpanded] = useState(isActive);

  const handleToggle = (e: React.MouseEvent) => {
    if (children) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  return (
    <div>
      <NavLink
        to={children ? '#' : to}
        onClick={handleToggle}
        className={({ isActive: linkActive }) =>
          cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-all duration-200',
            'hover:bg-gray-100 dark:hover:bg-gray-700',
            (linkActive || isActive) && !children
              ? 'bg-brand-gold/10 dark:bg-brand-gold/20 text-brand-navy dark:text-brand-gold border-l-4 border-brand-gold'
              : 'text-gray-700 dark:text-gray-300'
          )
        }
        end={exact}
      >
        <span className="flex-shrink-0 w-5 h-5">{icon}</span>
        <span className="flex-grow">{label}</span>
        {children && (
          <span className="ml-auto transition-transform duration-200">
            {expanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </span>
        )}
      </NavLink>

      {children && expanded && (
        <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
          {children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                  'hover:bg-gray-100 dark:hover:bg-gray-700',
                  isActive
                    ? 'bg-brand-gold/10 dark:bg-brand-gold/20 text-brand-navy dark:text-brand-gold'
                    : 'text-gray-600 dark:text-gray-400'
                )
              }
            >
              {child.icon && <span className="w-4 h-4">{child.icon}</span>}
              <span>{child.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  type: 'admin' | 'client';
}

export const Sidebar: React.FC<SidebarProps> = ({ type }) => {
  const { user, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const adminLinks: SidebarLinkProps[] = [
    {
      to: '/admin',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard Summary',
      exact: true,
    },
    {
      to: '/admin',
      icon: <PieChart size={20} />,
      label: 'Dashboards',
      children: [
        { to: '/admin', label: 'Summary Overview', icon: <LayoutDashboard size={16} /> },
        { to: '/admin/subscriptions-detail', label: 'Subscriptions Detail', icon: <Shield size={16} /> },
        { to: '/admin/support-logs', label: 'Support Logs', icon: <PhoneCall size={16} /> },
        { to: '/admin/invoices-aging', label: 'Invoices & Aging', icon: <FileText size={16} /> },
        { to: '/admin/reminders-renewals', label: 'Reminders & Renewals', icon: <Bell size={16} /> },
      ],
    },
    {
      to: '/admin/clients',
      icon: <Users size={20} />,
      label: 'Customers',
    },
    {
      to: '/admin/communications',
      icon: <PhoneCall size={20} />,
      label: 'Support Calls',
      children: [
        { to: '/admin/communications', label: 'Live Call Queue', icon: <Phone size={16} /> },
        { to: '/admin/communications/history', label: 'Call History', icon: <Clock size={16} /> },
        { to: '/admin/communications/transcripts', label: 'Transcripts', icon: <FileText size={16} /> },
      ],
    },
    {
      to: '/admin/billing',
      icon: <CreditCard size={20} />,
      label: 'Billing',
      children: [
        { to: '/admin/billing/subscriptions', label: 'Subscriptions', icon: <CreditCardIcon size={16} /> },
        { to: '/admin/billing', label: 'Call Charges', icon: <Phone size={16} /> },
        { to: '/admin/billing/quickbooks', label: 'QuickBooks Sync', icon: <Zap size={16} /> },
      ],
    },
    {
      to: '/admin/time-tracking',
      icon: <Timer size={20} />,
      label: 'Support Hours',
      children: [
        { to: '/admin/time-tracking', label: 'Usage Dashboard', icon: <PieChart size={16} /> },
        { to: '/admin/time-tracking/logs', label: 'Call Logs', icon: <BookOpen size={16} /> },
        { to: '/admin/time-tracking/billable', label: 'Billable Summary', icon: <CreditCardIcon size={16} /> },
      ],
    },
    {
      to: '/admin/calendar',
      icon: <CalendarIcon size={20} />,
      label: 'Availability',
    },
    {
      to: '/admin/reports',
      icon: <BarChart size={20} />,
      label: 'Reports',
    },
    {
      to: '/admin/documents',
      icon: <BookOpen size={20} />,
      label: 'Documents',
    },
    {
      to: '/admin/settings',
      icon: <SettingsIcon size={20} />,
      label: 'Settings',
    },
    {
      to: '/admin/debug',
      icon: <HelpCircle size={20} />,
      label: 'Debug',
    },
  ];

  const clientLinks: SidebarLinkProps[] = [
    {
      to: '/client',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      exact: true,
    },
    {
      to: '/client/subscription',
      icon: <Shield size={20} />,
      label: 'My Subscription',
    },
    {
      to: '/client/usage',
      icon: <Timer size={20} />,
      label: 'Support Usage',
    },
    {
      to: '/client/invoices',
      icon: <CreditCard size={20} />,
      label: 'Billing & Invoices',
    },
    {
      to: '/client/calls',
      icon: <PhoneCall size={20} />,
      label: 'Call History',
    },
    {
      to: '/client/support',
      icon: <Headphones size={20} />,
      label: 'Get Support',
    },
  ];

  const links = type === 'admin' ? adminLinks : clientLinks;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
        onClick={toggleMobileSidebar}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          'fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out',
          'flex flex-col shadow-lg',
          isCollapsed ? 'w-16' : 'w-64',
          !isMobileOpen && 'hidden lg:flex',
          isMobileOpen && 'flex'
        )}
      >
        {/* Logo area */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-brand-navy',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}>
          <Link to={type === 'admin' ? '/admin' : '/client'} className="flex items-center">
            <div className="rounded-lg bg-brand-gold text-brand-navy w-8 h-8 flex items-center justify-center font-bold text-lg">
              S
            </div>
            {!isCollapsed && (
              <span className="ml-3 text-lg font-semibold text-brand-gold">
                Schlatter's Inc.
              </span>
            )}
          </Link>
          
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:block p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          {links.map((link) => (
            <SidebarLink key={link.to} {...link} />
          ))}
        </nav>

        {/* User area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          {!isCollapsed ? (
            <div className="flex items-center">
              {false ? (
                <img
                  src=""
                  alt={user?.email || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-gold/20 dark:bg-brand-gold/30 text-brand-gold-dark dark:text-brand-gold flex items-center justify-center font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={signOut}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              {false ? (
                <img
                  src=""
                  alt={user?.email || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-gold/20 dark:bg-brand-gold/30 text-brand-gold-dark dark:text-brand-gold flex items-center justify-center font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <button
                onClick={signOut}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;