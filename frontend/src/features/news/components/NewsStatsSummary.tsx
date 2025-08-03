'use client';

import React from 'react';

interface NewsStatsSummaryProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  loading: boolean;
}

export const NewsStatsSummary = ({
  currentPage,
  totalCount,
  pageSize,
  loading
}: NewsStatsSummaryProps) => {
  if (loading || totalCount === 0) return null;

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="text-center mt-8 opacity-0 animate-slide-up" style={{ animationDelay: '700ms' }}>
      <p className="text-sm text-sage-300">
        {startIndex}〜{endIndex}件目 / 全{totalCount.toLocaleString()}件のニュース
      </p>
    </div>
  );
};