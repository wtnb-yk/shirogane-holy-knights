'use client';

import { NavigationItem } from '@/components';

interface NavigationMenuItems {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationMenuItems[];
  currentPathname: string;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  navigationItems,
  currentPathname,
  onKeyDown
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-menu"
      className="lg:hidden absolute top-full left-0 right-0 z-50 bg-surface-primary border-t border-surface-border shadow-lg animate-slide-down max-h-[calc(100vh-80px)] overflow-y-auto"
      onKeyDown={onKeyDown}
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
            isActive={currentPathname === item.href}
            isMobile={true}
            onClick={onClose}
          />
        ))}
      </nav>
    </div>
  );
}
