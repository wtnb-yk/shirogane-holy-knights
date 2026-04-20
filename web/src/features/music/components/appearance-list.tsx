'use client';

import { useState } from 'react';
import type { AggregatedSong } from '../hooks/use-music-filter';
import { formatDate, formatTime } from '@/lib/format';
import { InlinePlayer } from './inline-player';

type Props = {
  song: AggregatedSong;
};

export function AppearanceList({ song }: Props) {
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  return (
    <div className="px-lg py-sm pb-md flex flex-col gap-2xs">
      {song.appearances
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((a, i) => {
          const key = `${a.videoId}-${i}`;
          const isPlaying = playingKey === key;

          return (
            <div key={key}>
              <div
                onClick={() =>
                  setPlayingKey((prev) => (prev === key ? null : key))
                }
                className={`flex items-center gap-sm px-2.5 py-1.5 text-xs rounded-sm cursor-pointer transition-all duration-250 ease-out-expo hover:bg-surface-hover hover:translate-x-1 ${isPlaying ? 'bg-[var(--glow-gold)]' : ''}`}
              >
                <span className="font-mono text-3xs text-subtle flex-shrink-0 w-16">
                  {formatDate(a.date)}
                </span>
                <span className="flex-1 min-w-0 truncate text-interactive">
                  {a.videoTitle}
                </span>
                {a.startSeconds > 0 && (
                  <span className="font-mono text-3xs text-subtle flex-shrink-0">
                    {formatTime(a.startSeconds)}
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
                  videoId={a.videoId}
                  startSeconds={a.startSeconds}
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
