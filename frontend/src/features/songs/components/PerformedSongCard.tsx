'use client';

import React from 'react';
import { Music } from 'lucide-react';
import { PerformedSong } from '../types/types';
import { CardContent } from '@/components/ui/card';
import { StaggeredItem } from '@/components/ui/StaggeredItem';

interface PerformedSongCardProps {
  song: PerformedSong;
  index?: number;
  onClick: (song: PerformedSong) => void;
}

const PerformedSongCardComponent = ({ song, index = 0, onClick }: PerformedSongCardProps) => {
  

  // 最新のパフォーマンスを取得（最初の1件のみ表示）
  const latestPerformance = song.performances[0];

  return (
    <>
      <StaggeredItem index={index} className="group">
        <div
          onClick={() => onClick(song)}
          className="song-card-hover rounded-lg overflow-hidden h-full cursor-pointer bg-bg-primary border border-border-primary hover:border-accent-gold/50 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          aria-label={`${song.title}のパフォーマンス一覧を表示`}
          // aria-label={`${song.title} - ${song.artist}のパフォーマンス一覧を表示`}
        >
        <CardContent className="p-4 md:p-5 h-full flex flex-col">
          {/* ヘッダー部分 */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="p-2 rounded-lg bg-accent-gold/20 flex-shrink-0">
                <Music className="w-4 h-4 text-accent-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-text-primary font-semibold text-sm md:text-base line-clamp-2 group-hover:text-accent-gold transition-colors">
                  {song.title}
                </h3>
                <p className="text-text-secondary text-xs md:text-sm line-clamp-1">
                  {/*{song.artist}*/}
                </p>
              </div>
            </div>
          </div>

          {/* 最新パフォーマンス情報 */}
          {latestPerformance && (
            <div className="mt-auto">
              <p className="text-text-secondary text-xs line-clamp-2">
                {latestPerformance.videoTitle}
              </p>
            </div>
          )}

          {/* 歌唱数インジケーター */}
          <div className="mt-2 text-center">
            <span className="text-xs text-text-primary bg-bg-secondary rounded-full px-2 py-1">
              {song.performances.length}回
            </span>
          </div>
        </CardContent>
        </div>
      </StaggeredItem>
    </>
  );
};

export const PerformedSongCard = React.memo(PerformedSongCardComponent);
