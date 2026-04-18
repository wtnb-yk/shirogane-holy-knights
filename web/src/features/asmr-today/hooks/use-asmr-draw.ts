'use client';

import { useState, useRef, useCallback } from 'react';
import type { Stream } from '@/lib/data/types';
import type { SlotReelHandle } from '../components/slot-reel';

type Phase = 'idle' | 'spinning' | 'resolved';

export function useAsmrDraw(streams: Stream[]) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<Stream | null>(null);
  const lastIndexRef = useRef(-1);
  const slotRef = useRef<SlotReelHandle>(null);

  const pick = useCallback(() => {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * streams.length);
    } while (idx === lastIndexRef.current && streams.length > 1);
    lastIndexRef.current = idx;
    return { index: idx, stream: streams[idx] };
  }, [streams]);

  const handleDraw = useCallback(async () => {
    const { index, stream } = pick();
    setResult(stream);
    setPhase('spinning');

    const img = new Image();
    img.src = stream.thumbnailUrl;

    await slotRef.current?.spin(index);
    setPhase('resolved');
  }, [pick]);

  const handleRetry = useCallback(async () => {
    setPhase('spinning');
    slotRef.current?.reset();

    await new Promise((r) => setTimeout(r, 100));

    const { index, stream } = pick();
    setResult(stream);

    const img = new Image();
    img.src = stream.thumbnailUrl;

    await slotRef.current?.spin(index);
    setPhase('resolved');
  }, [pick]);

  return {
    phase,
    result,
    slotRef,
    isResolved: phase === 'resolved',
    handleDraw,
    handleRetry,
  };
}
