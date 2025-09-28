'use client';

import React from 'react';
import { CardContent } from '@/components/Card/card';
import { StaggeredItem } from '@/components/Card/StaggeredItem';
import { SongCardThumbnail } from './internals/SongCardThumbnail';
import { StreamSong } from "@/features/songs/types/types";
import { StreamSongInfo } from './internals/StreamSongInfo';
import { StreamSongStats } from './internals/StreamSongStats';

interface StreamSongListCardProps {
  song: StreamSong;
  index?: number;
  onClick: (song: StreamSong) => void;
}

const StreamSongListCardComponent = ({ song, index = 0, onClick }: StreamSongListCardProps) => {
  const latestPerformance = song.performances[0];

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
              showOverlay={true}
              aspectRatio="video"
              variant="detail"
              className="flex-shrink-0 group-hover:scale-105 transition-transform duration-ui"
            />
            
            {/* メイン情報 */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                {/* 楽曲情報 */}
                <StreamSongInfo
                  song={song}
                  latestPerformance={latestPerformance}
                />

                {/* 統計情報 */}
                <StreamSongStats song={song} />
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </StaggeredItem>
  );
};

export const StreamSongListCard = React.memo(StreamSongListCardComponent);
