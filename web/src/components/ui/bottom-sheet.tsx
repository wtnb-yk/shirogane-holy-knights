'use client';

import type { ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  headerRight?: ReactNode;
  children: ReactNode;
};

export function BottomSheet({
  open,
  onClose,
  title,
  headerRight,
  children,
}: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-backdrop z-50 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-md shadow-dropdown transition-transform duration-300 ease-out-expo max-h-[var(--bottom-sheet-max-h)] ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between px-md pt-md pb-sm border-b border-border">
          <span className="text-sm font-semibold text-heading">{title}</span>
          <div className="flex items-center gap-sm">
            {headerRight}
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center text-muted hover:text-heading cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[calc(var(--bottom-sheet-max-h)-52px)]">
          {children}
        </div>
      </div>
    </>
  );
}
