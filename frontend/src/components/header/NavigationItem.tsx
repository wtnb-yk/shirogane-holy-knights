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
      className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-ui hover:scale-105 hover:-translate-y-0.5 ${
        isActive
          ? 'text-surface-primary bg-bg-primary shadow-sm'
          : 'text-text-light hover:text-white hover:bg-bg-primary/20'
      }`}
    >
      {label}
    </Link>
  );
}