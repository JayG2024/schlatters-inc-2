import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, CardContent } from './Card';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  iconColor?: string;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  trend,
  iconColor = 'bg-brand-gold/10 text-brand-gold dark:bg-brand-gold/20 dark:text-brand-gold',
  className,
}) => {
  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return <ArrowUp size={14} className="text-green-500 dark:text-green-400" />;
      case 'down':
        return <ArrowDown size={14} className="text-red-500 dark:text-red-400" />;
      case 'neutral':
        return <Minus size={14} className="text-gray-500 dark:text-gray-400" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend?.direction) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      case 'neutral':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className={cn('hover:shadow-md transition-all duration-200', className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </p>
            {trend && (
              <div className="flex items-center mt-2 text-sm">
                {getTrendIcon()}
                <span className={cn('ml-1 font-medium', getTrendColor())}>
                  {Math.abs(trend.value)}%
                </span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          <div className={cn('p-3 rounded-lg', iconColor)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;