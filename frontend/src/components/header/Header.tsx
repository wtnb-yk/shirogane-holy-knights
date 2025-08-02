'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-navy shadow-sm animate-fade-in">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="group">
              <h1 className="text-2xl font-bold text-white group-hover:text-sage-100 transition-colors duration-200">
                団員ポータル
              </h1>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link
              href="/videos" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 ${
                pathname === '/videos' 
                  ? 'text-brand-navy bg-white shadow-sm' 
                  : 'text-gray-300 hover:text-white hover:bg-white/20'
              }`}
            >
              配信・動画
            </Link>
          </nav>
        </div>
      </div>
      <div className="absolute bottom-2 left-0 right-0 h-[2px] bg-brand-gold"></div>
    </header>
  );
}
