import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
      <Link href="/streams">
        <Button variant="primary">配信をチェック</Button>
      </Link>
    </div>
  );
}
