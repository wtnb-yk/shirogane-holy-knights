'use client';

import React from 'react';
import { Calendar, Play } from 'lucide-react';
import { Performance, StreamSong } from '../types/types';
import { SongCardThumbnail } from './SongCardThumbnail';
import { formatDate, formatDuration } from '../utils/performanceUtils';

interface SongPerformanceListProps {
  performances: Performance[];
  onPerformancePlay?: (song: StreamSong, performance: Performance) => void;
  onClose?: () => void;
  song: StreamSong;
}

export const SongPerformanceList = ({
  performances,
  onPerformancePlay,
  onClose,
  song
}: SongPerformanceListProps) => {
  if (performances.length === 0) {
    return (
      <div>
        <h3 className="text-base sm:text-lg font-bold text-text-inverse mb-2 sm:mb-3">
          パフォーマンス履歴
        </h3>
        <p className="text-text-inverse">パフォーマンス履歴がありません</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-base sm:text-lg font-bold text-text-inverse mb-2 sm:mb-3">
        パフォーマンス履歴 ({performances.length} 回)
      </h3>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {performances.map((performance: Performance, index: number) => (
          <button
            key={index}
            onClick={() => {
              if (onPerformancePlay) {
                onPerformancePlay(song, performance);
              }
              if (onClose) {
                onClose();
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="block w-full text-left border border-surface-border rounded-xl hover:border-accent-gold/50 hover:shadow-lg transition-all duration-card cursor-pointer group bg-bg-secondary hover:bg-bg-tertiary p-4"
          >
            <div className="flex items-start gap-4">
              {/* サムネイル */}
              <SongCardThumbnail
                videoId={performance.videoId || null}
                title={performance.videoTitle}
                size="md"
                aspectRatio="video"
                showOverlay={true}
                variant="playable"
                className="flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
              />

              {/* 配信情報 */}
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
        ))}
      </div>
    </div>
  );
};