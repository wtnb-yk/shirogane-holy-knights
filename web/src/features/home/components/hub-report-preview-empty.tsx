import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HubCard } from './hub-card';
import { HubCardHeader } from './hub-card-header';

const ICON = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--color-accent-label)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 20V10" />
    <path d="M12 20V4" />
    <path d="M6 20v-6" />
  </svg>
);

export function HubReportPreviewEmpty() {
  return (
    <HubCard>
      <HubCardHeader
        icon={ICON}
        iconBg="rgba(200,162,76,0.1)"
        label="Activity Report"
        title="団員レポート"
        className="mb-sm"
      />
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-xs text-muted leading-relaxed mb-lg">
          配信をチェックすると、
          <br />
          あなただけのレポートが作れます。
        </p>
      </div>
      <Link href="/streams">
        <Button variant="primary" className="w-full justify-center">
          配信をチェック
        </Button>
      </Link>
    </HubCard>
  );
}
