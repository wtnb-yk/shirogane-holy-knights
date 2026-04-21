import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HubCard } from './hub-card';
import { HubCardHeader } from './hub-card-header';

type Props = {
  count: number;
  thumbnails: string[];
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
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const STACK_STYLES: import('react').CSSProperties[] = [
  {
    top: 0,
    left: '50%',
    transform: 'translateX(-50%) rotate(-6deg)',
    opacity: 0.4,
    zIndex: 1,
  },
  {
    top: 12,
    left: '50%',
    transform: 'translateX(-42%) rotate(3deg)',
    opacity: 0.6,
    zIndex: 2,
  },
  {
    top: 24,
    left: '50%',
    transform: 'translateX(-56%) rotate(-1deg)',
    opacity: 1,
    zIndex: 3,
  },
];

export function HubAsmrDraw({ count, thumbnails }: Props) {
  return (
    <HubCard>
      <HubCardHeader
        icon={ICON}
        iconBg="rgba(200,162,76,0.1)"
        label="Today's ASMR"
        title="今日のASMR"
      />

      <p className="text-xs text-muted mb-sm">
        {count}本のアーカイブからランダムで1本を提案
      </p>

      {/* サムネイルスタック */}
      <div className="relative h-40 my-md">
        {thumbnails.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={url}
            src={url}
            alt=""
            className="absolute w-[75%] aspect-video rounded-md object-cover border border-border shadow-card"
            style={STACK_STYLES[i]}
            loading="lazy"
          />
        ))}
      </div>

      <Link href="/asmr" className="mt-auto">
        <Button variant="secondary" className="w-full justify-center">
          今日のASMRを選ぶ
        </Button>
      </Link>
    </HubCard>
  );
}
