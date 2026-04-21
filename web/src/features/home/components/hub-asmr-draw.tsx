import Link from 'next/link';

type Props = {
  count: number;
};

export function HubAsmrDraw({ count }: Props) {
  return (
    <Link
      href="/asmr"
      className="rounded-lg flex flex-col overflow-hidden relative transition-all duration-350 ease-out-expo hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
      style={{
        background: 'linear-gradient(170deg, #2a2440 0%, #1e1a2e 100%)',
        border: '1px solid #3a3450',
        color: '#e8e4f0',
      }}
    >
      {/* 月光グロー */}
      <div
        className="absolute top-[-30px] right-[-20px] w-[140px] h-[140px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(200,180,240,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-[1] p-lg flex-1 flex flex-col">
        <div
          className="font-mono text-3xs tracking-wider uppercase mb-xs"
          style={{ color: 'rgba(200,180,240,0.7)' }}
        >
          Today&apos;s Pick
        </div>
        <h2
          className="font-display text-lg font-semibold mb-sm"
          style={{ color: '#f0ecf8' }}
        >
          今日のASMR
        </h2>
        <p
          className="text-xs leading-relaxed mb-auto"
          style={{ color: 'rgba(200,195,215,0.6)' }}
        >
          今日のあなたに合うASMRを
          <br />
          1本ランダムで提案します。
        </p>

        <div className="flex items-baseline gap-xs mt-lg mb-2xs">
          <span
            className="font-display text-2xl font-bold leading-none"
            style={{ color: '#f0ecf8' }}
          >
            {count}
          </span>
          <span className="text-xs" style={{ color: 'rgba(200,195,215,0.5)' }}>
            本のアーカイブから
          </span>
        </div>
        <div
          className="font-mono text-3xs"
          style={{ color: 'rgba(200,195,215,0.4)' }}
        >
          何度でも引き直せます
        </div>
      </div>

      <div
        className="relative z-[1] p-md"
        style={{
          background: 'rgba(255,255,255,0.04)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="w-full py-sm rounded-sm text-center text-sm font-semibold transition-all duration-250 ease-out-expo hover:-translate-y-px"
          style={{
            background: 'rgba(200,180,240,0.15)',
            color: '#e8e0f4',
            border: '1px solid rgba(200,180,240,0.2)',
          }}
        >
          今日の1本を引く
        </div>
      </div>
    </Link>
  );
}
