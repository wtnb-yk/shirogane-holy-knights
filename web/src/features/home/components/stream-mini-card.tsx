import type { Stream } from '@/lib/data/types';
import { formatDate, formatDuration } from '@/lib/format';

type Props = {
  stream: Stream;
};

export function StreamMiniCard({ stream }: Props) {
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
