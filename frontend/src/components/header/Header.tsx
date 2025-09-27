'use client';

import Link from 'next/link';
import { Navigation } from '@/components';
import { TAILWIND_Z_INDEX } from '@/constants/zIndex';

export function Header() {

  return (
    <header 
      className={`fixed top-0 left-0 right-0 ${TAILWIND_Z_INDEX.CONTENT.HEADER} bg-surface-primary shadow-sm animate-fade-in`}
      role="banner"
    >
      <div className="w-full py-3 px-10 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="group focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:ring-offset-surface-primary rounded-md"
              aria-label="だんいんポータル ホームページへ"
            >
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-bg-accent transition-colors duration-200">
                だんいんポータル
              </h1>
            </Link>
          </div>
          
          <Navigation />
        </div>
      </div>
      <div className="absolute bottom-2 left-0 right-0 h-[2px] bg-accent-gold" aria-hidden="true"></div>
    </header>
  );
}
