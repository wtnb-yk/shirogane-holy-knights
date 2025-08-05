'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-brand-cream border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 左側：サイト情報 */}
          <div>
            <h3 className="text-lg font-semibold text-brand-charcoal mb-2">団員ポータル</h3>
            <p className="text-sm text-brand-charcoal/80">
              ホロライブ3期生、白銀ノエル団長の<br />
              非公式ファンサイトです
            </p>
          </div>
          
          {/* 中央：リンク */}
          <div>
            <h4 className="text-sm font-semibold text-brand-charcoal mb-3">サイトマップ</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-brand-charcoal/80 hover:text-brand-charcoal transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-sm text-brand-charcoal/80 hover:text-brand-charcoal transition-colors">
                  配信・動画
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm text-brand-charcoal/80 hover:text-brand-charcoal transition-colors">
                  ニュース
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 右側：外部リンク */}
          <div>
            <h4 className="text-sm font-semibold text-brand-charcoal mb-3">公式リンク</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.youtube.com/@ShiroganeNoel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-brand-charcoal/80 hover:text-brand-charcoal transition-colors"
                >
                  YouTube チャンネル
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com/shiroganenoel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-brand-charcoal/80 hover:text-brand-charcoal transition-colors"
                >
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 下部：コピーライト */}
        <div className="mt-8 pt-6 border-t border-brand-charcoal/20">
          <p className="text-center text-sm text-brand-charcoal/60">
            &copy; 2025 団員ポータル
          </p>
        </div>
      </div>
    </footer>
  );
}
