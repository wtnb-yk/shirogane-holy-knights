'use client';

import React from 'react';
import { Music, Clock } from 'lucide-react';
import { StreamSong } from '../types/types';
import { YouTubePlayer } from './YouTubePlayer';

interface PlayerSectionProps {
  currentSong: StreamSong | null;
  onStateChange?: (event: any) => void;
}

export const PlayerSection = ({ currentSong, onStateChange }: PlayerSectionProps) => {
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

  if (!currentSong) {
    return (
      <div className="w-full bg-bg-primary rounded-lg border border-surface-border p-6">
        <div className="aspect-video bg-bg-secondary rounded-lg flex items-center justify-center mb-4">
          <div className="text-center">
            <Music className="w-12 h-12 text-text-tertiary mx-auto mb-2" />
            <p className="text-text-secondary">楽曲を選択してください</p>
            <p className="text-text-tertiary text-sm">楽曲カードをクリックして再生</p>
          </div>
        </div>
      </div>
    );
  }

  const latestPerformance = currentSong.performances[0];

  return (
    <div className="w-full bg-bg-primary rounded-lg border border-surface-border p-6">
      {/* YouTube プレイヤー */}
      <div className="mb-4">
        <YouTubePlayer
          song={currentSong}
          onStateChange={onStateChange}
        />
      </div>

      {/* 楽曲情報 */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-text-primary line-clamp-2">
            {currentSong.title}
          </h2>
          <p className="text-text-secondary text-sm">
            {currentSong.artist}
          </p>
        </div>

        {/* 統計情報 */}
        <div className="flex items-center gap-4 text-xs text-text-tertiary">
          <div className="flex items-center gap-1">
            <Music className="w-3 h-3" />
            <span>{currentSong.performances.length}回歌唱</span>
          </div>
          {currentSong.latestSingDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>最新: {formatDate(currentSong.latestSingDate)}</span>
            </div>
          )}
        </div>

        {/* 最新パフォーマンス情報 */}
        {latestPerformance && (
          <div className="pt-3 border-t border-surface-border">
            <p className="text-text-primary text-sm font-medium mb-1">
              最新の配信
            </p>
            <p className="text-text-secondary text-xs line-clamp-2">
              {latestPerformance.videoTitle}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
