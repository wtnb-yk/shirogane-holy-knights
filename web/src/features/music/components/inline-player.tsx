'use client';

import { formatTime } from '@/lib/format';

type Props = {
  videoId: string;
  startSeconds: number;
  songTitle: string;
  artist: string;
};

export function InlinePlayer({
  videoId,
  startSeconds,
  songTitle,
  artist,
}: Props) {
  const embedUrl =
    startSeconds > 0
      ? `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&autoplay=1`
      : `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  const youtubeUrl =
    startSeconds > 0
      ? `https://www.youtube.com/watch?v=${videoId}&t=${startSeconds}`
      : `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="animate-fade-in px-2.5 py-sm">
      <div className="relative w-full max-w-[var(--inline-player-max)] mx-auto rounded-md overflow-hidden bg-black aspect-video">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={`${songTitle} — ${artist}`}
        />
      </div>
      <div className="flex items-center gap-sm pt-sm max-w-[var(--inline-player-max)] mx-auto">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-heading">
            {songTitle} — {artist}
          </div>
          {startSeconds > 0 && (
            <div className="font-mono text-3xs text-subtle">
              {formatTime(startSeconds)} から再生
            </div>
          )}
        </div>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-3xs text-muted px-2 py-1 rounded-xs border border-border flex items-center gap-1 flex-shrink-0 transition-all duration-250 ease-out-expo hover:text-interactive hover:border-border-hover hover:bg-surface-hover"
        >
          <svg
            className="w-2.5 h-2.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M6 3h7v7" />
            <path d="M13 3L6 10" />
          </svg>
          YouTubeで開く
        </a>
      </div>
    </div>
  );
}
