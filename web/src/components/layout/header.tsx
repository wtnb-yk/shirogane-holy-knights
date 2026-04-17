import Link from 'next/link';
import { getNavGroups } from './nav-items';
import { DesktopNav } from './nav-desktop';
import { MobileNav } from './nav-mobile';

export function Header() {
  const navGroups = getNavGroups();

  return (
    <header className="sticky top-0 z-100 bg-header-bg border-b border-header-border">
      <div className="mx-auto max-w-[var(--content-max)] px-md md:px-lg h-[var(--header-height)] flex items-center gap-xl">
        <Link
          href="/"
          className="font-body text-sm md:text-base font-bold text-header-text tracking-[0.02em] hover:text-white transition-colors duration-250 ease-out-expo"
        >
          だんいんログ
        </Link>
        <DesktopNav groups={navGroups} />
        <MobileNav groups={navGroups} />
      </div>
    </header>
  );
}
