'use client';

import React from 'react';

interface StatsSummaryProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  loading?: boolean;
  animationDelay?: string;
  className?: string;
}

export const StatsSummary = ({
  currentPage,
  totalCount,
  pageSize,
  loading = false,
  animationDelay = '700ms',
  className = ''
}: StatsSummaryProps) => {
  if (loading || totalCount === 0) return null;

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div
      className={`text-center opacity-0 animate-slide-up ${className}`}
      style={{ animationDelay }}
    >
      <p className="text-sm text-text-secondary">
        {startIndex}〜{endIndex}件目 / 全{totalCount.toLocaleString()}件
      </p>
    </div>
  );
};
