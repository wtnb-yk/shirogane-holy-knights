'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { DesktopNavigation } from '@/components';
import { HamburgerButton } from '@/components';
import { MobileMenu } from './MobileMenu';
import { Overlay } from './Overlay';

interface NavigationMenuItems {
  href: string;
  label: string;
}

const navigationItems: NavigationMenuItems[] = [
  { href: '/about', label: 'ABOUT' },
  { href: '/archives', label: 'ARCHIVE' },
  { href: '/songs', label: 'SONG' },
  { href: '/discography', label: 'DISCOGRAPHY' },
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
      <DesktopNavigation
        navigationItems={navigationItems}
        currentPathname={pathname}
      />

      <HamburgerButton
        isOpen={isMenuOpen}
        onClick={toggleMenu}
        onKeyDown={handleKeyDown}
      />

      {/* オーバーレイ */}
      {mounted && createPortal(
        <Overlay
          isVisible={isMenuOpen}
          onClick={() => setIsMenuOpen(false)}
          onKeyDown={handleKeyDown}
        />,
        document.body
      )}

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navigationItems={navigationItems}
        currentPathname={pathname}
        onKeyDown={handleKeyDown}
      />
    </>
  );
}
