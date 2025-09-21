'use client';

import React from 'react';
import { AlbumTrackDto } from '../types/types';

interface AlbumTrackListProps {
  tracks: AlbumTrackDto[];
}

const TrackItem = ({ track }: { track: AlbumTrackDto }) => (
  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-bg-secondary rounded-lg">
    <div className="text-text-muted text-xs sm:text-sm font-medium w-6 sm:w-8 text-center">
      {track.trackNumber}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-medium text-sm sm:text-base text-text-primary truncate">
        {track.title}
      </div>
      <div className="text-xs sm:text-sm text-text-secondary truncate">
        {track.artist}
      </div>
    </div>
  </div>
);

export const AlbumTrackList = ({ tracks }: AlbumTrackListProps) => {
  if (!tracks || tracks.length === 0) return null;

  return (
    <div>
      <h3 className="text-base sm:text-lg font-bold text-text-primary mb-2 sm:mb-3">
        トラックリスト ({tracks.length} 曲)
      </h3>
      <div className="space-y-1 sm:space-y-2">
        {tracks.map((track) => (
          <TrackItem key={track.songId} track={track} />
        ))}
      </div>
    </div>
  );
};