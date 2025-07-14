import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const variantStyles = {
  default: 'bg-brand-gold dark:bg-brand-gold',
  success: 'bg-green-600 dark:bg-green-500',
  warning: 'bg-amber-500 dark:bg-amber-500',
  danger: 'bg-red-600 dark:bg-red-500',
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  variant = 'default',
  className,
}) => {
  // Ensure the value is between 0 and max
  const normalizedValue = Math.max(0, Math.min(value, max));
  const percentage = (normalizedValue / max) * 100;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-primary-700 dark:text-primary-300">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-primary-200 dark:bg-gray-700 rounded-full overflow-hidden',
          sizeStyles[size],
          className
        )}
      >
        <div
          className={cn(
            'rounded-full transition-all duration-300 ease-in-out',
            variantStyles[variant],
            sizeStyles[size]
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={normalizedValue}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default Progress;