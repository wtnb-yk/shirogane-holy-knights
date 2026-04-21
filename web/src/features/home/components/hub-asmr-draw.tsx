import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {
  count: number;
};

export function HubAsmrDraw({ count }: Props) {
  return (
    <div className="bg-surface border border-border rounded-lg p-lg flex flex-col transition-all duration-300 ease-out-expo hover:border-border-hover hover:shadow-card">
      <div className="font-mono text-3xs tracking-wider text-accent-label uppercase mb-xs">
        Today&apos;s Pick
      </div>
      <h2 className="font-display text-base font-semibold text-heading mb-md">
        今日のASMR
      </h2>

      <p className="text-xs text-muted leading-relaxed mb-auto">
        今日のあなたに合うASMRを
        <br />
        1本ランダムで提案します。
      </p>

      {/* 統計 */}
      <div className="text-center my-lg">
        <div className="font-display text-3xl font-bold text-heading leading-none">
          {count}
          <span className="text-sm font-normal text-subtle">本</span>
        </div>
        <div className="font-mono text-3xs text-subtle mt-xs">
          アーカイブから抽選
        </div>
      </div>

      <Link href="/asmr" className="mt-auto">
        <Button variant="primary" className="w-full justify-center">
          今日の1本を引く
        </Button>
      </Link>
    </div>
  );
}
