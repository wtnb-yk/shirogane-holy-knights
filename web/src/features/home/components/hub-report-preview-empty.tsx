import Link from 'next/link';

export function HubReportPreviewEmpty() {
  return (
    <div className="bg-surface border border-border rounded-lg p-lg flex flex-col items-center justify-center text-center">
      <div className="font-mono text-3xs tracking-wider text-accent-label uppercase mb-xs">
        Activity Report
      </div>
      <h2 className="font-display text-base font-semibold text-heading mb-sm">
        団員レポート
      </h2>
      <p className="text-xs text-muted leading-relaxed mb-lg">
        配信をチェックすると、
        <br />
        あなただけのレポートが作れます。
      </p>
      <Link
        href="/streams"
        className="inline-flex items-center gap-sm px-lg py-2 bg-heading text-surface text-xs font-semibold rounded-sm transition-all duration-200 ease-out-expo hover:-translate-y-px hover:shadow-button-hover"
      >
        配信をチェック
      </Link>
    </div>
  );
}
