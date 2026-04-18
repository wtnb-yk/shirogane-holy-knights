'use client';

import type { Stream } from '@/lib/data/types';
import type { Phase } from '../types';
import {
  useSlotAnimation,
  type SlotReelHandle,
} from '../hooks/use-slot-animation';

export type { SlotReelHandle };

type Props = {
  streams: Stream[];
  phase: Phase;
  targetIndex: number | null;
  ref: React.Ref<SlotReelHandle>;
};

export function SlotReel({ streams, phase, targetIndex, ref }: Props) {
  const { reelRef } = useSlotAnimation({
    phase,
    itemCount: streams.length,
    ref,
  });

  const items = [...streams, ...streams];

  return (
    <div ref={reelRef} className="flex gap-md">
      {items.map((stream, i) => {
        const idx = i % streams.length;
        const isTarget = phase === 'resolved' && idx === targetIndex;

        return (
          <div
            key={`${stream.id}-${i}`}
            className={`shrink-0 w-80 md:w-96 aspect-video rounded-lg overflow-hidden relative transition-opacity duration-500 ${
              isTarget
                ? 'shadow-slot-glow opacity-100'
                : phase === 'resolved'
                  ? 'opacity-25'
                  : ''
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={stream.thumbnailUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {isTarget && (
              <a
                href={`https://www.youtube.com/watch?v=${stream.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-colors duration-300 ease-out-expo hover:bg-white/25">
                  <svg
                    className="w-5 h-5 text-white ml-0.5"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M4 2l10 6-10 6z" />
                  </svg>
                </div>
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
