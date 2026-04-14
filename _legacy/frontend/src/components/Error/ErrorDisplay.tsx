'use client';

import React from 'react';
import { Button } from '@/components/Button/Button';
import { ApiError, logApiError } from '@/utils/apiClient';

interface ErrorDisplayProps {
  error: string | ApiError;
  onRetry?: () => void;
  context?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showRetryButton?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  context,
  className = '',
  size = 'md',
  showRetryButton = true
}) => {
  // エラーを正規化
  const errorInfo: ApiError = React.useMemo(() => 
    typeof error === 'string' 
      ? { message: error, type: 'client' }
      : error,
    [error]
  );

  React.useEffect(() => {
    logApiError(errorInfo, context);
  }, [errorInfo, context]);

  const sizeClasses = {
    sm: 'p-4 text-sm',
    md: 'p-6 text-base',
    lg: 'p-8 text-lg'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const getIcon = () => {
    switch (errorInfo.type) {
      case 'offline':
        return (
          <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L5.636 18.364m12.728-12.728L18.364 18.364" />
          </svg>
        );
      case 'network':
      case 'timeout':
        return (
          <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'server':
        return (
          <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getIconColor = () => {
    switch (errorInfo.type) {
      case 'offline':
        return 'text-text-timeout';
      case 'network':
      case 'timeout':
        return 'text-text-warning';
      case 'server':
        return 'text-text-danger';
      default:
        return 'text-text-danger';
    }
  };

  const getBgColor = () => {
    switch (errorInfo.type) {
      case 'offline':
        return 'bg-orange-100';
      case 'network':
      case 'timeout':
        return 'bg-yellow-100';
      case 'server':
        return 'bg-red-100';
      default:
        return 'bg-red-100';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizeClasses[size]} ${className}`}>
      <div className={`rounded-full ${getBgColor()} p-3 mb-4`}>
        <div className={getIconColor()}>
          {getIcon()}
        </div>
      </div>
      
      <h3 className="font-semibold text-text-primary mb-2">
        {errorInfo.type === 'offline' ? 'オフラインです' : 'エラーが発生しました'}
      </h3>
      
      <p className="text-text-secondary mb-4 max-w-md">
        {errorInfo.message}
      </p>

      {showRetryButton && ['network', 'server', 'timeout'].includes(errorInfo.type) && onRetry && (
        <div className="space-y-2">
          <Button onClick={onRetry} size={size === 'sm' ? 'sm' : 'md'}>
            再試行
          </Button>
          
          {errorInfo.type === 'offline' && (
            <p className="text-xs text-text-secondary">
              インターネット接続を確認してから再試行してください
            </p>
          )}
        </div>
      )}

      {!['network', 'server', 'timeout'].includes(errorInfo.type) && (
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          size={size === 'sm' ? 'sm' : 'md'}
        >
          ページを再読み込み
        </Button>
      )}
    </div>
  );
};