import React from 'react';
import Image from 'next/image';
import lyricalImage from '@/assets/lyrical.png';

export default function YouTubeLinkSection() {
  const channelInfo = {
    channelName: "白銀ノエル Ch. ホロライブ",
    channelUrl: "https://www.youtube.com/@shiroganenoel",
    description: "配信で会える白い獅子に会いに行こう",
    subscriberCount: "149万人"
  };

  return (
    <section className="py-16 bg-bg-accent/20 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* 右側画像 */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 animate-stagger-fade" style={{"--animation-delay": "400ms"} as any}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-accent-beige/20 rounded-full blur-3xl scale-110 animate-pulse"></div>
            <div className="relative hover:scale-105 transition-transform duration-500 ease-out">
              <Image
                src={lyricalImage}
                alt="白銀ノエル"
                width={600}
                height={900}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* 中央のテキストコンテンツ */}
        <div className="relative z-10 text-center">
          {/* YouTubeアイコン */}
          <div className="mb-8 animate-stagger-fade" style={{"--animation-delay": "100ms"} as any}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-gold rounded-full">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
          </div>

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
              {channelInfo.description}
            </p>
            <div className="inline-flex items-center bg-bg-primary rounded-lg border border-surface-border px-6 py-3">
              <span className="text-text-primary font-medium">
                チャンネル登録者数: {channelInfo.subscriberCount}
              </span>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-stagger-fade" style={{"--animation-delay": "300ms"} as any}>
            <a
              href={channelInfo.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-accent-gold text-white rounded-lg font-medium hover:bg-accent-gold/80 transition-colors duration-200"
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
              className="inline-flex items-center px-8 py-3 border-2 border-accent-gold text-accent-gold rounded-lg font-medium hover:bg-accent-gold hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              チャンネル登録
            </a>
          </div>
        </div>

        {/* 追加情報 */}
        <div className="relative z-10 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-stagger-fade" style={{"--animation-delay": "400ms"} as any}>
            <div className="bg-bg-primary rounded-lg border border-surface-border p-6">
              <div className="text-3xl mb-3">🎵</div>
              <h4 className="font-bold text-text-primary mb-2">歌配信</h4>
              <p className="text-text-secondary text-sm">美しい歌声でお届けする歌配信をお楽しみください</p>
            </div>
            <div className="bg-bg-primary rounded-lg border border-surface-border p-6">
              <div className="text-3xl mb-3">🎮</div>
              <h4 className="font-bold text-text-primary mb-2">ゲーム配信</h4>
              <p className="text-text-secondary text-sm">様々なゲームを楽しくプレイする様子をご覧ください</p>
            </div>
            <div className="bg-bg-primary rounded-lg border border-surface-border p-6">
              <div className="text-3xl mb-3">💬</div>
              <h4 className="font-bold text-text-primary mb-2">雑談配信</h4>
              <p className="text-text-secondary text-sm">団員との楽しいおしゃべりタイムをお楽しみください</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}