'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { Performance, StreamSong } from "@/features/songs/types/types";

interface StreamSongInfoProps {
  song: StreamSong;
  latestPerformance: Performance | undefined;
}

export const StreamSongInfo = ({ song, latestPerformance }: StreamSongInfoProps) => {
  return (
    <div className="min-w-0 flex-1">
      <h3 className="text-text-primary font-semibold text-sm sm:text-lg mb-1 line-clamp-1 group-hover:text-accent-gold transition-colors duration-ui">
        {song.title}
      </h3>
      <p className="text-text-secondary text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-1">
        {song.artist}
      </p>

      {/* 最新パフォーマンス情報 */}
      {latestPerformance && (
        <div className="mb-2 sm:mb-3">
          <div className="flex items-center space-x-1 mb-1">
            <Clock className="w-3 h-3 text-text-tertiary" />
            <span className="text-xs text-text-tertiary">最新</span>
          </div>
          <p className="text-text-secondary text-xs sm:text-sm line-clamp-2">
            {latestPerformance.videoTitle}
          </p>
        </div>
      )}
    </div>
  );
};
