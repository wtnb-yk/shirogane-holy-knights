'use client';

import React from 'react';
import { Skeleton } from '@/components/Loading/skeleton';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'pulse' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
  rows?: number; // skeleton用
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  size = 'md',
  message,
  className = '',
  rows = 3
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const spinnerSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (type === 'skeleton') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`bg-primary rounded-full animate-bounce ${
                size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
        {message && (
          <span className={`ml-3 text-text-secondary ${sizeClasses[size]}`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary ${spinnerSizes[size]}`} />
      {message && (
        <span className={`mt-3 text-text-secondary ${sizeClasses[size]}`}>
          {message}
        </span>
      )}
    </div>
  );
};

// 特定用途向けのローディングコンポーネント
export const PageLoadingState: React.FC<{ message?: string }> = ({ 
  message = '読み込み中...' 
}) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingState type="spinner" size="lg" message={message} />
  </div>
);

export const InlineLoadingState: React.FC<{ message?: string }> = ({ 
  message = '読み込み中...' 
}) => (
  <div className="flex items-center justify-center py-8">
    <LoadingState type="dots" size="sm" message={message} />
  </div>
);

export const CardLoadingState: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="p-4 border rounded-lg">
    <LoadingState type="skeleton" rows={rows} />
  </div>
);