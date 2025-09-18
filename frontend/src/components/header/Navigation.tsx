'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { NavigationItem } from '@/components';

interface NavigationMenuItems {
  href: string;
  label: string;
}

const navigationItems: NavigationMenuItems[] = [
  { href: '/about', label: 'ABOUT' },
  { href: '/archives', label: 'ARCHIVE' },
  { href: '/songs', label: 'SONG' },
  { href: '/news', label: 'NEWS' },
  { href: '/calendar', label: 'CALENDAR' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* デスクトップナビゲーション */}
      <nav 
        className="hidden md:flex items-center space-x-6"
        role="navigation"
        aria-label="メインナビゲーション"
      >
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
        onKeyDown={handleKeyDown}
        className="md:hidden flex items-center justify-center w-10 h-10 p-1 rounded-md text-white hover:text-white hover:bg-bg-primary/30 transition-all duration-ui active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:ring-offset-surface-primary"
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-haspopup="true"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* オーバーレイ */}
      {mounted && isMenuOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsMenuOpen(false)}
          onKeyDown={handleKeyDown}
          aria-hidden="true"
        />,
        document.body
      )}

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 z-50 bg-surface-primary border-t border-surface-border shadow-lg"
          onKeyDown={handleKeyDown}
        >
          <nav 
            className="flex flex-col"
            role="navigation"
            aria-label="モバイルナビゲーション"
          >
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
