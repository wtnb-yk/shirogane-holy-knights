import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* 背景画像 */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-text-muted to-text-secondary"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            白銀ノエル
          </h1>
          
          <p className="text-xl md:text-2xl mb-2 opacity-90">
            白銀聖騎士団団長
          </p>
          
          <p className="text-lg md:text-xl mb-12 opacity-80">
            「こんまっする〜」
          </p>
        </div>
      </div>
      
      {/* スクロール誘導 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="text-white/60 text-sm animate-bounce">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-bg-primary/60 rounded-full mt-2"></div>
          </div>
          <p className="mt-2">scroll</p>
        </div>
      </div>
    </section>
  );
}
