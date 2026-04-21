export function HeroReportPreview() {
  return (
    <div className="hidden md:block">
      <div className="bg-surface border border-border rounded-lg p-lg shadow-card rotate-2 hover:rotate-0 hover:scale-[1.02] transition-transform duration-500 ease-out-expo">
        {/* ヘッダー */}
        <div className="flex items-center gap-sm mb-md pb-sm border-b border-border">
          <span className="text-sm text-accent">&#9876;</span>
          <span className="font-mono text-3xs tracking-wide text-accent-label uppercase">
            Activity Report
          </span>
        </div>

        {/* タイトル */}
        <div className="font-display text-lg font-semibold text-heading text-center mb-md">
          団員レポート
        </div>

        {/* ヒーロー数値 */}
        <div className="text-center mb-md py-md bg-[var(--glow-navy)] rounded-sm">
          <div className="font-display text-4xl font-bold text-heading leading-none">
            142
            <span className="text-sm font-normal text-muted ml-xs">本</span>
          </div>
          <div className="font-mono text-3xs text-subtle mt-xs">
            チェック済み配信
          </div>
        </div>

        {/* 統計グリッド */}
        <div className="grid grid-cols-2 gap-sm mb-md">
          <div className="p-sm bg-page rounded-xs">
            <div className="font-display text-base font-semibold text-heading leading-none">
              38<span className="text-xs font-normal text-subtle">%</span>
            </div>
            <div className="font-mono text-3xs text-subtle mt-0.5">
              配信カバー率
            </div>
          </div>
          <div className="p-sm bg-page rounded-xs">
            <div className="font-display text-base font-semibold text-heading leading-none">
              4.2<span className="text-xs font-normal text-subtle">本/週</span>
            </div>
            <div className="font-mono text-3xs text-subtle mt-0.5">
              週あたり平均
            </div>
          </div>
          <div className="p-sm bg-page rounded-xs">
            <div className="font-display text-base font-semibold text-heading leading-none">
              12<span className="text-xs font-normal text-subtle">日</span>
            </div>
            <div className="font-mono text-3xs text-subtle mt-0.5">
              連続視聴記録
            </div>
          </div>
          <div className="p-sm bg-page rounded-xs">
            <div className="font-display text-base font-semibold text-heading leading-none">
              8<span className="text-xs font-normal text-subtle">曲</span>
            </div>
            <div className="font-mono text-3xs text-subtle mt-0.5">
              お気に入り楽曲
            </div>
          </div>
        </div>

        {/* ジャンル分布 */}
        <div className="flex gap-xs flex-wrap">
          <span className="px-sm py-0.5 rounded-xs bg-[var(--glow-gold)] font-mono text-3xs text-accent-label">
            ゲーム 48
          </span>
          <span className="px-sm py-0.5 rounded-xs bg-[var(--glow-navy)] font-mono text-3xs text-secondary">
            ASMR 31
          </span>
          <span className="px-sm py-0.5 rounded-xs bg-[var(--glow-navy)] font-mono text-3xs text-secondary">
            雑談 28
          </span>
          <span className="px-sm py-0.5 rounded-xs bg-[var(--glow-navy)] font-mono text-3xs text-secondary">
            歌枠 18
          </span>
        </div>

        {/* フッター */}
        <div className="mt-md pt-sm border-t border-border font-mono text-[9px] text-faint text-center">
          だんいんログ &mdash; 2026.04
        </div>
      </div>
    </div>
  );
}
