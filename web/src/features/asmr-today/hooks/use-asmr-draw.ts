'use client';

import { useState, useRef, useCallback } from 'react';
import type { Stream } from '@/lib/data/types';
import type { SlotReelHandle } from './use-slot-animation';
import type { Phase } from '../types';

export function useAsmrDraw(streams: Stream[]) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<Stream | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
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

  const draw = useCallback(async () => {
    const { index, stream } = pick();
    setResult(stream);
    setTargetIndex(index);
    setPhase('spinning');

    const img = new Image();
    img.src = stream.thumbnailUrl;

    await slotRef.current?.spin(index);
    setPhase('resolved');
  }, [pick]);

  return {
    phase,
    result,
    targetIndex,
    slotRef,
    isResolved: phase === 'resolved',
    handleDraw: draw,
    handleRetry: draw,
  };
}
