'use client';

import React, { useCallback } from 'react';
import { Performance, StreamSong } from '@/features/songs/types/types';
import { SongPerformanceListHeader } from './SongPerformanceListHeader';
import { SongPerformanceListEmpty } from './SongPerformanceListEmpty';
import { SongPerformanceItem } from './internals/SongPerformanceItem';

interface SongPerformanceListProps {
  performances: Performance[];
  onPerformancePlay?: (song: StreamSong, performance: Performance) => void;
  onClose?: () => void;
  song: StreamSong;
  variant?: 'default' | 'mobile';
}

export const SongPerformanceList: React.FC<SongPerformanceListProps> = ({
  performances,
  onPerformancePlay,
  onClose,
  song,
  variant = 'default'
}) => {
  const handlePerformancePlay = useCallback(
    (song: StreamSong, performance: Performance) => {
      if (onPerformancePlay) {
        onPerformancePlay(song, performance);
      }
    },
    [onPerformancePlay]
  );

  if (performances.length === 0) {
    return <SongPerformanceListEmpty />;
  }

  const isMobile = variant === 'mobile';
  const scrollClassName = isMobile
    ? "space-y-2 max-h-none"
    : "space-y-4 max-h-96 overflow-y-auto";

  return (
    <div>
      <SongPerformanceListHeader count={performances.length} />

      <div className={scrollClassName} role="list">
        {performances.map((performance, index) => (
          <SongPerformanceItem
            key={`${performance.videoId}-${index}`}
            performance={performance}
            song={song}
            onPerformancePlay={handlePerformancePlay}
            onClose={onClose}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
};
