'use client';

import React from 'react';

interface DiscographyStatsSummaryProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  loading: boolean;
}

export const DiscographyStatsSummary = ({
  currentPage,
  totalCount,
  pageSize,
  loading
}: DiscographyStatsSummaryProps) => {
  if (loading || totalCount === 0) return null;

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="text-center mt-8 opacity-0 animate-slide-up" style={{ animationDelay: '700ms' }}>
      <p className="text-sm text-text-secondary">
        {startIndex}〜{endIndex}件目 / 全{totalCount.toLocaleString()}件のアルバム
      </p>
    </div>
  );
};