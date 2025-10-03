'use client';

import React from 'react';

interface SongPerformanceListHeaderProps {
  count: number;
}

export const SongPerformanceListHeader: React.FC<SongPerformanceListHeaderProps> = ({
  count,
}) => {
  const headerClassName = "text-sm font-semibold text-text-primary mb-3";

  return (
    <h3 className={headerClassName}>
      パフォーマンス履歴 ({count} 回)
    </h3>
  );
};
