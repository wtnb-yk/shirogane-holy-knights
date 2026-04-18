'use client';

import { useRef, useEffect, useImperativeHandle } from 'react';
import type { Phase } from '../types';

export type SlotReelHandle = {
  spin: (targetIndex: number) => Promise<void>;
};

const SCROLL_SPEED = 50;

type Options = {
  phase: Phase;
  itemCount: number;
  ref: React.Ref<SlotReelHandle>;
};

export function useSlotAnimation({ phase, itemCount, ref }: Options) {
  const reelRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef(0);

  const getStep = () => {
    const reel = reelRef.current;
    if (!reel?.children[0]) return 0;
    const child = reel.children[0] as HTMLElement;
    const gap = parseFloat(getComputedStyle(reel).gap) || 0;
    return child.offsetWidth + gap;
  };

  /* ---- idle: 自動スクロール ---- */
  useEffect(() => {
    if (phase !== 'idle') return;
    const reel = reelRef.current;
    if (!reel) return;

    let last: number | null = null;

    function tick(ts: number) {
      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;

      const step = getStep();
      if (step > 0) {
        const period = step * itemCount;
        posRef.current = (posRef.current + SCROLL_SPEED * dt) % period;
        reel!.style.transform = `translateX(${-posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, itemCount]);

  /* ---- spin: 加速→減速→停止 ---- */
  useImperativeHandle(ref, () => ({
    spin(target: number) {
      cancelAnimationFrame(rafRef.current);

      return new Promise<void>((resolve) => {
        const reel = reelRef.current;
        const container = reel?.parentElement;
        if (!reel || !container) return resolve();

        const step = getStep();
        if (step === 0) return resolve();

        const total = itemCount;
        const period = step * total;
        const containerW = container.offsetWidth;
        const thumbW = (reel.children[0] as HTMLElement)?.offsetWidth ?? step;
        const centerOffset = (containerW - thumbW) / 2;

        const targetPos =
          (((target * step - centerOffset) % period) + period) % period;

        const current = posRef.current;
        let dist = targetPos - current;
        while (dist < period * 2) dist += period;

        const startPos = current;
        const duration = 2200;
        let start: number | null = null;

        function animate(ts: number) {
          if (!start) start = ts;
          const t = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          const pos = startPos + eased * dist;
          reel!.style.transform = `translateX(${-(pos % period)}px)`;

          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            posRef.current = targetPos;
            reel!.style.transform = `translateX(${-targetPos}px)`;
            resolve();
          }
        }
        requestAnimationFrame(animate);
      });
    },
  }));

  return { reelRef };
}
