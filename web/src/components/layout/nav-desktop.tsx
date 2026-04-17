import Link from 'next/link';
import type { NavGroup } from './nav-items';

function ChevronDown() {
  return (
    <svg
      className="w-3 h-3 opacity-50 transition-transform duration-250 ease-out-expo group-hover:rotate-180"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 5l3 3 3-3" />
    </svg>
  );
}

export function DesktopNav({ groups }: { groups: readonly NavGroup[] }) {
  return (
    <nav className="hidden md:flex items-center gap-xs ml-auto">
      {groups.map((group) => (
        <div key={group.label} className="group relative">
          <button className="flex items-center gap-1 px-3.5 py-1.5 font-body text-sm font-medium text-header-text bg-transparent border-none rounded-sm cursor-pointer hover:text-white hover:bg-white/8 transition-all duration-250 ease-out-expo">
            {group.label}
            <ChevronDown />
          </button>
          <div className="absolute top-[calc(100%+4px)] right-0 min-w-[var(--dropdown-width)] bg-surface border border-border rounded-md p-sm shadow-dropdown opacity-0 invisible -translate-y-1 transition-all duration-200 ease-out-expo pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto before:content-[''] before:absolute before:inset-x-0 before:-top-2 before:h-2">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
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
      ))}
    </nav>
  );
}
