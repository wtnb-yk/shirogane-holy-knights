'use client';

import { useRef, useState } from 'react';
import type { Stream } from '@/lib/data/types';
import { ShareCardLayout } from '@/components/ui/share-card-layout';
import { ShareActions } from '@/components/ui/share-actions';
import { SITE_URL } from '@/lib/site';
import { captureCardAsDataUrl, downloadImage } from '@/lib/capture';
import { useFootprintStats } from '../hooks/use-footprint-stats';
import type { HeatmapData } from '../lib/compute-heatmap';
import { FootprintCard } from './footprint-card';
import { FootprintEmpty } from './footprint-empty';

type Props = {
  streams: Stream[];
};

function buildShareText(data: HeatmapData): string {
  const lines = [
    `団員のあしあと ${data.year}`,
    `⚔ ${data.activeDays}日の視聴記録（最長連続${data.maxStreak}日）`,
    '',
    '#だんいんログ #白銀ノエル',
  ];
  return lines.join('\n');
}

export function FootprintPage({ streams }: Props) {
  const year = new Date().getFullYear();
  const data = useFootprintStats(streams, year);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isEmpty = data.activeDays === 0;

  async function handleDownload() {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await captureCardAsDataUrl(cardRef.current);
      downloadImage(dataUrl, `danin-footprint-${data.year}.png`);
    } finally {
      setDownloading(false);
    }
  }

  function handleShare() {
    const text = buildShareText(data);
    const url = `${SITE_URL}/footprint`;
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
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
