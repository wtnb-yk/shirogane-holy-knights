'use client';

import { useRef, useState } from 'react';
import type { Stream } from '@/lib/data/types';
import { ShareCardLayout } from '@/components/ui/share-card-layout';
import { ShareActions } from '@/components/ui/share-actions';
import { SITE_URL } from '@/lib/site';
import { captureCardAsDataUrl, downloadImage } from '@/lib/capture';
import { track } from '@/lib/track';
import { useReportStats } from '../hooks/use-report-stats';
import type { ReportStats } from '../lib/compute-stats';
import { encodeShareParams } from '../lib/share-params';
import { ReportCard, type ReportTheme } from './report-card';
import { ThemeSelector } from './theme-selector';
import { ReportEmpty } from './report-empty';

type Props = {
  streams: Stream[];
};

function buildShareText(stats: ReportStats): string {
  const lines = [
    '白銀聖騎士団 団員レポート',
    `⚔ ${stats.streamCount}本の配信を視聴（カバー率${stats.coverageRate}%）`,
  ];
  if (stats.genreDistribution.length > 0) {
    lines.push(`🎮 最多ジャンル: ${stats.genreDistribution[0].name}`);
  }
  lines.push('', '#だんいんログ');
  return lines.join('\n');
}

export function ReportPage({ streams }: Props) {
  const stats = useReportStats(streams);
  const [theme, setTheme] = useState<ReportTheme>('light');
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isEmpty = stats.streamCount === 0;

  async function handleDownload() {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await captureCardAsDataUrl(cardRef.current);
      const date = new Date().toISOString().slice(0, 10);
      downloadImage(dataUrl, `danin-report-${date}.png`);
      track('download', { action: 'image', page: 'report' });
    } finally {
      setDownloading(false);
    }
  }

  function handleShare() {
    const text = buildShareText(stats);
    const url = `${SITE_URL}/report/s?${encodeShareParams(stats, theme)}`;
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    track('share', { action: 'x', page: 'report' });
  }

  return (
    <ShareCardLayout
      label="Activity Report"
      title="団員レポート"
      description="視聴チェック・お気に入り楽曲から、あなただけのレポートを生成します。"
      isEmpty={isEmpty}
      emptyContent={<ReportEmpty theme={theme} />}
      actions={
        <>
          <ThemeSelector theme={theme} onThemeChange={setTheme} />
          <ShareActions
            downloading={downloading}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        </>
      }
    >
      <ReportCard ref={cardRef} stats={stats} theme={theme} />
    </ShareCardLayout>
  );
}
