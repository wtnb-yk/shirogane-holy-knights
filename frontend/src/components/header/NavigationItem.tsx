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
          ? 'text-shirogane-surface-primary bg-white shadow-sm'
          : 'text-gray-300 hover:text-white hover:bg-white/20'
      }`}
    >
      {label}
    </Link>
  );
}