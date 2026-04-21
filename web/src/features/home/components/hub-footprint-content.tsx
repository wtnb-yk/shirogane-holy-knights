import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { CompactCell } from '../lib/compute-heatmap-compact';
import { HubCard } from './hub-card';
import { HubCardHeader } from './hub-card-header';

type Props = {
  activeDays: number;
  maxStreak: number;
  cells: CompactCell[];
};

const ICON = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--color-success)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const LEVEL_BG: Record<0 | 1 | 2 | 3, string> = {
  0: 'bg-[var(--hm-cell-l0)]',
  1: 'bg-[var(--hm-cell-l1)]',
  2: 'bg-[var(--hm-cell-l2)]',
  3: 'bg-[var(--hm-cell-l3)]',
};

export function HubFootprintContent({ activeDays, maxStreak, cells }: Props) {
  const recentCells = cells.slice(-91);

  return (
    <HubCard>
      <HubCardHeader
        icon={ICON}
        iconBg="rgba(74,139,107,0.1)"
        label="Footprint"
        title="団員のあしあと"
      />

      {/* ミニヒートマップ（13週 × 7日） */}
      <div
        className="grid gap-0.5 my-md"
        style={{ gridTemplateColumns: 'repeat(13, 1fr)' }}
        data-hm-theme="light"
      >
        {recentCells.map((cell, i) => (
          <div
            key={i}
            className={`aspect-square rounded-[2px] ${LEVEL_BG[cell.level]}`}
          />
        ))}
      </div>

      {/* サブ統計 */}
      <div className="flex gap-sm mb-md">
        <div className="flex-1 text-center py-sm bg-page rounded-sm">
          <div className="font-display text-base font-semibold text-heading leading-none">
            {activeDays}
            <span className="text-3xs font-normal text-subtle">日</span>
          </div>
          <div className="font-mono text-4xs text-subtle mt-2xs">記録日数</div>
        </div>
        <div className="flex-1 text-center py-sm bg-page rounded-sm">
          <div className="font-display text-base font-semibold text-heading leading-none">
            {maxStreak}
            <span className="text-3xs font-normal text-subtle">日</span>
          </div>
          <div className="font-mono text-4xs text-subtle mt-2xs">最長連続</div>
        </div>
      </div>

      <Link href="/footprint" className="mt-auto">
        <Button variant="secondary" className="w-full justify-center">
          あしあとを見る
        </Button>
      </Link>
    </HubCard>
  );
}
