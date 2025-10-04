'use client';

import React from 'react';
import { StreamSong } from '@/features/songs/types/types';
import { StaggeredItem } from '@/components/Card/StaggeredItem';
import { SongCardThumbnail } from './internals/SongCardThumbnail';
import { formatDateOnly } from '../../../utils/performanceUtils';
import { Music, Calendar } from 'lucide-react';

interface SongCardProps {
  song: StreamSong;
  index: number;
  onClick: (song: StreamSong) => void;
}

const SongCardComponent = ({ song, index, onClick }: SongCardProps) => {
  const latestPerformance = song.performances[0];

  return (
    <StaggeredItem index={index} className="group">
      <div
        onClick={() => onClick(song)}
        className="h-full rounded-lg overflow-hidden cursor-pointer bg-bg-primary border border-surface-border hover:border-accent-gold/50 hover:shadow-lg transition-all duration-card transform hover:scale-105"
        aria-label={`${song.title} - ${song.artist}のパフォーマンス一覧を表示`}
      >
        {/* サムネイル */}
        <div className="relative w-full aspect-video">
          <SongCardThumbnail
            videoId={latestPerformance?.videoId || null}
            title={song.title}
            size="xl"
            showOverlay={true}
            aspectRatio="video"
            variant="detail"
            className="w-full h-full"
          />
        </div>

        {/* テキスト情報 */}
        <div className="p-3 sm:p-4 flex flex-col h-[112px]">
          {/* 楽曲タイトル - 2行まで */}
          <h3 className="font-bold text-text-primary line-clamp-2 text-sm sm:text-base leading-tight mb-1 flex-shrink-0">
            {song.title}
          </h3>

          {/* アーティスト名 - 1行のみ */}
          <p className="text-xs sm:text-sm text-text-secondary line-clamp-1 overflow-hidden truncate flex-shrink-0">
            {song.artist}
          </p>

          {/* フレキシブルスペーサー - 余白を吸収 */}
          <div className="flex-grow"></div>

          {/* 統計情報 - 常に下部に配置 */}
          <div className="flex items-center justify-between text-xs text-text-tertiary flex-shrink-0">
            {/* 歌唱回数 */}
            <div className="flex items-center gap-1">
              <Music className="w-3 h-3" />
              <span>{song.singCount}回</span>
            </div>

            {/* 最新歌唱日 */}
            {song.latestSingDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDateOnly(song.latestSingDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </StaggeredItem>
  );
};

SongCardComponent.displayName = 'StreamSongGridCard';

export const SongCard = React.memo(SongCardComponent);
