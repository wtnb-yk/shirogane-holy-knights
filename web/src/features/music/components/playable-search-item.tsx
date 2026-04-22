'use client';

import type { Song } from '@/lib/data/types';
import { formatTime } from '@/lib/format';
import { useInlinePlay } from '../hooks/use-inline-play';
import { InlinePlayer } from './inline-player';
import { PlayToggleIcon } from './play-toggle-icon';

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

type Appearance = {
  source: string;
  videoId: string;
  title: string;
  startSeconds: number;
};

/** 検索結果1件 + インライン再生の管理 */
export function PlayableSearchItem({ song }: Props) {
  const { toggle, isPlaying } = useInlinePlay();

  const stats: string[] = [];
  if (song.streamPerformances.length > 0)
    stats.push(`歌枠${song.streamPerformances.length}回`);
  if (song.concertPerformances.length > 0)
    stats.push(`ライブ${song.concertPerformances.length}回`);
  if (song.musicVideos.length > 0) stats.push('MV');

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
          const playing = isPlaying(key);

          return (
            <div key={key}>
              <div
                onClick={() => toggle(key)}
                className={`flex items-center gap-sm px-2.5 py-1.5 rounded-sm text-xs cursor-pointer transition-all duration-250 ease-out-expo hover:bg-surface-hover hover:translate-x-1 ${playing ? 'bg-[var(--glow-gold)]' : 'bg-page'}`}
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
                <PlayToggleIcon isPlaying={playing} />
              </div>
              {playing && (
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
