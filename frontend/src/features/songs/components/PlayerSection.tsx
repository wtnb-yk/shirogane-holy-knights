'use client';

import React from 'react';
import { Music, Clock } from 'lucide-react';
import { StreamSong, Performance } from '../types/types';
import { YouTubePlayer } from './YouTubePlayer';

interface PlayerSectionProps {
  currentSong: StreamSong | null;
  currentPerformance: Performance | null;
  autoplay?: boolean;
  onStateChange?: (event: any) => void;
}

export const PlayerSection = ({ currentSong, currentPerformance, autoplay = false, onStateChange }: PlayerSectionProps) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '歌唱日不明';
    try {
      return new Date(dateStr).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '歌唱日不明';
    }
  };

  return (
    <div className="w-full bg-bg-primary rounded-xl border border-gray-100 shadow-lg">
      {!currentSong && (
        <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
          <div className="text-center">
            <Music className="w-16 h-16 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium text-lg mb-1">楽曲を選択してください</p>
            <p className="text-gray-500 text-sm">楽曲カードの「再生」をクリック</p>
          </div>
        </div>
      )}

      {currentSong && (
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-6 p-2 lg:p-6">
          <div className="w-full lg:w-3/4 rounded-lg lg:rounded-xl overflow-hidden shadow-md">
            <YouTubePlayer
              song={currentSong}
              performance={currentPerformance}
              autoplay={autoplay}
              onStateChange={onStateChange}
            />
          </div>
          
          <div className="w-full lg:w-1/4 flex flex-col justify-center space-y-2 lg:space-y-4 px-2 lg:pl-4">
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 line-clamp-1 lg:line-clamp-2 leading-tight">
                {currentSong.title}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base mt-1">
                {currentSong.artist}
              </p>
            </div>

            {(currentPerformance?.performedAt || currentSong.latestSingDate) && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-accent-blue/10 rounded-md">
                  <Clock className="w-4 h-4 text-accent-blue" />
                </div>
                <span className="text-sm text-gray-600">
                  {currentPerformance ? '歌唱日' : '最新'}: {formatDate(currentPerformance?.performedAt || currentSong.latestSingDate)}
                </span>
              </div>
            )}

            {currentPerformance && (
              <div className="pt-2 lg:pt-3 border-t border-gray-200">
                <p className="text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent-gold" />
                  選択中の配信
                </p>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  {currentPerformance.videoTitle}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

