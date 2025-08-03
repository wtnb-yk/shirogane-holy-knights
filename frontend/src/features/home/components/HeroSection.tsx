import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-noel-primary/20 via-white to-noel-secondary/10" />
      
      {/* メインコンテンツ */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-hero-title">
          <h1 className="text-6xl md:text-8xl font-bold text-noel-text-primary mb-6">
            白銀ノエル
          </h1>
          <p className="text-2xl md:text-3xl text-noel-text-secondary mb-8 font-medium">
            騎士団団長として皆を守る白い獅子
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/videos"
              className="px-8 py-4 bg-noel-primary text-white rounded-lg font-semibold hover:bg-noel-primary/90 transition-all duration-200 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              配信アーカイブを見る
            </a>
            <a
              href="/news"
              className="px-8 py-4 border-2 border-noel-primary text-noel-primary rounded-lg font-semibold hover:bg-noel-primary hover:text-white transition-all duration-200 hover:scale-105 hover:-translate-y-1"
            >
              最新ニュース
            </a>
          </div>
        </div>
      </div>

      {/* スクロール誘導 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-noel-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-noel-primary rounded-full mt-2 animate-pulse"></div>
        </div>
        <p className="text-noel-text-secondary text-sm mt-2">scroll</p>
      </div>
    </section>
  );
}