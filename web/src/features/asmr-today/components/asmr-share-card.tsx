import { forwardRef } from 'react';
import type { Stream } from '@/lib/data/types';
import { formatDate, formatDuration } from '@/lib/format';

type Props = {
  stream: Stream;
};

export const AsmrShareCard = forwardRef<HTMLDivElement, Props>(
  function AsmrShareCard({ stream }, ref) {
    return (
      <div
        ref={ref}
        data-report-theme="light"
        className="w-[420px] max-w-full rounded-2xl overflow-hidden shadow-card"
      >
        <div
          className="rc-inner relative border border-[var(--rc-border)]"
          style={{ background: 'var(--rc-bg)' }}
        >
          {/* サムネイル */}
          <img
            src={stream.thumbnailUrl}
            alt={stream.title}
            className="w-full aspect-video object-cover"
          />

          {/* コンテンツ */}
          <div className="px-6 pt-4 pb-5 max-md:px-[18px]">
            {/* ラベル */}
            <div className="text-center mb-3">
              <div className="font-mono text-[9px] font-medium tracking-[0.18em] text-[var(--rc-mono-label)] uppercase">
                Today&apos;s ASMR
              </div>
              <div className="w-7 h-[1.5px] bg-[var(--rc-line)] mx-auto my-2 rounded-[1px]" />
            </div>

            {/* タイトル */}
            <p className="font-body text-sm font-semibold text-[var(--rc-heading)] leading-[1.5] mb-1.5">
              {stream.title}
            </p>

            {/* メタ情報 */}
            <p className="font-mono text-[10px] text-[var(--rc-sub)] mb-3">
              {formatDate(stream.startedAt)} — {formatDuration(stream.duration)}
            </p>

            {/* フッター */}
            <div className="pt-3 border-t border-[var(--rc-footer-border)]">
              <div className="font-mono text-[8px] text-[var(--rc-footer-text)] tracking-[0.08em] text-center">
                だんいんログ &mdash; 白銀ノエル非公式ファンサイト
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
