'use client';

import React from 'react';

interface StatsSummaryProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  loading: boolean;
}

export const StatsSummary = ({
  currentPage,
  totalCount,
  pageSize = 20,
  loading
}: StatsSummaryProps) => {
  if (totalCount === 0 || loading) return null;

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div 
      className="text-center text-sm text-shirogane-text-secondary mt-6 opacity-0 animate-fade-in" 
      style={{ animationDelay: '600ms' }}
    >
      {startIndex} - {endIndex} / {totalCount} 件
    </div>
  );
};