'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import type { Stream } from '@/lib/data/types';
import {
  getCheckedSnapshot,
  getCheckedServerSnapshot,
  subscribeChecked,
  toggleChecked,
} from '@/features/streams/lib/checked-streams';
import { HomeStreamCard } from './home-stream-card';

type Props = {
  streams: Stream[];
  totalCount: number;
};

export function StreamGrid({ streams, totalCount }: Props) {
  const checked = useSyncExternalStore(
    subscribeChecked,
    getCheckedSnapshot,
    getCheckedServerSnapshot,
  );

  const newCount = streams.filter((s) => !checked.has(s.id)).length;

  return (
    <div>
      {/* ヘッダー */}
      <div className="flex items-baseline justify-between mb-md">
        <div className="flex items-center gap-sm">
          <h2 className="font-display text-lg font-semibold text-heading">
            最新の配信
          </h2>
          {newCount > 0 && (
            <span className="inline-block px-sm py-0.5 bg-[var(--glow-gold)] text-accent-label font-mono text-3xs font-medium rounded-xs tracking-wide">
              {newCount} NEW
            </span>
          )}
        </div>
        <Link
          href="/streams"
          className="text-xs text-muted transition-colors duration-200 hover:text-foreground"
        >
          {totalCount.toLocaleString()}件の配信を見る &rarr;
        </Link>
      </div>

      {/* 2x2 カードグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {streams.map((stream) => (
          <HomeStreamCard
            key={stream.id}
            stream={stream}
            isChecked={checked.has(stream.id)}
            onToggleCheck={toggleChecked}
          />
        ))}
      </div>
    </div>
  );
}
