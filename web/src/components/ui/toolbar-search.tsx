'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  children: (
    openSearch: () => void,
    inlineInput: ReactNode | null,
  ) => ReactNode;
};

function InlineInput({
  value,
  onChange,
  onClear,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  placeholder: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex items-center">
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
        className="w-(--search-expanded-width) border border-border bg-page font-body text-xs text-heading rounded-sm py-xs pl-sm pr-7 outline-none placeholder:text-subtle focus:border-border-strong focus:bg-surface"
      />
      {value.length > 0 && (
        <button
          onClick={() => {
            onClear();
            ref.current?.focus();
          }}
          className="absolute right-sm top-1/2 -translate-y-1/2 text-muted hover:text-heading cursor-pointer"
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
  );
}

function MobileInput({
  value,
  onChange,
  onClose,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  placeholder: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-xs py-xs md:hidden">
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
        className="flex-1 min-w-0 border border-border bg-page font-body text-xs text-heading rounded-sm py-xs px-sm outline-none placeholder:text-subtle focus:border-border-strong focus:bg-surface"
      />
      <button
        onClick={onClose}
        className="shrink-0 w-9 h-9 flex items-center justify-center text-muted hover:text-heading cursor-pointer"
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
  );
}

export function ToolbarSearch({
  value,
  onChange,
  placeholder = '検索...',
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => setOpen(true), []);

  const closeSearch = useCallback(() => {
    onChange('');
    setOpen(false);
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const inlineInput = open ? (
    <InlineInput
      value={value}
      onChange={onChange}
      onClear={handleClear}
      placeholder={placeholder}
    />
  ) : null;

  return (
    <>
      {open && (
        <MobileInput
          value={value}
          onChange={onChange}
          onClose={closeSearch}
          placeholder={placeholder}
        />
      )}

      <div className={open ? 'hidden md:block' : ''}>
        {children(openSearch, inlineInput)}
      </div>
    </>
  );
}
