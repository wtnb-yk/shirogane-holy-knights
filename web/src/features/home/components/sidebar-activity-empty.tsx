import Link from 'next/link';

export function SidebarActivityEmpty() {
  return (
    <div className="bg-surface border border-border rounded-lg p-lg text-center">
      <div className="text-2xl text-border-hover mb-sm">&#9876;</div>
      <div className="font-display text-base font-semibold text-heading mb-xs">
        推し活ログを始めよう
      </div>
      <p className="text-xs text-muted leading-relaxed mb-md">
        配信をチェックすると、
        <br />
        ここに記録が育ちます。
      </p>
      <div className="opacity-20 mb-md">
        <div
          className="grid gap-[2px] mx-auto"
          style={{ gridTemplateColumns: 'repeat(26, 1fr)' }}
        >
          {Array.from({ length: 182 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-[2px] bg-surface-hover"
            />
          ))}
        </div>
      </div>
      <Link
        href="/streams"
        className="inline-flex items-center gap-sm px-lg py-2 bg-heading text-surface text-xs font-semibold rounded-sm transition-all duration-200 ease-out-expo hover:-translate-y-px hover:shadow-button-hover"
      >
        &#9654; 配信をチェック
      </Link>
    </div>
  );
}
