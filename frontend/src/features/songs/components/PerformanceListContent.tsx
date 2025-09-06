'use client';

import React from 'react';
import { Calendar, Play } from 'lucide-react';
import { StreamSong, Performance } from '../types/types';
import { SongCardThumbnail } from './SongCardThumbnail';
import { formatDate, formatDuration } from '../utils/performanceUtils';

interface PerformanceListContentProps {
  song: StreamSong;
  onPerformancePlay?: (song: StreamSong, performance: Performance) => void;
  onClose: () => void;
  isMobile?: boolean;
}

export const PerformanceListContent = ({ 
  song, 
  onPerformancePlay, 
  onClose,
  isMobile = false
}: PerformanceListContentProps) => {
  return (
    <div className={isMobile ? "px-4 pt-4 pb-8" : "p-6 pt-0"}>
      {/* 楽曲統計 */}
      <div className={`bg-bg-secondary rounded-lg p-4 ${isMobile ? 'mb-4' : 'mb-6'}`}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-primary">総歌唱回数</span>
          <span className="text-text-primary font-semibold">{song.performances.length}回</span>
        </div>
        {song.latestSingDate && (
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-text-primary">最新歌唱</span>
            <span className="text-text-primary">{formatDate(song.latestSingDate)}</span>
          </div>
        )}
      </div>

      {/* パフォーマンス一覧 */}
      <div className={`space-y-${isMobile ? '3' : '4'} ${isMobile ? 'pb-4' : ''} ${!isMobile ? 'max-h-96 overflow-y-auto' : ''}`}>
        {song.performances.map((performance: Performance, index: number) => (
          <button
            key={index}
            onClick={() => {
              if (onPerformancePlay) {
                onPerformancePlay(song, performance);
              }
              onClose();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`block w-full text-left border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-accent-gold/50 transition-all duration-200 cursor-pointer group hover:shadow-md ${isMobile ? 'p-3' : 'p-4'}`}
          >
            <div className={`flex items-start ${isMobile ? 'gap-3' : 'gap-4'}`}>
              {/* サムネイル */}
              <SongCardThumbnail
                videoId={performance.videoId || null}
                title={performance.videoTitle}
                size={isMobile ? "sm" : "md"}
                aspectRatio="video"
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
              
              {/* 再生アイコン */}
              <div className="flex items-center">
                <Play className="w-4 h-4 text-gray-400 group-hover:text-accent-gold transition-colors fill-current" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};