'use client';

import { useState } from 'react';
import type { AggregatedSong } from '../hooks/use-music-filter';
import { FavButton } from './fav-button';

type Props = {
  songs: AggregatedSong[];
  favoriteIds: Set<string>;
  onToggleFavorite: (songId: string) => void;
};

function formatDate(dateStr: string): string {
  return dateStr.slice(0, 10).replace(/-/g, '.');
}

function formatTime(seconds: number): string {
  if (seconds <= 0) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function SongList({ songs, favoriteIds, onToggleFavorite }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {songs.map((song) => (
        <SongRow
          key={song.id}
          song={song}
          isOpen={openId === song.id}
          isFav={favoriteIds.has(song.id)}
          onToggleFav={() => onToggleFavorite(song.id)}
          onToggle={() =>
            setOpenId((prev) => (prev === song.id ? null : song.id))
          }
        />
      ))}
    </div>
  );
}

function SongRow({
  song,
  isOpen,
  isFav,
  onToggleFav,
  onToggle,
}: {
  song: AggregatedSong;
  isOpen: boolean;
  isFav: boolean;
  onToggleFav: () => void;
  onToggle: () => void;
}) {
  return (
    <>
      <div
        onClick={onToggle}
        className="flex items-center gap-md px-lg py-3 border-b border-surface-hover last:border-b-0 cursor-pointer transition-colors duration-250 ease-out-expo hover:bg-page"
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-heading truncate">
            {song.title}
          </div>
          <div className="text-xs text-muted">{song.artist}</div>
        </div>
        <FavButton active={isFav} onClick={onToggleFav} size="sm" />
        <span className="font-mono text-sm font-semibold text-accent-label flex-shrink-0">
          {song.count}
          <small className="text-3xs font-normal text-subtle ml-px">回</small>
        </span>
        <svg
          className={`w-3.5 h-3.5 text-subtle flex-shrink-0 transition-transform duration-300 ease-out-expo ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </div>
      {isOpen && (
        <div className="bg-page border-b border-surface-hover last:border-b-0">
          <div className="px-lg py-sm pb-md flex flex-col gap-2xs">
            {song.appearances
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((a, i) => (
                <a
                  key={`${a.videoId}-${i}`}
                  href={
                    a.startSeconds > 0
                      ? `https://www.youtube.com/watch?v=${a.videoId}&t=${a.startSeconds}`
                      : `https://www.youtube.com/watch?v=${a.videoId}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-sm px-2.5 py-1.5 text-xs text-interactive rounded-sm transition-all duration-250 ease-out-expo hover:bg-surface-hover hover:translate-x-1"
                >
                  <span className="font-mono text-3xs text-subtle flex-shrink-0 w-16">
                    {formatDate(a.date)}
                  </span>
                  <span className="flex-1 min-w-0 truncate">
                    {a.videoTitle}
                  </span>
                  {a.startSeconds > 0 && (
                    <span className="font-mono text-3xs text-subtle flex-shrink-0">
                      {formatTime(a.startSeconds)}
                    </span>
                  )}
                </a>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
