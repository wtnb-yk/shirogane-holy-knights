'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DesktopNavigation } from '@/components';
import { HamburgerButton } from '@/components';
import { MobileMenu } from './MobileMenu';
import { NavigationOverlay } from '@/components/ui/Overlay';

interface NavigationMenuItems {
  href: string;
  label: string;
}

const navigationItems: NavigationMenuItems[] = [
  { href: '/about', label: 'ABOUT' },
  { href: '/archives', label: 'ARCHIVE' },
  { href: '/songs', label: 'SONG' },
  // { href: '/discography', label: 'DISCOGRAPHY' },
  { href: '/news', label: 'NEWS' },
  { href: '/calendar', label: 'CALENDAR' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle keyboard navigation (ESC key handling is now in NavigationOverlay)
  const handleKeyDown = () => {
    // Other keyboard handling if needed
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
      <NavigationOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        portal={true}
      />

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
