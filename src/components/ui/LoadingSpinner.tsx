import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10'
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className,
  fullScreen = false
}) => {
  const spinner = (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center">
        <Loader className={cn(
          'animate-spin text-blue-600 dark:text-blue-400',
          sizeClasses[size]
        )} />
        {text && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;