'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useClickOutside } from '@/hooks/use-click-outside';
import type { NavGroup } from './nav-items';

export function MobileNav({ groups }: { groups: readonly NavGroup[] }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(open, close);

  return (
    <div ref={ref} className="md:hidden relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex flex-col justify-center gap-xs w-10 h-10 items-center bg-transparent border-none cursor-pointer"
      >
        <span
          className={`block w-5 h-[1.5px] bg-header-text rounded-full transition-all duration-250 ease-out-expo ${
            open ? 'translate-y-[6.5px] rotate-45' : ''
          }`}
        />
        <span
          className={`block w-5 h-[1.5px] bg-header-text rounded-full transition-all duration-250 ease-out-expo ${
            open ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-5 h-[1.5px] bg-header-text rounded-full transition-all duration-250 ease-out-expo ${
            open ? '-translate-y-[6.5px] -rotate-45' : ''
          }`}
        />
      </button>
      <div
        className={`absolute top-[calc(100%+8px)] right-0 w-(--dropdown-width) bg-surface border border-border rounded-md p-sm shadow-dropdown transition-all duration-200 ease-out-expo ${
          open
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-1 pointer-events-none'
        }`}
      >
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-md pt-sm pb-xs font-mono text-3xs font-medium tracking-wider uppercase text-accent-label">
              {group.label}
            </div>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="flex flex-col gap-0.5 px-md py-sm rounded-sm hover:bg-surface-hover transition-colors duration-250 ease-out-expo"
              >
                <span className="text-sm font-semibold text-heading">
                  {item.name}
                </span>
                <span className="text-xs text-muted leading-normal">
                  {item.desc}
                </span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
