import Link from 'next/link';
import type { Stream } from '@/lib/data/types';
import { formatDate, formatDuration } from '@/lib/format';

type Props = {
  streams: Stream[];
};

export function HubStreams({ streams }: Props) {
  const newCount = streams.length;

  return (
    <div className="bg-surface border border-border rounded-lg p-lg flex flex-col transition-all duration-300 ease-out-expo hover:border-border-hover hover:shadow-card">
      <div className="flex justify-between items-start mb-lg">
        <div>
          <div className="font-mono text-3xs tracking-wider text-accent-label uppercase mb-xs">
            Latest Streams
          </div>
          <h2 className="font-body text-xl font-bold text-heading">
            最新の配信
          </h2>
          <p className="text-xs text-muted mt-2xs">
            チェックして推し活を記録しよう
          </p>
        </div>
        {newCount > 0 && (
          <span className="px-sm py-xs bg-[var(--glow-gold)] text-accent-label font-mono text-2xs font-medium rounded-sm">
            {newCount} NEW
          </span>
        )}
      </div>

      <div className="flex gap-sm flex-1">
        {streams.map((stream) => (
          <StreamThumb key={stream.id} stream={stream} />
        ))}
      </div>

      <Link
        href="/streams"
        className="mt-md text-xs text-muted transition-colors duration-200 hover:text-foreground"
      >
        すべての配信を見る &rarr;
      </Link>
    </div>
  );
}

function StreamThumb({ stream }: { stream: Stream }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${stream.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 flex flex-col rounded-md overflow-hidden bg-surface border border-border transition-all duration-250 ease-out-expo hover:-translate-y-0.5 hover:border-border-hover hover:shadow-card"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- YouTube外部サムネイル */}
      <img
        src={stream.thumbnailUrl}
        alt={stream.title}
        loading="lazy"
        className="w-full aspect-video object-cover"
      />
      <div className="p-sm flex flex-col gap-2xs flex-1">
        <div className="text-2xs font-medium text-heading leading-[1.4] line-clamp-2">
          {stream.title}
        </div>
        <div className="font-mono text-3xs text-subtle mt-auto">
          {formatDate(stream.startedAt)} &mdash;{' '}
          {formatDuration(stream.duration)}
        </div>
      </div>
    </a>
  );
}
