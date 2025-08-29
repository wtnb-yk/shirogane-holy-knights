'use client';

import React from 'react';
import { ExternalLink, Calendar, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { StreamSong, Performance } from '../types/types';

interface PerformanceListModalProps {
  song: StreamSong | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PerformanceListModal = ({ song, open, onOpenChange }: PerformanceListModalProps) => {
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
          <DialogTitle>
            {song.title} - {song.artist}
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
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {song.performances.map((performance: Performance, index: number) => (
              <a 
                key={index} 
                href={performance.streamSongUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-border-primary rounded-lg p-4 hover:bg-bg-secondary hover:border-accent-gold/50 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-text-primary font-medium text-sm line-clamp-2 mb-1">
                      {performance.videoTitle}
                    </h4>
                    {performance.startSeconds > 0 && (
                      <div className="flex items-center gap-1 text-xs text-text-primary mb-2">
                        <Play className="w-3 h-3" />
                        <span>{formatDuration(performance.startSeconds)}から開始</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-text-primary">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(performance.performedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="ml-3 flex items-center">
                    <ExternalLink className="w-4 h-4 text-text-secondary group-hover:text-accent-gold transition-colors" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
