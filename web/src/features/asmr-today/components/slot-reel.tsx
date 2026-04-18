'use client';

import { useRef, useImperativeHandle } from 'react';
import type { Stream } from '@/lib/data/types';

const SLIDE_BG_VARS = [
  'var(--slot-slide-bg-1)',
  'var(--slot-slide-bg-2)',
  'var(--slot-slide-bg-3)',
  'var(--slot-slide-bg-4)',
  'var(--slot-slide-bg-5)',
  'var(--slot-slide-bg-6)',
];

function stripBrackets(title: string): string {
  return title.replace(/【.*?】/g, '').trim();
}

export type SlotReelHandle = {
  spin: (targetIndex: number) => Promise<void>;
  reset: () => void;
};

type Props = {
  streams: Stream[];
  ref: React.Ref<SlotReelHandle>;
};

export function SlotReel({ streams, ref }: Props) {
  const reelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  useImperativeHandle(ref, () => ({
    spin(targetIndex: number) {
      return new Promise<void>((resolve) => {
        const reel = reelRef.current;
        const container = containerRef.current ?? reel?.parentElement;
        if (!reel || !container) return resolve();

        const slideH = container.offsetHeight;
        const total = streams.length;
        const dist = (total * 2 + targetIndex) * slideH;
        const duration = 1800;
        let start: number | null = null;

        function animate(ts: number) {
          if (!start) start = ts;
          const t = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          const pos = eased * dist;
          reel!.style.transform = `translateY(${-(pos % (total * slideH))}px)`;

          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            reel!.style.transform = `translateY(${-(targetIndex * slideH)}px)`;
            resolve();
          }
        }

        requestAnimationFrame(animate);
      });
    },

    reset() {
      if (reelRef.current) {
        reelRef.current.style.transform = 'translateY(0)';
      }
    },
  }));

  return (
    <div ref={reelRef} className="absolute inset-0 flex flex-col">
      {streams.map((stream, i) => (
        <div
          key={stream.id}
          className="w-full shrink-0 aspect-video flex items-center justify-center"
          style={{ background: SLIDE_BG_VARS[i % SLIDE_BG_VARS.length] }}
        >
          <span className="font-body text-sm font-medium text-white/50 text-center px-xl leading-[1.5]">
            {stripBrackets(stream.title)}
          </span>
        </div>
      ))}
    </div>
  );
}
