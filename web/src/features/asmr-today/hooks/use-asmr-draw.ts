'use client';

import { useState, useRef, useCallback } from 'react';
import type { Stream } from '@/lib/data/types';
import type { SlotReelHandle } from './use-slot-animation';
import type { Phase } from '../types';

/** 日付文字列から簡易ハッシュ値を算出（全員同じ日に同じ結果を返す） */
function dailySeed(): number {
  const d = new Date();
  const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function useAsmrDraw(streams: Stream[]) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<Stream | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const isFirstDrawRef = useRef(true);
  const lastIndexRef = useRef(-1);
  const slotRef = useRef<SlotReelHandle>(null);

  const pickRandom = useCallback(() => {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * streams.length);
    } while (idx === lastIndexRef.current && streams.length > 1);
    lastIndexRef.current = idx;
    return { index: idx, stream: streams[idx] };
  }, [streams]);

  const pickDaily = useCallback(() => {
    const idx = dailySeed() % streams.length;
    lastIndexRef.current = idx;
    return { index: idx, stream: streams[idx] };
  }, [streams]);

  const draw = useCallback(async () => {
    const { index, stream } = isFirstDrawRef.current
      ? pickDaily()
      : pickRandom();
    isFirstDrawRef.current = false;

    setResult(stream);
    setTargetIndex(index);
    setPhase('spinning');

    const img = new Image();
    img.src = stream.thumbnailUrl;

    await slotRef.current?.spin(index);
    setPhase('resolved');
  }, [pickDaily, pickRandom]);

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
