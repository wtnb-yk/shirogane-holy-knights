'use client';

import { useRef, useState } from 'react';
import { ShareCardLayout } from '@/components/ui/share-card-layout';
import { ShareActions } from '@/components/ui/share-actions';
import { SITE_URL } from '@/lib/site';
import { captureCardAsDataUrl, downloadImage } from '@/lib/capture';
import { track } from '@/lib/track';
import { useFootprintStats } from '../hooks/use-footprint-stats';
import type { HeatmapData } from '../lib/compute-heatmap';
import { FootprintCard } from './footprint-card';
import { FootprintEmpty } from './footprint-empty';

function buildShareText(data: HeatmapData): string {
  const lines = [
    `団員のあしあと ${data.year}`,
    `⚔ ${data.activeDays}日の視聴記録（最長連続${data.maxStreak}日）`,
    '',
    '#だんいんログ',
  ];
  return lines.join('\n');
}

export function FootprintPage() {
  const year = new Date().getFullYear();
  const data = useFootprintStats(year);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isEmpty = data.activeDays === 0;

  async function handleDownload() {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await captureCardAsDataUrl(cardRef.current);
      downloadImage(dataUrl, `danin-footprint-${data.year}.png`);
      track('download', { action: 'image', page: 'footprint' });
    } finally {
      setDownloading(false);
    }
  }

  function handleShare() {
    const text = buildShareText(data);
    const url = `${SITE_URL}/footprint`;
    const tweetUrl = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    const a = document.createElement('a');
    a.href = tweetUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
    track('share', { action: 'x', page: 'footprint' });
  }

  return (
    <ShareCardLayout
      label="Footprint"
      title="団員のあしあと"
      description="あなたの視聴履歴をヒートマップで可視化します。"
      isEmpty={isEmpty}
      emptyContent={<FootprintEmpty />}
      actions={
        <ShareActions
          downloading={downloading}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      }
    >
      <FootprintCard ref={cardRef} data={data} />
    </ShareCardLayout>
  );
}
