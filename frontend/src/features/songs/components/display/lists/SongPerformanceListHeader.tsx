'use client';

import React from 'react';

interface SongPerformanceListHeaderProps {
  count: number;
}

export const SongPerformanceListHeader: React.FC<SongPerformanceListHeaderProps> = ({
  count
}) => {
  return (
    <h3 className="text-base sm:text-lg font-bold text-text-inverse mb-2 sm:mb-3">
      パフォーマンス履歴 ({count} 回)
    </h3>
  );
};