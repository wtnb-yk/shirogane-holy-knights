import React from 'react';
import { FloatingParticles } from '@/components/ui/decorations/FloatingParticles';
import { KnightEmblem } from '@/components/ui/decorations/KnightEmblem';
import { SwordDecoration } from '@/components/ui/decorations/SwordDecoration';
import { ShieldDecoration } from '@/components/ui/decorations/ShieldDecoration';
import { CowBellDecoration } from '@/components/ui/decorations/CowBellDecoration';
import { HoofDecoration } from '@/components/ui/decorations/HoofDecoration';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景画像 */}
      <div className="absolute inset-0 z-0">
        <ImagePlaceholder 
          variant="noel-hero-bg" 
          size="hero"
          message="白銀ノエル様の背景画像"
          showDecorations={false}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* 騎士らしいアニメーション */}
      <FloatingParticles count={8} variant="stars" className="text-yellow-300/60" />
      <FloatingParticles count={6} variant="sparkles" className="text-white/50" />
      
      {/* 旗たなびくアニメーション */}
      <div className="absolute top-20 left-20 animate-pulse opacity-40 hidden lg:block">
        <div className="w-16 h-24 bg-gradient-to-b from-sage-400 to-sage-600 rounded-r-lg shadow-lg animate-wave"></div>
      </div>
      <div className="absolute top-20 right-20 animate-pulse opacity-40 hidden lg:block">
        <div className="w-16 h-24 bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-lg shadow-lg animate-wave"></div>
      </div>

      {/* メインコンテンツ - 中央配置 */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* 背景の上に重ねるタイトル */}
        <div className="text-center text-white relative z-10">
          {/* 輝く紋章 */}
          <div className="mb-8 animate-pulse">
            <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/50">
              <KnightEmblem size="lg" variant="crest" className="text-white animate-spin-slow" />
            </div>
          </div>
          
          {/* 大胆なタイトル */}
          <div className="animate-hero-title">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-tight drop-shadow-2xl animate-glow">
              白銀ノエル
            </h1>
            
            <p className="text-2xl md:text-3xl mb-4 font-bold drop-shadow-lg">
              白銀聖騎士団団長
            </p>
            
            <p className="text-2xl md:text-4xl font-bold text-yellow-300 drop-shadow-lg animate-pulse">
              「こんまっする〜」
            </p>
          </div>
        </div>
        
        {/* 洗練されたボタンエリア */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/videos"
            className="px-8 py-4 bg-gradient-to-r from-sage-300 to-blue-400 text-white rounded-2xl font-semibold hover:from-sage-200 hover:to-blue-500 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            配信アーカイブを見る
          </a>
          <a
            href="/news"
            className="px-8 py-4 border-2 border-sage-300 text-sage-300 rounded-2xl font-semibold hover:bg-sage-300 hover:text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          >
            最新ニュース
          </a>
        </div>
      </div>
      
      {/* 動的な騎士装飾 */}
      <div className="absolute top-1/4 left-8 opacity-60 hidden lg:block animate-bounce">
        <SwordDecoration size="lg" variant="classic" className="text-yellow-400 animate-pulse" />
      </div>
      <div className="absolute top-1/4 right-8 opacity-60 hidden lg:block animate-bounce">
        <ShieldDecoration size="lg" variant="royal" className="text-blue-300 animate-pulse" />
      </div>
      <div className="absolute bottom-1/4 left-12 opacity-40 hidden lg:block">
        <CowBellDecoration size="md" variant="chain" className="text-sage-300 animate-swing" />
      </div>
      <div className="absolute bottom-1/4 right-12 opacity-40 hidden lg:block">
        <HoofDecoration size="md" variant="walking" className="text-yellow-300 animate-bounce" />
      </div>
      
      {/* 輝く粒子効果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* 上品なスクロール誘導 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-sage-300 rounded-full flex justify-center bg-white/80 backdrop-blur-sm">
          <div className="w-1 h-3 bg-sage-300 rounded-full mt-2 animate-pulse"></div>
        </div>
        <p className="text-gray-600 text-sm mt-2 font-medium">scroll</p>
      </div>
    </section>
  );
}
