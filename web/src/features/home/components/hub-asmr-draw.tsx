import Link from 'next/link';
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
    stroke="var(--color-asmr-label)"
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
    <HubCard
      className="border border-asmr-border hover:border-asmr-border-hover relative overflow-hidden"
      style={{
        background:
          'linear-gradient(165deg, var(--color-asmr-bg) 0%, var(--color-asmr-bg-end) 100%)',
      }}
    >
      {/* グロー演出 */}
      <div
        className="absolute -top-7.5 -right-7.5 w-(--asmr-glow-size) h-(--asmr-glow-size) rounded-full pointer-events-none"
        style={{
          background: 'var(--color-asmr-glow)',
          filter: 'blur(40px)',
        }}
      />

      <HubCardHeader
        icon={ICON}
        iconBg="var(--color-asmr-glow)"
        label="Today's ASMR"
        title="今日のASMR"
        labelClassName="font-mono text-3xs tracking-wider text-asmr-label uppercase"
        titleClassName="font-display text-base font-semibold text-asmr-text"
        className="mb-xs relative"
      />

      {/* サムネイルスタック */}
      <div className="relative h-40 my-md">
        {thumbnails.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={url}
            src={url}
            alt=""
            className="absolute w-[75%] aspect-video rounded-md object-cover border-2 border-[rgba(255,255,255,0.1)] shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
            style={STACK_STYLES[i]}
            loading="lazy"
          />
        ))}
      </div>

      <p className="text-2xs text-asmr-muted text-center mb-md relative">
        {count}本のアーカイブからランダムで1本を提案
      </p>

      <Link
        href="/asmr"
        className="mt-auto relative inline-flex items-center justify-center w-full px-lg py-2.5 bg-asmr-btn-bg text-asmr-btn-text border border-asmr-btn-border rounded-sm font-body text-sm font-semibold tracking-normal transition-all duration-300 ease-out-expo hover:bg-[rgba(200,180,240,0.25)] hover:-translate-y-px"
      >
        今日のASMRを選ぶ
      </Link>
    </HubCard>
  );
}
