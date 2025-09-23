import React from 'react';

interface SongStatsSummaryProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  loading?: boolean;
}

export function SongStatsSummary({ 
  currentPage, 
  totalCount, 
  pageSize, 
  loading = false 
}: SongStatsSummaryProps) {
  if (loading || totalCount === 0) {
    return null;
  }

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalCount);

  return (
    <div className="mt-8 opacity-0 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="text-center text-text-secondary text-sm">
        {totalCount.toLocaleString()}件中 {startItem.toLocaleString()}〜{endItem.toLocaleString()}件目を表示
      </div>
    </div>
  );
}