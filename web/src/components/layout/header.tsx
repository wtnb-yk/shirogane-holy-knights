import Link from 'next/link';
import { NAV_GROUPS } from './nav-items';
import { DesktopNav } from './nav-desktop';
import { MobileNav } from './nav-mobile';

export function Header() {
  return (
    <header className="sticky top-0 z-100 bg-header-bg border-b border-header-border">
      <div className="mx-auto max-w-[var(--content-max)] px-lg h-[var(--header-height)] flex items-center gap-xl">
        <Link
          href="/"
          className="font-body text-base font-bold text-header-text tracking-[0.02em] hover:text-white transition-colors duration-250 ease-out-expo"
        >
          だんいんログ
        </Link>
        <DesktopNav groups={NAV_GROUPS} />
        <MobileNav groups={NAV_GROUPS} />
      </div>
    </header>
  );
}
