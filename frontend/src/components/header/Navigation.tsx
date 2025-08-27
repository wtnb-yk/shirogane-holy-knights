'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { NavigationItem } from './NavigationItem';

interface NavigationMenuItems {
  href: string;
  label: string;
}

const navigationItems: NavigationMenuItems[] = [
  { href: '/videos', label: 'ARCHIVE' },
  { href: '/songs', label: 'SONG' },
  { href: '/news', label: 'NEWS' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* デスクトップナビゲーション */}
      <nav className="hidden md:flex items-center space-x-6">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.href}
            href={item.href}
            label={item.label}
            isActive={pathname === item.href}
            isMobile={false}
          />
        ))}
      </nav>

      {/* モバイルハンバーガーボタン */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex items-center justify-center w-10 h-10 p-1 rounded-md text-white hover:text-white hover:bg-bg-primary/30 transition-all duration-ui active:scale-95"
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface-primary border-t border-surface-border shadow-lg">
          <nav className="flex flex-col">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={pathname === item.href}
                isMobile={true}
                onClick={() => setIsMenuOpen(false)}
              />
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
