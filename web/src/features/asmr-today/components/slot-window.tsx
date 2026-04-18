import type { ReactNode } from 'react';
import type { Stream } from '@/lib/data/types';

type Props = {
  resolved: boolean;
  resultStream: Stream | null;
  children: ReactNode;
};

export function SlotWindow({ resolved, resultStream, children }: Props) {
  return (
    <div
      className={`w-full aspect-video rounded-lg overflow-hidden relative mb-xl transition-shadow duration-300 ease-out-expo ${
        resolved ? 'shadow-slot-glow' : 'shadow-slot'
      }`}
      style={{ background: 'var(--slot-bg)' }}
    >
      {children}

      {resolved && resultStream && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultStream.thumbnailUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover animate-fade-in"
          />
          <a
            href={`https://www.youtube.com/watch?v=${resultStream.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center z-10 cursor-pointer transition-colors duration-300 ease-out-expo hover:bg-white/25 animate-fade-in"
          >
            <svg
              className="w-5 h-5 text-white ml-0.5"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M4 2l10 6-10 6z" />
            </svg>
          </a>
        </>
      )}
    </div>
  );
}
