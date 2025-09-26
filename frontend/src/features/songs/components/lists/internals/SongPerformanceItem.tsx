'use client';

import React, { memo, useCallback } from 'react';
import { Calendar, Play } from 'lucide-react';
import { Performance, StreamSong } from '@/features/songs/types/types';
import { SongCardThumbnail } from '../../cards/internals/SongCardThumbnail';
import { formatDate, formatDuration } from "@/features/songs/utils/performanceUtils";

interface SongPerformanceItemProps {
  performance: Performance;
  song: StreamSong;
  onPerformancePlay?: (song: StreamSong, performance: Performance) => void;
  onClose?: () => void;
  variant?: 'default' | 'mobile';
}

export const SongPerformanceItem = memo<SongPerformanceItemProps>(({
  performance,
  song,
  onPerformancePlay,
  onClose,
  variant = 'default'
}) => {
  const handleClick = useCallback(() => {
    if (onPerformancePlay) {
      onPerformancePlay(song, performance);
    }
    if (onClose) {
      onClose();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [song, performance, onPerformancePlay, onClose]);

  const isMobile = variant === 'mobile';

  // モバイル版のスタイル
  const containerClassName = isMobile
    ? "block w-full text-left border border-surface-border rounded-lg hover:border-accent-gold/50 hover:shadow-md transition-all duration-200 cursor-pointer group bg-bg-primary hover:bg-bg-secondary p-3"
    : "block w-full text-left border border-surface-border rounded-xl hover:border-accent-gold/50 hover:shadow-lg transition-all duration-card cursor-pointer group bg-bg-secondary hover:bg-bg-tertiary p-4";

  const flexGap = isMobile ? "gap-3" : "gap-4";
  const thumbnailSize = isMobile ? "sm" : "md";

  return (
    <button
      onClick={handleClick}
      className={containerClassName}
      aria-label={`${performance.videoTitle}を再生`}
    >
      <div className={`flex items-start ${flexGap}`}>
        <SongCardThumbnail
          videoId={performance.videoId || null}
          title={performance.videoTitle}
          size={thumbnailSize}
          aspectRatio="video"
          showOverlay={true}
          variant="playable"
          className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
        />

        <div className="flex-1 min-w-0">
          <h4 className={`text-text-primary font-medium line-clamp-2 mb-2 group-hover:text-accent-gold transition-colors ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {performance.videoTitle}
          </h4>

          <div className="space-y-1">
            {performance.startSeconds > 0 && (
              <div className="flex items-center gap-1.5 text-text-tertiary text-xs">
                <Play className="w-3 h-3 text-accent-gold" />
                <span>{formatDuration(performance.startSeconds)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-text-tertiary text-xs">
              <Calendar className="w-3 h-3 text-accent-blue" />
              <span>{formatDate(performance.performedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
});

SongPerformanceItem.displayName = 'SongPerformanceItem';
