'use client';

import React from 'react';
import { Calendar, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { StreamSong, Performance } from '../types/types';
import { SongCardThumbnail } from './SongCardThumbnail';

interface PerformanceListModalProps {
  song: StreamSong | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPerformancePlay?: (song: StreamSong, performance: Performance) => void;
}

export const PerformanceListModal = ({ song, open, onOpenChange, onPerformancePlay }: PerformanceListModalProps) => {
  if (!song) return null;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '日時不明';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 leading-tight">
            <div className="space-y-1">
              <div className="text-xl font-bold">{song.title}</div>
              <div className="text-base font-medium text-gray-600">{song.artist}</div>
            </div>
          </DialogTitle>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>
        
        <div className="p-6 pt-0">
          {/* 楽曲統計 */}
          <div className="mb-6 p-4 bg-bg-secondary rounded-lg">
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
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {song.performances.map((performance: Performance, index: number) => (
              <button
                key={index}
                onClick={() => {
                  if (onPerformancePlay) {
                    onPerformancePlay(song, performance);
                  }
                  onOpenChange(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="block w-full text-left border border-gray-200 rounded-xl p-4 hover:bg-gray-50 hover:border-accent-gold/50 transition-all duration-200 cursor-pointer group hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {/* サムネイル */}
                  <SongCardThumbnail
                    videoId={performance.videoId || null}
                    title={performance.videoTitle}
                    size="md"
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
                          <span>{formatDuration(performance.startSeconds)}から開始</span>
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
      </DialogContent>
    </Dialog>
  );
};