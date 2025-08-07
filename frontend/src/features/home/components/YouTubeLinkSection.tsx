import React from 'react';

export default function YouTubeLinkSection() {
  const channelInfo = {
    channelName: "白銀ノエル Ch. ホロライブ",
    channelUrl: "https://www.youtube.com/@shiroganenoel",
    description: "配信で会える白い獅子に会いに行こう",
    subscriberCount: "149万人"
  };

  return (
    <section className="py-16 bg-shirogane-bg-accent/20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* YouTubeアイコン */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
        </div>

        {/* チャンネル情報 */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            公式YouTubeチャンネル
          </h2>
          <div className="w-20 h-1 bg-shirogane-text-secondary mx-auto rounded-full mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {channelInfo.channelName}
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {channelInfo.description}
          </p>
          <div className="inline-flex items-center bg-white rounded-lg border border-shirogane-surface-border px-6 py-3">
            <span className="text-gray-800 font-medium">
              チャンネル登録者数: {channelInfo.subscriberCount}
            </span>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a
            href={channelInfo.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
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
            className="inline-flex items-center px-8 py-3 border-2 border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            チャンネル登録
          </a>
        </div>

        {/* 追加情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-shirogane-surface-border p-6">
            <div className="text-3xl mb-3">🎵</div>
            <h4 className="font-bold text-gray-800 mb-2">歌配信</h4>
            <p className="text-gray-600 text-sm">美しい歌声でお届けする歌配信をお楽しみください</p>
          </div>
          <div className="bg-white rounded-lg border border-shirogane-surface-border p-6">
            <div className="text-3xl mb-3">🎮</div>
            <h4 className="font-bold text-gray-800 mb-2">ゲーム配信</h4>
            <p className="text-gray-600 text-sm">様々なゲームを楽しくプレイする様子をご覧ください</p>
          </div>
          <div className="bg-white rounded-lg border border-shirogane-surface-border p-6">
            <div className="text-3xl mb-3">💬</div>
            <h4 className="font-bold text-gray-800 mb-2">雑談配信</h4>
            <p className="text-gray-600 text-sm">団員との楽しいおしゃべりタイムをお楽しみください</p>
          </div>
        </div>
      </div>
    </section>
  );
}