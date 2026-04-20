'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import type { Stream } from '@/lib/data/types';
import { formatDate, formatDuration } from '@/lib/format';
import {
  getCheckedSnapshot,
  getCheckedServerSnapshot,
  subscribeChecked,
  toggleChecked,
} from '@/features/streams/lib/checked-streams';

type Props = {
  streams: Stream[];
};

export function TodayStreams({ streams }: Props) {
  const checked = useSyncExternalStore(
    subscribeChecked,
    getCheckedSnapshot,
    getCheckedServerSnapshot,
  );

  const newCount = streams.filter((s) => !checked.has(s.id)).length;

  return (
    <div className="bg-surface border border-border rounded-lg p-md md:p-lg">
      <div className="flex items-baseline justify-between mb-md">
        <div className="flex items-center gap-sm">
          <span className="font-display text-base font-semibold text-heading">
            最新配信
          </span>
          {newCount > 0 && (
            <span className="inline-block px-sm py-0.5 bg-[var(--glow-gold)] text-accent-label font-mono text-3xs font-medium rounded-xs tracking-wide">
              {newCount} NEW
            </span>
          )}
        </div>
        <Link
          href="/streams"
          className="text-xs text-subtle transition-colors duration-200 hover:text-foreground"
        >
          すべて見る &rarr;
        </Link>
      </div>

      <div className="flex flex-col gap-md">
        {streams.map((stream, i) => {
          const isChecked = checked.has(stream.id);
          const isLast = i === streams.length - 1;

          return (
            <div
              key={stream.id}
              className={`grid grid-cols-[96px_1fr] md:grid-cols-[120px_1fr] gap-md ${
                !isLast ? 'pb-md border-b border-dashed border-border' : ''
              }`}
            >
              <a
                href={`https://www.youtube.com/watch?v=${stream.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-[96px] md:w-[120px] aspect-video bg-surface-hover rounded-sm overflow-hidden group/thumb"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- YouTube外部サムネイル */}
                <img
                  src={stream.thumbnailUrl}
                  alt={stream.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300">
                  <div className="w-[30px] h-[30px] rounded-full bg-white/85 backdrop-blur-[4px] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                    <svg
                      className="w-2.5 h-2.5 text-interactive ml-px"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <path d="M3 1.5l7.5 4.5-7.5 4.5z" />
                    </svg>
                  </div>
                </div>
              </a>

              <div className="flex flex-col gap-0.5">
                {stream.tags.length > 0 && (
                  <span className="inline-block w-fit px-xs py-0 bg-[var(--glow-navy)] text-interactive font-mono text-3xs rounded-xs tracking-normal">
                    {stream.tags.map((t) => t.name).join(' / ')}
                  </span>
                )}
                <span className="text-sm font-medium text-heading leading-[1.5] line-clamp-2">
                  {stream.title}
                </span>
                <span className="font-mono text-xs text-subtle">
                  {formatDate(stream.startedAt)} &mdash;{' '}
                  {formatDuration(stream.duration)}
                </span>
                <button
                  type="button"
                  onClick={() => toggleChecked(stream.id)}
                  className={`inline-flex items-center gap-xs w-fit mt-xs px-sm py-0.5 text-2xs font-medium rounded-sm border transition-all duration-300 cursor-pointer ${
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
        })}
      </div>
    </div>
  );
}
