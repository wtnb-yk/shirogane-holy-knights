'use client';

import { NavigationItem } from '@/components';
import { TAILWIND_Z_INDEX } from '@/constants/zIndex';

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
    <>
      <div
        id="mobile-menu"
        className={`lg:hidden absolute top-full left-0 right-0 ${TAILWIND_Z_INDEX.CONTENT.HEADER} bg-surface-primary border-t border-surface-border shadow-lg animate-slide-down max-h-[calc(100vh-80px)] overflow-y-auto`}
        onKeyDown={onKeyDown}
        style={{ pointerEvents: 'auto' }}
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
    </>
  );
}
