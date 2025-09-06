'use client';

import React from 'react';
import { Music, Calendar, Clock } from 'lucide-react';
import { StreamSong } from '../types/types';
import { CardContent } from '@/components/ui/card';
import { StaggeredItem } from '@/components/ui/StaggeredItem';
import { SongCardThumbnail } from './SongCardThumbnail';

interface StreamSongListCardProps {
  song: StreamSong;
  index?: number;
  onClick: (song: StreamSong) => void;
}

const StreamSongListCardComponent = ({ song, index = 0, onClick }: StreamSongListCardProps) => {
  const latestPerformance = song.performances[0];
  
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
    <StaggeredItem index={index} className="group">
      <div
        onClick={() => onClick(song)}
        className="song-card-hover rounded-lg overflow-hidden cursor-pointer bg-bg-primary border border-surface-border hover:border-accent-gold/50 hover:shadow-lg transition-all duration-card transform hover:scale-[1.01] hover:bg-bg-hover"
        aria-label={`${song.title} - ${song.artist}のパフォーマンス一覧を表示`}
      >
        <CardContent className="p-2 sm:p-4 md:p-5">
          <div className="flex items-start space-x-2 sm:space-x-4">
            {/* サムネイル */}
            <SongCardThumbnail
              videoId={latestPerformance?.videoId || null}
              title={song.title}
              size="lg"
              showPlayButton={true}
              className="flex-shrink-0 group-hover:scale-105 transition-transform duration-ui w-12 h-12 sm:w-20 sm:h-20"
            />
            
            {/* メイン情報 */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                {/* 楽曲情報 */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-text-primary font-semibold text-sm sm:text-lg mb-1 line-clamp-1 group-hover:text-accent-gold transition-colors duration-ui">
                    {song.title}
                  </h3>
                  <p className="text-text-secondary text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-1">
                    {song.artist}
                  </p>
                  
                  {/* 最新パフォーマンス情報 */}
                  {latestPerformance && (
                    <div className="mb-2 sm:mb-3">
                      <div className="flex items-center space-x-1 mb-1">
                        <Clock className="w-3 h-3 text-text-tertiary" />
                        <span className="text-xs text-text-tertiary">最新</span>
                      </div>
                      <p className="text-text-secondary text-xs sm:text-sm line-clamp-1">
                        {latestPerformance.videoTitle}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* 統計情報 */}
                <div className="flex flex-row sm:flex-col gap-2 sm:gap-2 text-xs sm:text-sm text-text-tertiary">
                  <div className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
                    <Music className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-medium">{song.performances.length}回</span>
                  </div>
                  {song.latestSingDate && (
                    <div className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{formatDate(song.latestSingDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </StaggeredItem>
  );
};

export const StreamSongListCard = React.memo(StreamSongListCardComponent);