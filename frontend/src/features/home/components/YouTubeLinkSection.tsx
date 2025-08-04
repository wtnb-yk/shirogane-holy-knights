import React from 'react';

export default function YouTubeLinkSection() {
  const channelInfo = {
    channelName: "白銀ノエル Ch. ホロライブ",
    channelUrl: "https://www.youtube.com/@shiroganenoel",
    description: "配信で会える白い獅子に会いに行こう",
    subscriberCount: "149万人", // 静的表示
  };

  return (
    <section className="relative py-16 bg-gradient-to-r from-sage-100/20 via-white to-blue-50/20">
      
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="animate-section-enter">
          {/* YouTubeアイコン */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 xl:w-32 xl:h-32 2xl:w-40 2xl:h-40 bg-youtube-red rounded-full shadow-lg xl:shadow-2xl hover:scale-105 transition-transform duration-300">
              <svg className="w-14 h-14 xl:w-18 xl:h-18 2xl:w-24 2xl:h-24 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
          </div>

          {/* チャンネル情報 */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              公式YouTubeチャンネル
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-sage-300 to-blue-400 mx-auto rounded-full mb-6"></div>
            <h3 className="text-xl md:text-2xl font-semibold text-youtube-red mb-4">
              {channelInfo.channelName}
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              {channelInfo.description}
            </p>
            <div className="inline-flex items-center bg-white rounded-full px-8 py-3 shadow-lg border border-gray-100">
              <div className="w-3 h-3 bg-youtube-red rounded-full mr-3"></div>
              <span className="text-gray-800 font-semibold text-lg">
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
              className="group inline-flex items-center px-8 py-4 bg-youtube-red text-white rounded-2xl font-semibold hover:bg-youtube-red/90 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
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
              className="inline-flex items-center px-8 py-4 border-2 border-youtube-red text-youtube-red rounded-2xl font-semibold hover:bg-youtube-red hover:text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              チャンネル登録
            </a>
          </div>

          {/* 追加情報 - PC版では非対称配置 */}
          <div className="mt-16 xl:mt-24 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-8 xl:gap-12 max-w-4xl xl:max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border border-gray-100">
              <div className="text-4xl mb-4">🎵</div>
              <h4 className="font-semibold text-gray-800 mb-3 text-xl">歌配信</h4>
              <p className="text-base text-gray-600">美しい歌声でお届けする歌配信をお楽しみください</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border border-gray-100">
              <div className="text-4xl mb-4">🎮</div>
              <h4 className="font-semibold text-gray-800 mb-3 text-xl">ゲーム配信</h4>
              <p className="text-base text-gray-600">様々なゲームを楽しくプレイする様子をご覧ください</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border border-gray-100">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="font-semibold text-gray-800 mb-3 text-xl">雑談配信</h4>
              <p className="text-base text-gray-600">団員との楽しいおしゃべりタイムをお楽しみください</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
