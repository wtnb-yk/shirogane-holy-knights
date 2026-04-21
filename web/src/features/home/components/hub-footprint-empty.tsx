import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HubCard } from './hub-card';
import { HubCardHeader } from './hub-card-header';

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

export function HubFootprintEmpty() {
  return (
    <HubCard>
      <HubCardHeader
        icon={ICON}
        iconBg="rgba(74,139,107,0.1)"
        label="Footprint"
        title="団員のあしあと"
      />

      {/* ダミーヒートマップ（空の状態を暗示） */}
      <div
        className="grid gap-0.5 my-md opacity-30"
        style={{ gridTemplateColumns: 'repeat(13, 1fr)' }}
        data-hm-theme="light"
      >
        {Array.from({ length: 91 }, (_, i) => (
          <div
            key={i}
            className="aspect-square rounded-[2px] bg-[var(--hm-cell-l0)]"
          />
        ))}
      </div>

      <p className="text-2xs text-muted text-center leading-relaxed mb-md">
        配信をチェックすると
        <br />
        ここにあなたの記録が刻まれます
      </p>

      <Link href="/streams" className="mt-auto">
        <Button variant="primary" className="w-full justify-center">
          配信をチェック
        </Button>
      </Link>
    </HubCard>
  );
}
