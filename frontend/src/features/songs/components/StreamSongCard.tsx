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
          className="rounded-xl overflow-hidden h-full bg-bg-primary border border-gray-100 hover:border-accent-gold/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
        <CardContent className="p-4 md:p-5 h-full flex flex-col">
          {/* ヘッダー部分 */}
          <div className="flex items-start space-x-3 mb-3">
            <SongCardThumbnail
              videoId={latestPerformance?.videoId || null}
              title={song.title}
              size="md"
              showPlayButton={true}
              className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-lg rounded-lg overflow-hidden"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-gray-900 font-bold text-base md:text-lg line-clamp-2 group-hover:text-accent-gold transition-colors duration-200 leading-tight mb-1">
                {song.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base line-clamp-1 mb-3">
                {song.artist}
              </p>
              
              {/* 統計情報 */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-1.5 text-sm">
                  <Music className="w-4 h-4 text-accent-gold" />
                  <span className="text-gray-700 font-medium">{song.performances.length}回</span>
                </div>
                {song.latestSingDate && (
                  <div className="flex items-center space-x-1.5 text-sm">
                    <Calendar className="w-4 h-4 text-accent-blue" />
                    <span className="text-gray-600">{formatDate(song.latestSingDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 最新パフォーマンス情報 */}
          {latestPerformance && (
            <div className="mt-auto pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-accent-gold" />
                <span className="text-xs font-medium text-gray-700">最新配信</span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-accent-gold text-white rounded-lg hover:bg-accent-gold-hover transition-all duration-200 hover:shadow-md font-medium"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    再生
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(song);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:shadow-sm font-medium"
                >
                  <Info className="w-3.5 h-3.5" />
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
