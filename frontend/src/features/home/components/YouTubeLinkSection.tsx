import React from 'react';

export default function YouTubeLinkSection() {
  const channelInfo = {
    channelName: "白銀ノエル Ch. ホロライブ",
    channelUrl: "https://www.youtube.com/@shiragaminoel",
    description: "配信で会える白い獅子に会いに行こう",
    subscriberCount: "149万人", // 静的表示
  };

  return (
    <section className="relative py-20 bg-gradient-to-r from-youtube-red/10 via-youtube-red/5 to-youtube-red/10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="animate-section-enter">
          {/* YouTubeアイコン */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-youtube-red rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
              <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
          </div>

          {/* チャンネル情報 */}
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-noel-text-primary mb-4">
              公式YouTubeチャンネル
            </h2>
            <h3 className="text-2xl md:text-3xl font-semibold text-youtube-red mb-4">
              {channelInfo.channelName}
            </h3>
            <p className="text-lg text-noel-text-secondary mb-2">
              {channelInfo.description}
            </p>
            <div className="inline-flex items-center bg-white rounded-full px-6 py-2 shadow-md">
              <div className="w-3 h-3 bg-youtube-red rounded-full mr-2"></div>
              <span className="text-noel-text-primary font-semibold">
                チャンネル登録者数: {channelInfo.subscriberCount}
              </span>
            </div>
          </div>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={channelInfo.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center px-8 py-4 bg-youtube-red text-white rounded-lg font-semibold hover:bg-youtube-red/90 transition-all duration-200 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              チャンネルを見る
            </a>
            <a
              href={`${channelInfo.channelUrl}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 border-2 border-youtube-red text-youtube-red rounded-lg font-semibold hover:bg-youtube-red hover:text-white transition-all duration-200 hover:scale-105 hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              チャンネル登録
            </a>
          </div>

          {/* 追加情報 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-3">🎵</div>
              <h4 className="font-semibold text-noel-text-primary mb-2">歌配信</h4>
              <p className="text-sm text-noel-text-secondary">美しい歌声でお届けする歌配信をお楽しみください</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-3">🎮</div>
              <h4 className="font-semibold text-noel-text-primary mb-2">ゲーム配信</h4>
              <p className="text-sm text-noel-text-secondary">様々なゲームを楽しくプレイする様子をご覧ください</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-3">💬</div>
              <h4 className="font-semibold text-noel-text-primary mb-2">雑談配信</h4>
              <p className="text-sm text-noel-text-secondary">団員との楽しいおしゃべりタイムをお楽しみください</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}