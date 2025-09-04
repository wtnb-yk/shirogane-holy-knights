'use client';

import React from 'react';
import { Music, Clock } from 'lucide-react';
import { StreamSong } from '../types/types';
import { YouTubePlayer } from './YouTubePlayer';

interface PlayerSectionProps {
  currentSong: StreamSong | null;
  autoplay?: boolean;
  onStateChange?: (event: any) => void;
}

export const PlayerSection = ({ currentSong, autoplay = false, onStateChange }: PlayerSectionProps) => {
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
    <div className="w-full bg-bg-primary rounded-xl border border-gray-100 shadow-lg p-6">
      {!currentSong && (
        <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mb-4 border border-gray-200">
          <div className="text-center">
            <Music className="w-16 h-16 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium text-lg mb-1">楽曲を選択してください</p>
            <p className="text-gray-500 text-sm">楽曲カードの「再生」をクリック</p>
          </div>
        </div>
      )}

      {currentSong && (
        <>
          <div className="mb-5 rounded-xl overflow-hidden shadow-md">
            <YouTubePlayer
              song={currentSong}
              autoplay={autoplay}
              onStateChange={onStateChange}
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
                {currentSong.title}
              </h2>
              <p className="text-gray-600 text-base mt-1">
                {currentSong.artist}
              </p>
            </div>

            <div className="flex items-center gap-4 p-3 bg-white/70 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-accent-gold/10 rounded-md">
                  <Music className="w-4 h-4 text-accent-gold" />
                </div>
                <span className="text-sm font-medium text-gray-700">{currentSong.performances.length}回歌唱</span>
              </div>
              {currentSong.latestSingDate && (
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-accent-blue/10 rounded-md">
                    <Clock className="w-4 h-4 text-accent-blue" />
                  </div>
                  <span className="text-sm text-gray-600">最新: {formatDate(currentSong.latestSingDate)}</span>
                </div>
              )}
            </div>

            {currentSong.performances[0] && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent-gold" />
                  最新の配信
                </p>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed pl-5">
                  {currentSong.performances[0].videoTitle}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

