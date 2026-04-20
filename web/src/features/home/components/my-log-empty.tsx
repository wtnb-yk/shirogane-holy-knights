import Link from 'next/link';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';

export function MyLogEmpty() {
  return (
    <Reveal>
      {/* CTA（上） — Report/Footprint と同じ構造 */}
      <div className="text-center mb-lg animate-card-entrance-delayed">
        <p className="text-sm text-secondary leading-relaxed mb-md">
          視聴した配信をチェックすると、
          <br />
          ここにあなたの記録が積み重なっていきます。
        </p>
        <Link href="/streams">
          <Button variant="cta">配信を開く</Button>
        </Link>
      </div>

      {/* ゴーストプレビュー（下） */}
      <div className="opacity-25 blur-[1px] pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-md">
          <div className="bg-surface border border-border rounded-lg p-md md:p-lg flex flex-col justify-center">
            <div className="font-mono text-xs font-medium text-subtle tracking-wide uppercase mb-sm">
              This Week
            </div>
            <div className="font-display text-3xl font-semibold text-heading leading-none">
              0
              <span className="text-base font-normal text-muted ml-xs">
                本視聴
              </span>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-md md:p-lg">
            <div>
              <div className="font-display text-base font-semibold text-heading">
                あしあと
              </div>
              <div className="text-xs text-muted mt-0.5 leading-[1.5]">
                視聴した日に色がつきます
              </div>
            </div>
            <div className="flex gap-xl my-md">
              <div>
                <div className="font-display text-xl font-semibold text-heading leading-none">
                  0
                  <span className="text-sm font-normal text-muted ml-0.5">
                    日
                  </span>
                </div>
                <div className="font-mono text-2xs text-subtle mt-xs tracking-wide">
                  記録あり / 過去6ヶ月
                </div>
              </div>
              <div>
                <div className="font-display text-xl font-semibold text-heading leading-none">
                  0
                  <span className="text-sm font-normal text-muted ml-0.5">
                    日
                  </span>
                </div>
                <div className="font-mono text-2xs text-subtle mt-xs tracking-wide">
                  最長連続記録
                </div>
              </div>
            </div>
            <div
              className="grid gap-[3px]"
              data-hm-theme="light"
              style={{ gridTemplateColumns: 'repeat(26, 1fr)' }}
            >
              {Array.from({ length: 182 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-[2px] bg-[var(--hm-cell-l0)]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
