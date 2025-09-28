'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-surface-border mt-auto">
      <div className="w-full pt-4 pb-4 pb-safe px-4 sm:px-6 lg:pt-8 lg:pb-5 lg:px-10">
        <div className="max-w-full mx-auto">
          {/* サイト情報（デスクトップのみ） */}
          <div className="hidden lg:block mb-6">
            <h3 className="text-base font-normal text-surface-primary mb-4">
              白銀ノエル 非公式ファンサイト<br />
              だんいんポータル
            </h3>
            
            {/* サイトマップと公式リンクを横並び */}
            <div className="flex flex-row gap-20">
              {/* サイトマップ */}
              <div className="flex items-baseline gap-3">
                <h4 className="text-sm font-normal text-surface-primary">サイトマップ</h4>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  <li>
                    <Link href="/" className="text-xs text-surface-primary/70 hover:text-accent-primary transition-colors">
                      HOME
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-xs text-surface-primary/70 hover:text-accent-primary transition-colors">
                      ABOUT
                    </Link>
                  </li>
                  <li>
                    <Link href="/archives" className="text-xs text-surface-primary/70 hover:text-accent-primary transition-colors">
                      ARCHIVE
                    </Link>
                  </li>
                  <li>
                    <Link href="/songs" className="text-xs text-surface-primary/70 hover:text-accent-primary transition-colors">
                      SONG
                    </Link>
                  </li>
                  {/*<li>*/}
                  {/*  <Link href="/discography" className="text-xs text-surface-primary/70 hover:text-accent-primary transition-colors">*/}
                  {/*    DISCOGRAPHY*/}
                  {/*  </Link>*/}
                  {/*</li>*/}
                  <li>
                    <Link href="/news" className="text-xs text-surface-primary/70 hover:text-accent-primary transition-colors">
                      NEWS
                    </Link>
                  </li>
                  <li>
                    <Link href="/calendar" className="text-xs text-surface-primary/70 hover:text-accent-primary transition-colors">
                      CALENDAR
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* 公式リンク */}
              <div className="flex items-baseline gap-3">
                <h4 className="text-sm font-normal text-surface-primary">公式リンク</h4>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  <li>
                    <a 
                      href="https://www.youtube.com/@ShiroganeNoel" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-surface-primary/70 hover:text-accent-primary transition-colors"
                    >
                      YouTube
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://x.com/shiroganenoel"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-surface-primary/70 hover:text-accent-primary transition-colors"
                    >
                      X (Twitter)
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 下部：コピーライト */}
          <div className="lg:mt-2 lg:pt-2 lg:border-t lg:border-surface-border">
            <p className="text-center text-xs text-surface-primary/50">
              &copy; 2025 だんいんポータル
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
