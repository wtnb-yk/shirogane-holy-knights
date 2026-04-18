import type { Stream } from '@/lib/data/types';
import { formatDate, formatDurationTimestamp } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { TagPill } from '@/components/ui/tag-pill';

type Props = {
  stream: Stream;
  isChecked: boolean;
  onToggleCheck: (id: string) => void;
};

export function StreamCard({ stream, isChecked, onToggleCheck }: Props) {
  return (
    <div
      className={`flex flex-col bg-surface border rounded-md overflow-hidden transition-all duration-300 ease-out-expo hover:border-border-hover hover:shadow-card-hover hover:-translate-y-0.5 ${
        isChecked
          ? 'border-accent bg-[linear-gradient(180deg,var(--glow-gold)_0%,var(--color-surface)_40%)]'
          : 'border-border'
      }`}
    >
      <StreamThumb
        id={stream.id}
        thumbnailUrl={stream.thumbnailUrl}
        duration={stream.duration}
        isChecked={isChecked}
      />
      <div className="flex flex-col gap-1 p-2.5 md:p-3 flex-1">
        {stream.tags.length > 0 && (
          <div className="flex gap-2xs flex-wrap">
            {stream.tags.map((tag) => (
              <TagPill key={tag.id} label={tag.name} variant="small" />
            ))}
          </div>
        )}
        <p className="text-xs font-medium text-heading leading-[1.5] line-clamp-2">
          {stream.title}
        </p>
        <div className="mt-auto pt-1 flex items-center justify-between">
          <span className="font-mono text-3xs text-subtle">
            {formatDate(stream.startedAt)}
          </span>
          <Button
            variant="check"
            checked={isChecked}
            onClick={() => onToggleCheck(stream.id)}
          >
            {isChecked ? '✓ 視聴済' : '+ チェック'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StreamThumb({
  id,
  thumbnailUrl,
  duration,
  isChecked,
}: {
  id: string;
  thumbnailUrl: string;
  duration: string;
  isChecked: boolean;
}) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="relative aspect-video bg-surface-hover overflow-hidden group/thumb"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- YouTube外部サムネイル */}
      <img
        src={thumbnailUrl}
        alt=""
        loading="lazy"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300">
        <div className="w-9 h-9 rounded-full bg-white/88 backdrop-blur-[4px] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <svg
            className="w-3 h-3 text-interactive ml-0.5"
            viewBox="0 0 12 12"
            fill="currentColor"
          >
            <path d="M2.5 1.5l8 4.5-8 4.5z" />
          </svg>
        </div>
      </div>
      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-px bg-page/78 text-surface font-mono text-3xs rounded-xs">
        {formatDurationTimestamp(duration)}
      </span>
      {isChecked && (
        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-foreground text-surface font-mono text-3xs rounded-xs">
          &#10003;
        </span>
      )}
    </a>
  );
}
