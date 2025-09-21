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
      <h2 className="text-xl sm:text-2xl font-bold text-text-inverse mb-2">
        {title}
      </h2>

      <p className="text-base sm:text-lg text-text-inverse mb-3 sm:mb-4">
        {artist}
      </p>

      <div className="flex items-center gap-4 text-text-inverse text-sm">
        <span>歌唱回数: <strong>{singCount}回</strong></span>
        {latestSingDate && (
          <span>最新: <strong>{formatLatestDate(latestSingDate)}</strong></span>
        )}
      </div>
    </div>
  );
};