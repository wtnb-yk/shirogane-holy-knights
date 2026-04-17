import Link from 'next/link';
import type { NavGroup } from './nav-items';

export function MobileNav({ groups }: { groups: readonly NavGroup[] }) {
  return (
    <div className="md:hidden group/mobile relative">
      <button className="flex flex-col justify-center gap-[5px] w-10 h-10 items-center bg-transparent border-none cursor-pointer">
        <span className="block w-5 h-[1.5px] bg-header-text rounded-full transition-all duration-250 ease-out-expo group-focus-within/mobile:translate-y-[6.5px] group-focus-within/mobile:rotate-45" />
        <span className="block w-5 h-[1.5px] bg-header-text rounded-full transition-all duration-250 ease-out-expo group-focus-within/mobile:opacity-0" />
        <span className="block w-5 h-[1.5px] bg-header-text rounded-full transition-all duration-250 ease-out-expo group-focus-within/mobile:-translate-y-[6.5px] group-focus-within/mobile:-rotate-45" />
      </button>
      <div className="absolute top-[calc(100%+8px)] right-0 w-[var(--dropdown-width)] bg-surface border border-border rounded-md p-sm shadow-dropdown opacity-0 invisible -translate-y-1 transition-all duration-200 ease-out-expo pointer-events-none group-focus-within/mobile:opacity-100 group-focus-within/mobile:visible group-focus-within/mobile:translate-y-0 group-focus-within/mobile:pointer-events-auto">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-md pt-sm pb-xs font-mono text-[10px] font-medium tracking-[0.14em] uppercase text-accent-label">
              {group.label}
            </div>
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
        ))}
      </div>
    </div>
  );
}
