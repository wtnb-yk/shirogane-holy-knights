'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-surface-border mt-auto">
      <div className="w-full pt-10 pb-5 px-10">
        <div className="max-w-full mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-12">
            {/* 左側：サイト情報 */}
            <div className="flex-none lg:w-[450px]">
              <div className="mb-6">
                <h3 className="text-lg font-normal text-navy mb-2">
                  白銀ノエル 非公式ファンサイト<br />
                  だんいんポータル
                </h3>
                <div className="text-xs text-navy/60 leading-relaxed mb-2">
                  <p className="mb-1">
                    ※当サイトは、ホロライブプロダクション所属VTuber 白銀ノエルさんを応援する非公式サイトです。
                  </p>
                  <p className="mb-1">
                    ※カバー株式会社様、ホロライブプロダクション様とは一切関係ありません。
                  </p>
                  <p>
                    ※当サイトで使用している画像の著作権・肖像権等は各権利者に帰属いたします。
                  </p>
                </div>
                <div className="space-x-4">
                  <a 
                    href="https://x.com/ChuunChuuun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-navy/50 hover:text-accent-primary transition-colors"
                  >
                    @ChuunChuuun
                  </a>
                  <a 
                    href="https://hololivepro.com/terms/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-navy/50 hover:text-accent-primary transition-colors"
                  >
                    二次創作ガイドライン
                  </a>
                </div>
              </div>
            </div>
            
            {/* 右側：リンク2列 */}
            <div className="flex flex-col sm:flex-row gap-8 lg:gap-20">
              {/* サイトマップ */}
              <div className="min-w-36">
                <h4 className="text-sm font-normal text-navy mb-4">サイトマップ</h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/" className="text-xs text-navy/70 hover:text-accent-primary transition-colors">
                      HOME
                    </Link>
                  </li>
                  <li>
                    <Link href="/archives" className="text-xs text-navy/70 hover:text-accent-primary transition-colors">
                      ARCHIVE
                    </Link>
                  </li>
                  <li>
                    <Link href="/songs" className="text-xs text-navy/70 hover:text-accent-primary transition-colors">
                      SONG
                    </Link>
                  </li>
                  <li>
                    <Link href="/news" className="text-xs text-navy/70 hover:text-accent-primary transition-colors">
                      NEWS
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* 公式リンク */}
              <div className="min-w-36">
                <h4 className="text-sm font-normal text-navy mb-4">公式リンク</h4>
                <ul className="space-y-2.5">
                  <li>
                    <a 
                      href="https://www.youtube.com/@ShiroganeNoel" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-navy/70 hover:text-accent-primary transition-colors"
                    >
                      YouTube
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://x.com/shiroganenoel"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-navy/70 hover:text-accent-primary transition-colors"
                    >
                      X (Twitter)
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 下部：コピーライト */}
          <div className="mt-2 pt-2 border-t border-surface-border">
            <p className="text-center text-xs text-navy/50">
              &copy; 2025 だんいんポータル
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
