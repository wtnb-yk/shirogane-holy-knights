'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  /** チップに表示する現在の選択ラベル */
  label: string;
  /** ドロップダウン内のコンテンツ。close を呼ぶとメニューが閉じる */
  children: (close: () => void) => ReactNode;
};

export function ChipSelect({ label, children }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-xs px-sm py-xs border rounded-sm font-body text-xs cursor-pointer transition-all duration-200 ease-out-expo ${
          open
            ? 'bg-surface border-border-strong text-heading'
            : 'bg-page border-border text-heading hover:border-border-hover'
        }`}
      >
        {label}
        <svg
          className={`w-3 h-3 text-muted transition-transform duration-200 ease-out-expo ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 5l3 3 3-3" />
        </svg>
      </button>
      <div
        className={`absolute top-[calc(100%+4px)] left-0 min-w-[160px] bg-surface border border-border rounded-md shadow-dropdown z-60 transition-all duration-200 ease-out-expo ${
          open
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-1 pointer-events-none'
        }`}
      >
        {children(() => setOpen(false))}
      </div>
    </div>
  );
}
