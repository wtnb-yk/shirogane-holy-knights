'use client';

import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  if (isOnline && !isSlowConnection) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${
      !isOnline 
        ? 'bg-red-600 text-white' 
        : 'bg-yellow-600 text-white'
    } px-4 py-2 text-center text-sm font-medium`}>
      <div className="flex items-center justify-center space-x-2">
        {!isOnline ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L5.636 18.364m12.728-12.728L18.364 18.364" />
            </svg>
            <span>オフラインです - インターネット接続を確認してください</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>接続が不安定です - 読み込みに時間がかかる場合があります</span>
          </>
        )}
      </div>
    </div>
  );
};