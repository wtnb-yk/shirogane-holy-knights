import Link from 'next/link';
import type { Stream } from '@/lib/data/types';
import { Button } from '@/components/ui/button';
import { HubCard } from './hub-card';
import { HubCardHeader } from './hub-card-header';
import { StreamMiniCard } from './stream-mini-card';

type Props = {
  streams: Stream[];
};

const ICON = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--color-accent-label)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export function HubStreams({ streams }: Props) {
  const newCount = streams.length;

  return (
    <HubCard>
      <HubCardHeader
        icon={ICON}
        iconBg="rgba(200,162,76,0.1)"
        label="Latest Streams"
        title="最新の配信"
        className="mb-xs"
      >
        {newCount > 0 && (
          <span className="px-sm py-xs bg-[var(--glow-gold)] text-accent-label font-mono text-2xs font-medium rounded-sm shrink-0">
            {newCount} NEW
          </span>
        )}
      </HubCardHeader>

      <p className="text-xs text-muted mb-sm">チェックして推し活を記録しよう</p>

      <div className="flex gap-sm flex-1">
        {streams.map((stream) => (
          <StreamMiniCard key={stream.id} stream={stream} />
        ))}
      </div>

      <Link href="/streams" className="mt-md">
        <Button variant="secondary" className="w-full justify-center">
          すべての配信を見る
        </Button>
      </Link>
    </HubCard>
  );
}
