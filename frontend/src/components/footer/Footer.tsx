'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-surface-border mt-auto">
      <div className="w-full py-6 sm:py-8 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
            {/* 左側：サイト情報 */}
            <div className="md:col-span-1 lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-text-primary mb-5">
                  白銀ノエル<br />
                  非公式ポータル
                </h3>
                <div className="text-sm text-text-primary/80 leading-relaxed mb-5">
                  <p className="mb-3">
                    ※当サイトは、ホロライブプロダクション所属VTuber 白銀ノエルさんを応援する非公式サイトです。
                  </p>
                  <p className="mb-3">
                    ※カバー株式会社様、ホロライブプロダクション様とは一切関係ありません。
                  </p>
                  <p>
                    ※当サイトで使用している画像の著作権・肖像権等は各権利者に帰属いたします。
                  </p>
                </div>
                <a 
                  href="https://hololivepro.com/terms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-primary/70 hover:text-accent-primary transition-colors inline-block"
                >
                  @Fuwastore_Karin　二次創作ガイドライン
                </a>
              </div>
            </div>
            
            {/* 中央：サイトマップ */}
            <div className="min-w-36">
              <h4 className="text-base font-semibold text-text-primary mb-4">サイトマップ</h4>
              <ul className="flex md:flex-col gap-4 md:gap-0 md:space-y-3">
                <li>
                  <Link href="/" className="text-sm text-text-secondary hover:text-accent-primary transition-colors">
                    HOME
                  </Link>
                </li>
                <li>
                  <Link href="/archives" className="text-sm text-text-secondary hover:text-accent-primary transition-colors">
                    ARCHIVE
                  </Link>
                </li>
                <li>
                  <Link href="/songs" className="text-sm text-text-secondary hover:text-accent-primary transition-colors">
                    SONG
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-sm text-text-secondary hover:text-accent-primary transition-colors">
                    NEWS
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* 右側：公式リンク */}
            <div className="min-w-36">
              <h4 className="text-base font-semibold text-text-primary mb-4">公式リンク</h4>
              <ul className="flex md:flex-col gap-4 md:gap-0 md:space-y-3">
                <li>
                  <a 
                    href="https://www.youtube.com/@ShiroganeNoel" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                  >
                    YouTube
                  </a>
                </li>
                <li>
                  <a 
                    href="https://twitter.com/shiroganenoel" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                  >
                    X (Twitter)
                  </a>
                  </li>
              </ul>
            </div>
          </div>
          
          {/* 下部：コピーライト */}
          <div className="mt-6 pt-5 border-t border-surface-border">
            <p className="text-center text-sm text-text-muted">
              &copy; 2025 だんいんポータル
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
