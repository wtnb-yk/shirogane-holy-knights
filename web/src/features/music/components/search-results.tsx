import type { Song } from '@/lib/data/types';
import { formatTime } from '@/lib/format';

type Props = {
  query: string;
  results: Song[];
};

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

export function SearchResults({ query, results }: Props) {
  if (results.length === 0) {
    return (
      <div className="text-center py-2xl text-muted text-sm">
        「{query}」に該当する楽曲が見つかりません
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      {results.map((song) => (
        <SearchResultItem key={song.id} song={song} />
      ))}
    </div>
  );
}

function SearchResultItem({ song }: { song: Song }) {
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
          const url =
            a.startSeconds > 0
              ? `https://www.youtube.com/watch?v=${a.videoId}&t=${a.startSeconds}`
              : `https://www.youtube.com/watch?v=${a.videoId}`;

          return (
            <a
              key={`${a.videoId}-${i}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-sm px-2.5 py-1.5 bg-page rounded-sm text-xs text-interactive transition-all duration-250 ease-out-expo hover:bg-surface-hover hover:translate-x-1"
            >
              <span
                className={`inline-block px-1.5 font-mono text-3xs rounded-xs tracking-normal leading-[1.7] flex-shrink-0 ${style.className}`}
              >
                {style.label}
              </span>
              <span className="flex-1 min-w-0 truncate">{a.title}</span>
              {a.startSeconds > 0 && (
                <span className="font-mono text-3xs text-subtle flex-shrink-0">
                  {formatTime(a.startSeconds)}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
