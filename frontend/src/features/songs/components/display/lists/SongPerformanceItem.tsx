'use client';

import React, { memo, useCallback } from 'react';
import { Calendar, Play } from 'lucide-react';
import { Performance, StreamSong } from '@/features/songs/types/types';
import { SongCardThumbnail } from '../cards/SongCardThumbnail';
import { formatDate, formatDuration } from "@/features/songs/utils/performanceUtils";

interface SongPerformanceItemProps {
  performance: Performance;
  song: StreamSong;
  onPerformancePlay?: (song: StreamSong, performance: Performance) => void;
  onClose?: () => void;
}

export const SongPerformanceItem = memo<SongPerformanceItemProps>(({
  performance,
  song,
  onPerformancePlay,
  onClose
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

  return (
    <button
      onClick={handleClick}
      className="block w-full text-left border border-surface-border rounded-xl hover:border-accent-gold/50 hover:shadow-lg transition-all duration-card cursor-pointer group bg-bg-secondary hover:bg-bg-tertiary p-4"
      aria-label={`${performance.videoTitle}を再生`}
    >
      <div className="flex items-start gap-4">
        <SongCardThumbnail
          videoId={performance.videoId || null}
          title={performance.videoTitle}
          size="md"
          aspectRatio="video"
          showOverlay={true}
          variant="playable"
          className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
        />

        <div className="flex-1 min-w-0">
          <h4 className="text-gray-900 font-medium text-sm line-clamp-2 mb-2 group-hover:text-accent-gold transition-colors">
            {performance.videoTitle}
          </h4>

          <div className="space-y-1">
            {performance.startSeconds > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Play className="w-3 h-3 text-accent-gold" />
                <span>{formatDuration(performance.startSeconds)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
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
