'use client';

import React from 'react';
import { Music, Calendar } from 'lucide-react';
import { StreamSong } from "@/features/songs/types/types";
import { formatDateOnly } from '@/features/songs/utils/performanceUtils';

interface StreamSongStatsProps {
  song: StreamSong;
}

export const StreamSongStats = ({ song }: StreamSongStatsProps) => {
  return (
    <div className="flex flex-row sm:flex-col gap-2 sm:gap-2 text-xs sm:text-sm text-text-tertiary">
      <div className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
        <Music className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        <span className="font-medium">{song.performances.length}回</span>
      </div>
      {song.latestSingDate && (
        <div className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span>{formatDateOnly(song.latestSingDate)}</span>
        </div>
      )}
    </div>
  );
};