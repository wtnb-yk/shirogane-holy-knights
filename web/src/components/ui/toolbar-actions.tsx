'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type IconButtonProps = {
  title: string;
  onClick?: () => void;
  badge?: number;
  className?: string;
  children: ReactNode;
};

export function ToolbarIconButton({
  title,
  onClick,
  badge,
  className = '',
  children,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-9 h-9 flex items-center justify-center text-muted hover:text-heading hover:bg-surface-hover rounded-sm cursor-pointer transition-all duration-250 ease-out-expo ${className}`}
      title={title}
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] px-1 bg-accent text-white font-mono text-3xs font-semibold rounded-full text-center leading-[14px]">
          {badge}
        </span>
      )}
    </button>
  );
}

type ExpandableSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function ExpandableSearch({
  value,
  onChange,
  placeholder = '検索...',
}: ExpandableSearchProps) {
  const [userOpen, setUserOpen] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  // テキストがあれば常に開いた状態を維持
  const expanded = userOpen || value.length > 0;

  useEffect(() => {
    if (expanded) ref.current?.focus();
  }, [expanded]);

  const handleToggle = () => {
    if (expanded && value.length > 0) {
      // テキストがある状態で閉じる → クリアして閉じる
      onChange('');
      setUserOpen(false);
    } else {
      setUserOpen((o) => !o);
    }
  };

  const handleClear = () => {
    onChange('');
    ref.current?.focus();
  };

  return (
    <div className="relative flex items-center">
      <div className="relative">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`border bg-page font-body text-xs text-heading rounded-sm outline-none transition-all duration-300 ease-out-expo placeholder:text-subtle focus:border-border-strong focus:bg-surface ${
            expanded
              ? 'w-[var(--search-expanded-width)] py-1.5 pl-2.5 pr-7 opacity-100 border-border mr-1'
              : 'w-0 p-0 opacity-0 border-transparent'
          }`}
        />
        {expanded && value.length > 0 && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-heading cursor-pointer"
            title="クリア"
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2 2l8 8M10 2l-8 8" />
            </svg>
          </button>
        )}
      </div>
      <ToolbarIconButton title="検索" onClick={handleToggle}>
        <svg
          className="w-4 h-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3.5 3.5" />
        </svg>
      </ToolbarIconButton>
    </div>
  );
}
