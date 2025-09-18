'use client';

import Link from 'next/link';

interface NavigationItemProps {
  href: string;
  label: string;
  isActive: boolean;
  isMobile: boolean;
  onClick?: () => void;
}

export function NavigationItem({ href, label, isActive, isMobile, onClick }: NavigationItemProps) {
  if (isMobile) {
    return (
      <Link
        href={href}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick?.();
          window.location.href = href;
        }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        className={`block px-4 py-3 text-base font-medium border-b border-surface-border/50 transition-colors duration-ui focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-inset ${
          isActive
            ? 'text-bg-primary bg-accent-gold'
            : 'text-text-light hover:text-white hover:bg-bg-primary/10'
        }`}
        style={{ touchAction: 'manipulation' }}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm sm:text-base font-medium transition-all duration-ui hover:scale-105 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:ring-offset-surface-primary ${
        isActive
          ? 'text-surface-primary bg-bg-primary shadow-sm'
          : 'text-text-light hover:text-white hover:bg-bg-primary/20'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </Link>
  );
}