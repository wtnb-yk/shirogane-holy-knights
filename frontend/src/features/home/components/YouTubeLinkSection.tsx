import React from 'react';
import { OptimizedImage } from '@/components/Image/OptimizedImage';
import lyricalImage from '@/assets/lyrical.png';
import { TAILWIND_Z_INDEX } from '@/constants/zIndex';

export default function YouTubeLinkSection() {
  const channelInfo = {
    channelName: "Noel Ch. 白銀ノエル",
    channelUrl: "https://www.youtube.com/@shiroganenoel",
  };

  return (
    <section className="py-16 bg-bg-accent/20 relative">
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* 右側画像 */}
        <div className="absolute -top-12 right-0 animate-stagger-fade hidden lg:block" style={{"--animation-delay": "400ms"} as any}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-accent-beige/20 rounded-full blur-3xl scale-110 animate-pulse"></div>
            <div className="relative hover:scale-105 transition-transform duration-500 ease-out">
              <OptimizedImage
                src={lyricalImage}
                alt="白銀ノエル"
                width={380}
                height={570}
                className="drop-shadow-2xl"
                sizes="380px"
                priority={false}
              />
            </div>
          </div>
        </div>

        {/* 中央のテキストコンテンツ */}
        <div className={`relative ${TAILWIND_Z_INDEX.BASE_CONTENT} text-center`}>
          {/* タイトル・説明 */}
          <div className="mb-12 animate-stagger-fade" style={{"--animation-delay": "200ms"} as any}>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
              公式YouTubeチャンネル
            </h2>
            <div className="w-20 h-1 bg-text-secondary mx-auto rounded-full mb-4"></div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              {channelInfo.channelName}
            </h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              少しでも興味を持っていただけたら、ぜひチャンネル登録をお願いします！<br />
              ぜひ一緒に応援しましょう！
            </p>
          </div>

          {/* ボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-stagger-fade" style={{"--animation-delay": "300ms"} as any}>
            <a
              href={channelInfo.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-accent-youtube text-white rounded-lg font-medium hover:bg-accent-youtube/80 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              チャンネルを見る
            </a>
            <a
              href={`${channelInfo.channelUrl}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 border-2 border-accent-youtube text-accent-youtube rounded-lg font-medium hover:bg-accent-youtube hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              チャンネル登録
            </a>
          </div>
        </div>

        {/* 追加情報 */}
        <div className="mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger-fade" style={{"--animation-delay": "400ms"} as any}>
            <div className="bg-bg-primary rounded-lg border border-surface-border p-6">
              <div className="text-3xl mb-3">🎵</div>
              <h4 className="font-bold text-text-primary mb-2">歌枠</h4>
              <p className="text-text-secondary text-sm">ノエル団長の歌枠からしか得られない栄養がある</p>
            </div>
            <div className="bg-bg-primary rounded-lg border border-surface-border p-6">
              <div className="text-3xl mb-3">🎮</div>
              <h4 className="font-bold text-text-primary mb-2">ゲーム実況</h4>
              <p className="text-text-secondary text-sm">操作ミスも神展開もノエル団長の手にかかれば全部名シーン</p>
            </div>
            <div className="bg-bg-primary rounded-lg border border-surface-border p-6">
              <div className="text-3xl mb-3">💬</div>
              <h4 className="font-bold text-text-primary mb-2">雑談</h4>
              <p className="text-text-secondary text-sm">優しい声で肩の力が抜ける団員との楽しいおしゃべりタイム</p>
            </div>
            <div className="bg-bg-primary rounded-lg border border-surface-border p-6">
              <div className="text-3xl mb-3">🎧</div>
              <h4 className="font-bold text-text-primary mb-2">ASMR</h4>
              <p className="text-text-secondary text-sm">ノエル団長のこだわり溢れるASMRは癒しのひととき</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
