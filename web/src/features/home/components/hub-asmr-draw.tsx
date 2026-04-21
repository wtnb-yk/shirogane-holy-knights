import Link from 'next/link';

type Props = {
  count: number;
};

export function HubAsmrDraw({ count }: Props) {
  return (
    <Link
      href="/asmr"
      className="rounded-lg flex flex-col overflow-hidden relative transition-all duration-350 ease-out-expo hover:-translate-y-0.5 hover:shadow-card-hover border border-[var(--color-asmr-border)] text-[var(--color-asmr-text)] hover:border-[var(--color-asmr-border-hover)]"
      style={{
        background:
          'linear-gradient(170deg, var(--color-asmr-bg) 0%, var(--color-asmr-bg-end) 100%)',
      }}
    >
      {/* 月光グロー */}
      <div className="absolute top-[-30px] right-[-20px] w-[var(--asmr-glow-size)] h-[var(--asmr-glow-size)] rounded-full pointer-events-none bg-[radial-gradient(circle,var(--color-asmr-glow)_0%,transparent_70%)]" />

      <div className="relative z-[1] p-lg flex-1 flex flex-col">
        <div className="font-mono text-3xs tracking-wider uppercase mb-xs text-[var(--color-asmr-label)]">
          Today&apos;s Pick
        </div>
        <h2 className="font-display text-lg font-semibold mb-sm text-[var(--color-asmr-text)]">
          今日のASMR
        </h2>
        <p className="text-xs leading-relaxed mb-auto text-[var(--color-asmr-muted)]">
          今日のあなたに合うASMRを
          <br />
          1本ランダムで提案します。
        </p>

        <div className="flex items-baseline gap-xs mt-lg mb-2xs">
          <span className="font-display text-2xl font-bold leading-none text-[var(--color-asmr-text)]">
            {count}
          </span>
          <span className="text-xs text-[var(--color-asmr-subtle)]">
            本のアーカイブから
          </span>
        </div>
        <div className="font-mono text-3xs text-[var(--color-asmr-subtle)]">
          何度でも引き直せます
        </div>
      </div>

      <div className="relative z-[1] p-md bg-[var(--color-asmr-cta-bg)] border-t border-[var(--color-asmr-divider)]">
        <div className="w-full py-sm rounded-sm text-center text-sm font-semibold transition-all duration-250 ease-out-expo hover:-translate-y-px bg-[var(--color-asmr-btn-bg)] text-[var(--color-asmr-btn-text)] border border-[var(--color-asmr-btn-border)]">
          今日の1本を引く
        </div>
      </div>
    </Link>
  );
}
