'use client';

import type { Stream } from '@/lib/data/types';
import { Button } from '@/components/ui/button';
import { useAsmrDraw } from '../hooks/use-asmr-draw';
import { SlotReel } from './slot-reel';
import { ResultInfo } from './result-info';
import { ResultActions } from './result-actions';
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

  return (
    <div className="min-h-[calc(100dvh-var(--header-height)-var(--page-bottom-margin))] flex flex-col items-center justify-center py-xl">
      {/* ---- ヘッダー ---- */}
      <div className="text-center px-md md:px-lg mb-lg">
        <p className="font-mono text-2xs font-medium tracking-wider text-accent-label mb-sm">
          TODAY&apos;S ASMR
        </p>
        <h1 className="font-body text-xl md:text-2xl font-bold text-heading mb-sm">
          今日のASMR
        </h1>
        {phase === 'idle' && (
          <p className="text-sm text-muted max-w-[var(--slot-desc-max)] mx-auto leading-relaxed-plus">
            どれを聴くか迷ったら。
            <br />
            {streams.length}
            本のASMRアーカイブからランダムで1本おすすめします。
          </p>
        )}
      </div>

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
          <ResultActions stream={result} onRetry={handleRetry} />
        )}
      </div>
    </div>
  );
}
