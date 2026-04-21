import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {
  activeDays: number;
  maxStreak: number;
  totalChecks: number;
};

export function HubFootprintContent({
  activeDays,
  maxStreak,
  totalChecks,
}: Props) {
  return (
    <div className="bg-surface border border-border rounded-lg p-lg flex flex-col transition-all duration-300 ease-out-expo hover:border-border-hover hover:shadow-card">
      <div className="font-mono text-3xs tracking-wider text-accent-label uppercase mb-xs">
        Footprint
      </div>
      <h2 className="font-display text-base font-semibold text-heading mb-lg">
        団員のあしあと
      </h2>

      {/* ヒーロー統計 */}
      <div className="text-center mb-lg">
        <div className="font-display text-3xl font-bold text-heading leading-none">
          {activeDays}
          <span className="text-sm font-normal text-subtle">日</span>
        </div>
        <div className="font-mono text-3xs text-subtle mt-xs">記録日数</div>
      </div>

      {/* サブ統計 */}
      <div className="flex gap-sm mb-md">
        <div className="flex-1 text-center py-sm bg-page rounded-sm">
          <div className="font-display text-base font-semibold text-heading leading-none">
            {maxStreak}
            <span className="text-3xs font-normal text-subtle">日</span>
          </div>
          <div className="font-mono text-4xs text-subtle mt-2xs">最長連続</div>
        </div>
        <div className="flex-1 text-center py-sm bg-page rounded-sm">
          <div className="font-display text-base font-semibold text-heading leading-none">
            {totalChecks}
            <span className="text-3xs font-normal text-subtle">本</span>
          </div>
          <div className="font-mono text-4xs text-subtle mt-2xs">累計</div>
        </div>
      </div>

      {/* 説明 */}
      <p className="text-2xs text-muted text-center leading-relaxed mb-md">
        視聴記録を年間ヒートマップ
        <br />
        画像にして残せます
      </p>

      <Link href="/footprint" className="mt-auto">
        <Button variant="secondary" className="w-full justify-center">
          あしあとを見る &rarr;
        </Button>
      </Link>
    </div>
  );
}
