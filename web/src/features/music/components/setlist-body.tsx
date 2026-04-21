'use client';

import { useState } from 'react';
import type { MusicStreamSong } from '@/lib/data/types';
import { formatTime } from '@/lib/format';
import { FavButton } from './fav-button';
import { InlinePlayer } from './inline-player';

type Props = {
  videoId: string;
  songs: MusicStreamSong[];
  favoriteIds: Set<string>;
  onToggleFavorite: (songId: string) => void;
  /** URL遷移時の自動再生開始秒数 */
  autoPlayStartSeconds?: number | null;
};

export function SetlistBody({
  videoId,
  songs,
  favoriteIds,
  onToggleFavorite,
  autoPlayStartSeconds,
}: Props) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(() => {
    if (autoPlayStartSeconds != null) {
      const idx = songs.findIndex(
        (s) => s.startSeconds === autoPlayStartSeconds,
      );
      return idx >= 0 ? idx : null;
    }
    return null;
  });

  return (
    <div className="flex flex-col gap-0.5">
      {songs.map((song, i) => {
        const isPlaying = playingIndex === i;
        const timeStr = formatTime(song.startSeconds);

        return (
          <div key={`${song.songId}-${i}`}>
            <div
              onClick={() => setPlayingIndex((prev) => (prev === i ? null : i))}
              className={`flex items-center gap-sm px-2.5 py-[7px] text-xs rounded-sm cursor-pointer transition-all duration-250 ease-out-expo hover:bg-surface-hover hover:translate-x-1 ${isPlaying ? 'bg-[var(--glow-gold)]' : ''}`}
            >
              <span className="font-mono text-3xs text-subtle w-5 text-right flex-shrink-0">
                {i + 1}
              </span>
              <FavButton
                active={favoriteIds.has(song.songId)}
                onClick={() => onToggleFavorite(song.songId)}
              />
              <span className="text-heading font-medium flex-1 min-w-0 truncate">
                {song.title}
              </span>
              <span className="text-xs text-muted flex-shrink-0 max-w-[140px] truncate">
                {song.artist}
              </span>
              {timeStr && (
                <span className="font-mono text-3xs text-subtle flex-shrink-0">
                  {timeStr}
                </span>
              )}
              <div
                className={`size-4.5 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity duration-250 ease-out-expo ${isPlaying ? 'opacity-100 bg-accent text-surface' : 'opacity-0 bg-[var(--glow-gold)] text-accent-label'}`}
              >
                <svg
                  className="size-2 ml-px"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <path d="M3 1.5l7.5 4.5-7.5 4.5z" />
                </svg>
              </div>
            </div>
            {isPlaying && (
              <InlinePlayer
                videoId={videoId}
                startSeconds={song.startSeconds}
                songTitle={song.title}
                artist={song.artist}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
