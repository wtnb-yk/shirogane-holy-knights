'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-surface-border mt-auto">
      <div className="max-w-7xl mx-auto py-3 sm:py-5 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 lg:gap-8">
          {/* 左側：サイト情報 */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">団員ポータル</h3>
            <p className="text-sm text-text-primary/80">
              当サイトはホロライブ3期生白銀ノエル団長を応援する非公式ファンサイトです。ご本人様およびカバー株式会社様、ホロライブプロダクション様は当サイトの運営には一切関わっておりません。<br />
              また、著作権法第32条に基づき画像等を引用しておりますが、引用した画像等の著作権・肖像権等は各権利者に帰属いたします。
            </p>
            <a 
              href="https://hololivepro.com/terms/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-primary/80 hover:text-text-primary transition-colors inline-block mt-2"
            >
              カバー株式会社様　二次創作ガイドライン
            </a>
          </div>
          
          {/* 中央：リンク - モバイルでは横並び */}
          <div className="md:block">
            <h4 className="text-sm font-semibold text-text-primary mb-1 md:mb-2">サイトマップ</h4>
            <ul className="flex md:flex-col gap-4 md:gap-0 md:space-y-2">
              <li>
                <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  ARCHIVE
                </Link>
              </li>
              <li>
                <Link href="/songs" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  SONG
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  NEWS
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 右側：外部リンク - モバイルでは横並び */}
          <div className="md:block">
            <h4 className="text-sm font-semibold text-text-primary mb-1 md:mb-2">公式リンク</h4>
            <ul className="flex md:flex-col gap-4 md:gap-0 md:space-y-2">
              <li>
                <a 
                  href="https://www.youtube.com/@ShiroganeNoel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com/shiroganenoel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 下部：コピーライト */}
        <div className="mt-3 sm:mt-5 lg:mt-8 pt-2 sm:pt-3 lg:pt-6 border-t border-surface-border">
          <p className="text-center text-sm text-text-muted">
            &copy; 2025 だんいんポータル
          </p>
        </div>
      </div>
    </footer>
  );
}
