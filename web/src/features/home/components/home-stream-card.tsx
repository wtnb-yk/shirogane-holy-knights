import type { Stream } from '@/lib/data/types';
import { formatDate, formatDuration } from '@/lib/format';

type Props = {
  stream: Stream;
  isChecked: boolean;
  onToggleCheck: (id: string) => void;
};

export function HomeStreamCard({ stream, isChecked, onToggleCheck }: Props) {
  const isNew = !isChecked;

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden transition-all duration-250 ease-out-expo hover:border-border-hover hover:shadow-card hover:-translate-y-0.5">
      {/* サムネイル */}
      <a
        href={`https://www.youtube.com/watch?v=${stream.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full aspect-video bg-surface-hover overflow-hidden group/thumb"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- YouTube外部サムネイル */}
        <img
          src={stream.thumbnailUrl}
          alt={stream.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {isNew && (
          <span className="absolute top-sm left-sm px-sm py-0.5 bg-accent text-[var(--color-navy-900)] font-mono text-[9px] font-semibold rounded-xs tracking-wide">
            NEW
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300">
          <div className="w-[36px] h-[36px] rounded-full bg-white/85 backdrop-blur-[4px] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <svg
              className="w-3 h-3 text-interactive ml-px"
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <path d="M3 1.5l7.5 4.5-7.5 4.5z" />
            </svg>
          </div>
        </div>
      </a>

      {/* 情報 */}
      <div className="p-sm px-md pb-md">
        {stream.tags.length > 0 && (
          <span className="inline-block w-fit px-xs py-0 bg-[var(--glow-navy)] text-interactive font-mono text-3xs rounded-xs tracking-normal mb-xs">
            {stream.tags.map((t) => t.name).join(' / ')}
          </span>
        )}
        <div className="text-sm font-medium text-heading leading-[1.4] line-clamp-2 mb-0.5">
          {stream.title}
        </div>
        <div className="font-mono text-3xs text-subtle mb-sm">
          {formatDate(stream.startedAt)} &mdash;{' '}
          {formatDuration(stream.duration)}
        </div>
        <button
          type="button"
          onClick={() => onToggleCheck(stream.id)}
          className={`inline-flex items-center gap-xs w-fit px-sm py-0.5 text-2xs font-medium rounded-sm border transition-all duration-300 cursor-pointer ${
            isChecked
              ? 'bg-foreground text-surface border-foreground'
              : 'bg-transparent text-interactive border-border-hover hover:bg-[var(--glow-navy)] hover:border-subtle hover:text-heading'
          }`}
        >
          {isChecked ? '✓ 視聴済' : '+ 視聴チェック'}
        </button>
      </div>
    </div>
  );
}
