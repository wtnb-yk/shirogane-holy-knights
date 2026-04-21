import Link from 'next/link';

export function HubFootprintEmpty() {
  return (
    <div className="bg-surface border border-border rounded-lg p-lg flex flex-col">
      <div className="font-mono text-3xs tracking-wider text-accent-label uppercase mb-xs">
        Footprint
      </div>
      <h2 className="font-display text-base font-semibold text-heading mb-md">
        団員のあしあと
      </h2>
      <div className="flex-1 flex flex-col items-center justify-center gap-md text-center">
        <p className="text-xs text-muted leading-relaxed">
          配信をチェックすると
          <br />
          視聴の記録が積み重なります。
          <br />
          年間ヒートマップ画像にして残せます。
        </p>
      </div>
      <Link
        href="/streams"
        className="mt-md inline-flex items-center justify-center gap-sm px-lg py-2 bg-heading text-surface text-xs font-semibold rounded-sm transition-all duration-200 ease-out-expo hover:-translate-y-px hover:shadow-button-hover"
      >
        配信をチェック
      </Link>
    </div>
  );
}
