'use client';

import type { Stream } from '@/lib/data/types';
import { Button } from '@/components/ui/button';
import { useAsmrDraw } from '../hooks/use-asmr-draw';
import { SlotWindow } from './slot-window';
import { SlotReel } from './slot-reel';
import { ResultInfo } from './result-info';
import { ResultActions } from './result-actions';

type Props = {
  streams: Stream[];
};

export function AsmrPage({ streams }: Props) {
  const { phase, result, slotRef, isResolved, handleDraw, handleRetry } =
    useAsmrDraw(streams);

  return (
    <div className="min-h-[calc(100dvh-var(--header-height)-80px)] flex flex-col items-center justify-center px-md md:px-lg py-xl">
      <div className="w-full max-w-[var(--slot-width)] text-center">
        <p className="font-mono text-2xs font-medium tracking-wider text-accent-label mb-sm">
          TODAY&apos;S ASMR
        </p>

        <h1 className="font-body text-xl md:text-2xl font-bold text-heading mb-sm">
          今日のASMR
        </h1>

        {phase === 'idle' && (
          <p className="text-sm text-muted max-w-[var(--slot-desc-max)] mx-auto leading-[1.8] mb-lg">
            どれを聴くか迷ったら。
            <br />
            {streams.length}
            本のASMRアーカイブからランダムで1本おすすめします。
          </p>
        )}

        <SlotWindow resolved={isResolved} resultStream={result}>
          <SlotReel ref={slotRef} streams={streams} />
        </SlotWindow>

        {result && <ResultInfo stream={result} visible={isResolved} />}

        {phase === 'idle' && (
          <div>
            <p className="font-mono text-2xs text-subtle mb-md">
              {streams.length} ASMR ARCHIVES
            </p>
            <Button
              variant="cta"
              onClick={handleDraw}
              className="gap-2.5 text-base rounded-md max-md:w-full"
            >
              <svg
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-5 h-5"
              >
                <path d="M1 9a8 8 0 0 1 14.3-4.9M17 9a8 8 0 0 1-14.3 4.9" />
                <path d="M15.3 1v3.1h-3.1M2.7 17v-3.1h3.1" />
              </svg>
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
