'use client';

import { usePathname } from 'next/navigation';
import { NavigationItem } from './NavigationItem';

interface NavigationMenuItems {
  href: string;
  label: string;
}

const navigationItems: NavigationMenuItems[] = [
  { href: '/videos', label: '配信・動画' },
  { href: '/news', label: 'ニュース' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6">
      {navigationItems.map((item) => (
        <NavigationItem
          key={item.href}
          href={item.href}
          label={item.label}
          isActive={pathname === item.href}
        />
      ))}
    </nav>
  );
}