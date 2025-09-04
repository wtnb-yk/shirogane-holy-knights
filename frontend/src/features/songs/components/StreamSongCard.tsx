'use client';

import React from 'react';
import { Play, Info } from 'lucide-react';
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
  const latestPerformance = song.performances[0];

  return (
    <>
      <StaggeredItem index={index} className="group">
        <div
          className="rounded-xl overflow-hidden h-full bg-bg-primary border border-gray-100 hover:border-accent-gold/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <CardContent className="p-4 h-full flex flex-col">
            {/* サムネイル */}
            <div className="mb-3">
              <SongCardThumbnail
                videoId={latestPerformance?.videoId || null}
                title={song.title}
                size="lg"
                aspectRatio="video"
                className="w-full group-hover:scale-105 transition-transform duration-300 shadow-md group-hover:shadow-lg rounded-lg overflow-hidden"
              />
            </div>

            {/* 曲情報 */}
            <div className="flex-1">
              <h3 className="text-gray-900 font-bold text-base line-clamp-2 group-hover:text-accent-gold transition-colors duration-200 leading-tight mb-1">
                {song.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-1 mb-3">
                {song.artist}
              </p>
            </div>

            {/* アクションボタン */}
            <div className="flex items-center gap-2 mt-auto">
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
          </CardContent>
        </div>
      </StaggeredItem>
    </>
  );
};

export const StreamSongCard = React.memo(StreamSongCardComponent);
