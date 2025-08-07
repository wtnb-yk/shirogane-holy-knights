'use client';

import Link from 'next/link';

interface NavigationItemProps {
  href: string;
  label: string;
  isActive: boolean;
}

export function NavigationItem({ href, label, isActive }: NavigationItemProps) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 ${
        isActive
          ? 'text-shirogane-surface-primary bg-shirogane-bg-primary shadow-sm'
          : 'text-shirogane-text-muted hover:text-white hover:bg-shirogane-bg-primary/20'
      }`}
    >
      {label}
    </Link>
  );
}