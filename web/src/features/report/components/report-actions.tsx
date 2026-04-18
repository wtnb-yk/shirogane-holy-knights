'use client';

import { useState, type RefObject } from 'react';
import { Button } from '@/components/ui/button';
import type { ReportStats } from '../lib/compute-stats';
import type { ReportTheme } from './report-card';
import { captureCardAsDataUrl, downloadImage } from '../lib/capture';
import { SITE_URL } from '@/lib/site';

type Props = {
  stats: ReportStats;
  theme: ReportTheme;
  onThemeChange: (theme: ReportTheme) => void;
  cardRef: RefObject<HTMLDivElement | null>;
};

const THEMES: { key: ReportTheme; label: string; style: string }[] = [
  {
    key: 'light',
    label: 'ライト',
    style:
      'bg-[var(--color-cream-50)] shadow-[inset_0_0_0_1px_var(--color-cream-400)]',
  },
  { key: 'dark', label: 'ダーク', style: 'bg-[var(--color-navy-800)]' },
  {
    key: 'gold',
    label: 'ゴールド',
    style:
      'bg-gradient-to-br from-[var(--color-gold-200)] to-[var(--color-gold-400)]',
  },
];

function shareOnX(stats: ReportStats): void {
  const text = [
    '白銀聖騎士団 団員レポート',
    `⚔ ${stats.streamCount}本の配信を視聴`,
    `📅 推し歴 ${stats.daysSinceFirst}日`,
    '',
    '#だんいんログ #白銀ノエル',
  ].join('\n');
  const url = `${SITE_URL}/report`;
  const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(tweetUrl, '_blank', 'noopener,noreferrer');
}

export function ReportActions({ stats, theme, onThemeChange, cardRef }: Props) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await captureCardAsDataUrl(cardRef.current);
      const date = new Date().toISOString().slice(0, 10);
      downloadImage(dataUrl, `danin-report-${date}.png`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-md mt-xl animate-card-entrance-delayed">
      {/* ボタン群 */}
      <div className="flex gap-sm max-md:flex-col max-md:w-full">
        <Button
          variant="primary"
          onClick={handleDownload}
          disabled={downloading}
          className={downloading ? 'opacity-70' : ''}
        >
          {downloading ? (
            '準備中...'
          ) : (
            <>
              <DownloadIcon />
              画像をダウンロード
            </>
          )}
        </Button>
        <Button
          variant="secondary"
          onClick={() => shareOnX(stats)}
          className="max-md:w-full max-md:justify-center"
        >
          <XIcon />
          Xでシェア
        </Button>
      </div>

      {/* テーマセレクター */}
      <div className="flex items-center gap-sm mt-sm">
        <span className="font-mono text-3xs text-subtle tracking-[0.06em]">
          THEME
        </span>
        <div className="flex gap-1.5">
          {THEMES.map((t) => (
            <button
              key={t.key}
              title={t.label}
              onClick={() => onThemeChange(t.key)}
              className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-200 ease-out-expo hover:scale-115 ${t.style} ${
                theme === t.key
                  ? 'border-heading ring-1 ring-border-strong ring-offset-2 ring-offset-page'
                  : 'border-transparent'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- インラインSVGアイコン ---- */

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M8 2v9M4 8l4 4 4-4" />
      <path d="M2 13h12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M12.6 1h2.4l-5.3 6.1L16 15h-4.9l-3.8-5-4.4 5H.5l5.7-6.5L.2 1h5l3.5 4.6L12.6 1zm-.8 12.6h1.3L4.3 2.3H2.9l8.9 11.3z" />
    </svg>
  );
}
