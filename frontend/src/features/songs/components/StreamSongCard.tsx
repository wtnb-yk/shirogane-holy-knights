'use client';

import React from 'react';
import { Music, Calendar, Clock, Play, Info } from 'lucide-react';
import { StreamSong } from '../types/types';
import { CardContent } from '@/components/ui/card';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { SongCardThumbnail } from './SongCardThumbnail';

interface StreamSongCardProps {
  song: StreamSong;
  index?: number;
  onClick: (song: StreamSong) => void;
  onPlayClick?: (song: StreamSong) => void;
}

const StreamSongCardComponent = ({ song, index = 0, onClick, onPlayClick }: StreamSongCardProps) => {
  

  // 最新のパフォーマンスを取得（最初の1件のみ表示）
  const latestPerformance = song.performances[0];
  
  // 日付フォーマット関数
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
    <>
      <StaggeredItem index={index} className="group">
        <div
          className="song-card-hover rounded-lg overflow-hidden h-full bg-bg-primary border border-surface-border hover:border-accent-gold/50 hover:shadow-lg transition-all duration-card transform hover:scale-[1.02] hover:bg-bg-hover"
        >
        <CardContent className="p-4 md:p-5 h-full flex flex-col">
          {/* ヘッダー部分 */}
          <div className="flex items-start space-x-3 mb-3">
            <SongCardThumbnail
              videoId={latestPerformance?.videoId || null}
              title={song.title}
              size="md"
              showPlayButton={true}
              className="flex-shrink-0 group-hover:scale-105 transition-transform duration-ui"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-text-primary font-semibold text-sm md:text-base line-clamp-2 group-hover:text-accent-gold transition-colors duration-ui">
                {song.title}
              </h3>
              <p className="text-text-secondary text-xs md:text-sm line-clamp-1 mb-2">
                {song.artist}
              </p>
              
              {/* 統計情報 */}
              <div className="flex flex-col space-y-1 text-xs text-text-tertiary">
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <Music className="w-3 h-3 flex-shrink-0" />
                  <span>{song.performances.length}回</span>
                </div>
                {song.latestSingDate && (
                  <div className="flex items-center space-x-1 whitespace-nowrap">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span>{formatDate(song.latestSingDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 最新パフォーマンス情報 */}
          {latestPerformance && (
            <div className="mt-auto pt-2 border-t border-surface-border">
              <div className="flex items-center space-x-1 mb-2">
                <Clock className="w-3 h-3 text-text-tertiary" />
                <span className="text-xs text-text-tertiary">最新</span>
              </div>
              <p className="text-text-secondary text-xs line-clamp-2 mb-3">
                {latestPerformance.videoTitle}
              </p>
              
              {/* アクションボタン */}
              <div className="flex items-center gap-2">
                {onPlayClick && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayClick(song);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-accent-gold text-white rounded hover:bg-accent-gold-hover transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    再生
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(song);
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-surface-secondary text-text-primary rounded hover:bg-surface-hover transition-colors"
                >
                  <Info className="w-3 h-3" />
                  詳細
                </button>
              </div>
            </div>
          )}
        </CardContent>
        </div>
      </StaggeredItem>
    </>
  );
};

export const StreamSongCard = React.memo(StreamSongCardComponent);
