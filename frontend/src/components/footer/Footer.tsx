'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-surface-border mt-auto">
      <div className="w-full pt-6 pb-4 px-4 sm:px-6 lg:pt-10 lg:pb-5 lg:px-10">
        <div className="max-w-full mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-12">
            {/* 左側：サイト情報（デスクトップのみ） */}
            <div className="hidden lg:block flex-none lg:w-[450px]">
              <div className="mb-4 lg:mb-6">
                <h3 className="text-lg font-normal text-surface-primary mb-2">
                  白銀ノエル 非公式ファンサイト<br />
                  だんいんポータル
                </h3>
              </div>
            </div>
            
            {/* 右側：リンク2列（タブレット以下では非表示） */}
            <div className="hidden lg:flex flex-col lg:flex-row gap-6 lg:gap-20">
              {/* サイトマップ */}
              <div className="min-w-36">
                <h4 className="text-sm font-normal text-surface-primary mb-4">サイトマップ</h4>
                <ul className="space-y-2.5">
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
                  <li>
                    <Link href="/news" className="text-xs text-surface-primary/70 hover:text-accent-primary transition-colors">
                      NEWS
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* 公式リンク */}
              <div className="min-w-36">
                <h4 className="text-sm font-normal text-surface-primary mb-3">公式リンク</h4>
                <ul className="space-y-2">
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
