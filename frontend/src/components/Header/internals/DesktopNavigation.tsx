'use client';

import { NavigationItem } from './NavigationItem';

interface NavigationMenuItems {
  href: string;
  label: string;
}

interface DesktopNavigationProps {
  navigationItems: NavigationMenuItems[];
  currentPathname: string;
}

export function DesktopNavigation({ navigationItems, currentPathname }: DesktopNavigationProps) {
  return (
    <nav
      className="hidden lg:flex items-center space-x-3 xl:space-x-4"
      role="navigation"
      aria-label="メインナビゲーション"
    >
      {navigationItems.map((item) => (
        <NavigationItem
          key={item.href}
          href={item.href}
          label={item.label}
          isActive={currentPathname === item.href}
          isMobile={false}
        />
      ))}
    </nav>
  );
}
