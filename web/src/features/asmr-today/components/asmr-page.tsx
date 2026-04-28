'use client';

import { useRef, useState } from 'react';
import type { Stream } from '@/lib/data/types';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { captureCardAsDataUrl, downloadImage } from '@/lib/capture';
import { track } from '@/lib/track';
import { useAsmrDraw } from '../hooks/use-asmr-draw';
import { SlotReel } from './slot-reel';
import { ResultInfo } from './result-info';
import { ResultActions } from './result-actions';
import { AsmrShareCard } from './asmr-share-card';
import { RetryIcon } from './icons';

type Props = {
  streams: Stream[];
};

export function AsmrPage({ streams }: Props) {
  const {
    phase,
    result,
    targetIndex,
    slotRef,
    isResolved,
    handleDraw,
    handleRetry,
  } = useAsmrDraw(streams);
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await captureCardAsDataUrl(cardRef.current);
      downloadImage(dataUrl, 'danin-asmr-today.png');
      track('download', { action: 'image', page: 'asmr' });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-var(--header-height)-var(--page-bottom-margin))] flex flex-col items-center justify-center py-xl">
      {/* ---- ヘッダー ---- */}
      <SectionHeader
        label="TODAY'S ASMR"
        title="今日のASMR"
        description={
          phase === 'idle' ? (
            <>
              どれを聴くか迷ったら。
              <br />
              {streams.length}
              本のASMRアーカイブからランダムで1本おすすめします。
            </>
          ) : undefined
        }
      />

      {/* ---- リール（画面幅いっぱい） ---- */}
      <div className="w-screen overflow-hidden relative mb-xl">
        <div className="absolute inset-y-0 left-0 w-12 md:w-20 bg-gradient-to-r from-page to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-20 bg-gradient-to-l from-page to-transparent z-10 pointer-events-none" />

        <SlotReel
          ref={slotRef}
          streams={streams}
          phase={phase}
          targetIndex={targetIndex}
        />
      </div>

      {/* ---- 情報・アクション ---- */}
      <div className="w-full max-w-[var(--slot-width)] text-center px-md md:px-lg">
        {result && <ResultInfo stream={result} visible={isResolved} />}

        {phase === 'idle' && (
          <div>
            <p className="font-mono text-2xs text-subtle mb-md">
              {streams.length} ASMR ARCHIVES
            </p>
            <Button
              variant="cta"
              onClick={handleDraw}
              className="gap-xs text-base rounded-md max-md:w-full"
            >
              <RetryIcon />
              今日のASMRを選ぶ
            </Button>
          </div>
        )}

        {isResolved && result && (
          <>
            <ResultActions
              stream={result}
              downloading={downloading}
              onDownload={handleDownload}
              onRetry={handleRetry}
            />
            {/* 画像キャプチャ用（非表示） */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <AsmrShareCard ref={cardRef} stream={result} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
