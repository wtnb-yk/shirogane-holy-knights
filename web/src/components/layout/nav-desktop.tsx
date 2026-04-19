'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useClickOutside } from '@/hooks/use-click-outside';
import type { NavGroup } from './nav-items';

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3 h-3 opacity-50 transition-transform duration-250 ease-out-expo ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 5l3 3 3-3" />
    </svg>
  );
}

function NavDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(open, close);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-sm py-xs font-body text-sm font-medium text-header-text bg-transparent border-none rounded-sm cursor-pointer hover:text-white hover:bg-white/8 transition-all duration-250 ease-out-expo"
      >
        {group.label}
        <ChevronDown open={open} />
      </button>
      <div
        className={`absolute top-[calc(100%+4px)] right-0 min-w-(--dropdown-width) bg-surface border border-border rounded-md p-sm shadow-dropdown transition-all duration-200 ease-out-expo ${
          open
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-1 pointer-events-none'
        }`}
      >
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
    </div>
  );
}

export function DesktopNav({ groups }: { groups: readonly NavGroup[] }) {
  return (
    <nav className="hidden md:flex items-center gap-xs">
      {groups.map((group) => (
        <NavDropdown key={group.label} group={group} />
      ))}
    </nav>
  );
}
