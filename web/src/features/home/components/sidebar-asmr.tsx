import Link from 'next/link';

type Props = {
  count: number;
};

export function SidebarAsmr({ count }: Props) {
  return (
    <div className="bg-surface border border-border rounded-lg p-lg transition-all duration-300 ease-out-expo hover:border-border-hover hover:shadow-card">
      <div className="font-mono text-3xs tracking-wide text-accent-label uppercase mb-sm">
        Today&apos;s Pick
      </div>
      <div className="font-display text-base font-semibold text-heading mb-xs">
        今日のASMR
      </div>
      <p className="text-xs text-muted mb-md">気分を選んで、1本提案。</p>

      <div className="flex gap-xs flex-wrap">
        <Link
          href="/asmr"
          className="px-md py-1.5 rounded-full bg-[var(--glow-navy)] border border-border text-xs text-interactive transition-all duration-200 ease-out-expo hover:bg-[var(--glow-gold)] hover:border-accent hover:text-accent-label"
        >
          &#128164; 眠りたい
        </Link>
        <Link
          href="/asmr"
          className="px-md py-1.5 rounded-full bg-[var(--glow-navy)] border border-border text-xs text-interactive transition-all duration-200 ease-out-expo hover:bg-[var(--glow-gold)] hover:border-accent hover:text-accent-label"
        >
          &#9829; 癒し
        </Link>
        <Link
          href="/asmr"
          className="px-md py-1.5 rounded-full bg-[var(--glow-navy)] border border-border text-xs text-interactive transition-all duration-200 ease-out-expo hover:bg-[var(--glow-gold)] hover:border-accent hover:text-accent-label"
        >
          &#9733; ゾクゾク
        </Link>
        <Link
          href="/asmr"
          className="px-md py-1.5 rounded-full bg-[var(--glow-navy)] border border-border text-xs text-interactive transition-all duration-200 ease-out-expo hover:bg-[var(--glow-gold)] hover:border-accent hover:text-accent-label"
        >
          &#127912; 作業
        </Link>
      </div>

      <Link
        href="/asmr"
        className="inline-flex items-center gap-xs mt-md text-xs text-muted transition-colors duration-200 hover:text-foreground"
      >
        {count}本のASMRを見る &rarr;
      </Link>
    </div>
  );
}
