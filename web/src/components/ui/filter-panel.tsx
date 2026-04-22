'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onClearAll: () => void;
  children: ReactNode;
};

export function FilterPanel({ open, onClose, onClearAll, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (!ref.current) return;
      if (ref.current.offsetParent === null) return;
      if (!ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open, onClose]);

  return (
    <div
      ref={ref}
      className={`absolute top-[calc(100%+8px)] right-0 w-[var(--filter-panel-width)] max-h-[var(--filter-panel-max-h)] overflow-y-auto bg-surface border border-border rounded-md shadow-dropdown transition-all duration-200 ease-out-expo z-60 ${
        open
          ? 'opacity-100 visible translate-y-0'
          : 'opacity-0 invisible -translate-y-1 pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-between px-md pt-md pb-sm border-b border-border sticky top-0 bg-surface z-1">
        <span className="text-sm font-semibold text-heading">絞り込み</span>
        <button
          onClick={onClearAll}
          className="font-body text-xs text-muted hover:text-heading cursor-pointer transition-colors duration-250 ease-out-expo"
        >
          すべて解除
        </button>
      </div>
      {children}
    </div>
  );
}

export function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="px-md pt-sm pb-md border-b border-border last:border-b-0">
      <div className="font-mono text-3xs font-medium tracking-wide text-muted uppercase mb-sm">
        {title}
      </div>
      {children}
    </div>
  );
}

export function FilterEmptySection({
  title,
  placeholder,
}: {
  title: string;
  placeholder?: string;
}) {
  return (
    <FilterSection title={title}>
      {placeholder && (
        <input
          type="text"
          disabled
          placeholder={placeholder}
          className="w-full py-xs px-2 mb-sm bg-page border border-border rounded-sm font-body text-2xs text-heading placeholder:text-subtle outline-none opacity-50"
        />
      )}
      <p className="text-3xs text-subtle">データ準備中</p>
    </FilterSection>
  );
}
