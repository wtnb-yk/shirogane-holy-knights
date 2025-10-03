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
        <div className="p-4 space-y-2">
          {/* 楽曲タイトル */}
          <h3 className="font-bold text-text-primary line-clamp-2 min-h-[2.5rem]">
            {song.title}
          </h3>

          {/* アーティスト名 */}
          <p className="text-sm text-text-secondary">
            {song.artist}
          </p>

          {/* 統計情報 */}
          <div className="flex items-center justify-between pt-2 text-xs text-text-tertiary">
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
