'use client';

import { useState } from 'react';
import type { Song } from '@/lib/data/types';
import { formatTime } from '@/lib/format';
import { InlinePlayer } from './inline-player';

const SOURCE_STYLES: Record<string, { label: string; className: string }> = {
  utawaku: {
    label: '歌枠',
    className: 'bg-[rgba(74,139,107,0.12)] text-success',
  },
  live: {
    label: 'ライブ',
    className: 'bg-[rgba(200,162,76,0.14)] text-accent-label',
  },
  mv: {
    label: 'MV',
    className: 'bg-[var(--glow-navy)] text-interactive',
  },
};

type Props = {
  song: Song;
};

/** 検索結果1件 + インライン再生の管理 */
export function PlayableSearchItem({ song }: Props) {
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  const stats: string[] = [];
  if (song.streamPerformances.length > 0)
    stats.push(`歌枠${song.streamPerformances.length}回`);
  if (song.concertPerformances.length > 0)
    stats.push(`ライブ${song.concertPerformances.length}回`);
  if (song.musicVideos.length > 0) stats.push('MV');

  type Appearance = {
    source: string;
    videoId: string;
    title: string;
    startSeconds: number;
  };

  const appearances: Appearance[] = [
    ...song.streamPerformances.map((p) => ({
      source: 'utawaku' as const,
      videoId: p.videoId,
      title: p.videoTitle,
      startSeconds: p.startSeconds,
    })),
    ...song.concertPerformances.map((p) => ({
      source: 'live' as const,
      videoId: p.videoId,
      title: p.videoTitle,
      startSeconds: p.startSeconds,
    })),
    ...song.musicVideos.map((mv) => ({
      source: 'mv' as const,
      videoId: mv.videoId,
      title: mv.videoTitle,
      startSeconds: 0,
    })),
  ];

  return (
    <div className="bg-surface border border-border rounded-md px-lg py-md transition-all duration-250 ease-out-expo hover:border-border-hover hover:shadow-card">
      <div className="flex items-center gap-sm flex-wrap mb-sm">
        <span className="font-display text-sm font-semibold text-heading">
          {song.title}
        </span>
        <span className="text-border text-xs">/</span>
        <span className="text-xs text-muted">{song.artist}</span>
        <span className="font-mono text-3xs text-subtle ml-auto">
          {stats.join(' · ')}
        </span>
      </div>
      <div className="flex flex-col gap-2xs">
        {appearances.map((a, i) => {
          const style = SOURCE_STYLES[a.source];
          const key = `${song.id}-${a.videoId}-${i}`;
          const isPlaying = playingKey === key;

          return (
            <div key={key}>
              <div
                onClick={() =>
                  setPlayingKey((prev) => (prev === key ? null : key))
                }
                className={`flex items-center gap-sm px-2.5 py-1.5 rounded-sm text-xs cursor-pointer transition-all duration-250 ease-out-expo hover:bg-surface-hover hover:translate-x-1 ${isPlaying ? 'bg-[var(--glow-gold)]' : 'bg-page'}`}
              >
                <span
                  className={`inline-block px-1.5 font-mono text-3xs rounded-xs tracking-normal leading-[1.7] flex-shrink-0 ${style.className}`}
                >
                  {style.label}
                </span>
                <span className="flex-1 min-w-0 truncate text-interactive">
                  {a.title}
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
    </div>
  );
}
