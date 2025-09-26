'use client';

import React from 'react';

interface SongPerformanceListHeaderProps {
  count: number;
  variant?: 'default' | 'mobile';
}

export const SongPerformanceListHeader: React.FC<SongPerformanceListHeaderProps> = ({
  count,
  variant = 'default'
}) => {
  const isMobile = variant === 'mobile';
  const headerClassName = isMobile
    ? "text-sm font-semibold text-text-primary mb-3"
    : "text-base sm:text-lg font-bold text-text-inverse mb-2 sm:mb-3";

  return (
    <h3 className={headerClassName}>
      パフォーマンス履歴 ({count} 回)
    </h3>
  );
};