'use client';

import React from 'react';

export const SongPerformanceListEmpty: React.FC = () => {
  return (
    <div>
      <h3 className="text-base sm:text-lg font-bold text-text-inverse mb-2 sm:mb-3">
        パフォーマンス履歴
      </h3>
      <p className="text-text-inverse">パフォーマンス履歴がありません</p>
    </div>
  );
};