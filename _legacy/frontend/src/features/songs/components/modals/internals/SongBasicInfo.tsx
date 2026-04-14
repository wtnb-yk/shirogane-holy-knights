'use client';

import React from 'react';

interface SongBasicInfoProps {
  title: string;
  artist: string;
  singCount: number;
  latestSingDate: string | null;
}

export const SongBasicInfo = ({
  title,
  artist,
  singCount,
  latestSingDate
}: SongBasicInfoProps) => {
  const formatLatestDate = (dateString: string | null) => {
    if (!dateString) return '未記録';
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex-1">
      <div className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
        {title}
      </div>

      <p className="text-base sm:text-lg text-text-secondary mb-2">
        {artist}
      </p>

      <div className="flex items-center gap-4 text-text-secondary text-sm">
        <span>歌唱回数: <strong>{singCount}回</strong></span>
        {latestSingDate && (
          <span>最新: <strong>{formatLatestDate(latestSingDate)}</strong></span>
        )}
      </div>
    </div>
  );
};
