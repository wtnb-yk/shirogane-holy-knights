import React from 'react';
import { DecorativeFrame } from '@/components/ui/decorations/DecorativeFrame';
import { FloatingParticles } from '@/components/ui/decorations/FloatingParticles';
import { KnightEmblem } from '@/components/ui/decorations/KnightEmblem';
import { SwordDecoration } from '@/components/ui/decorations/SwordDecoration';
import { ShieldDecoration } from '@/components/ui/decorations/ShieldDecoration';
import { CowPatternDecoration } from '@/components/ui/decorations/CowPatternDecoration';
import { CowBellDecoration } from '@/components/ui/decorations/CowBellDecoration';
import { HoofDecoration } from '@/components/ui/decorations/HoofDecoration';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { ImageLayout } from '@/components/ui/decorations/ImageLayout';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 上品で柔らかい背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-100/60 via-white to-blue-50/40" />
      
      {/* 控えめなパーティクル */}
      <FloatingParticles count={8} variant="stars" className="text-sage-300/40" />
      <FloatingParticles count={6} variant="sparkles" className="text-blue-200/30" />

      {/* メインコンテンツ */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* エレガントなタイトルエリア */}
        <div className="mb-12">
          {/* 上品な装飾フレーム */}
          <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-sage-200">
            {/* さりげない角装飾 */}
            <div className="absolute top-4 left-4 opacity-30">
              <KnightEmblem size="sm" variant="simple" />
            </div>
            <div className="absolute top-4 right-4 opacity-30">
              <KnightEmblem size="sm" variant="simple" />
            </div>
            
            <div className="animate-hero-title">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
                白銀ノエル
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-4 font-medium">
                白銀聖騎士団団長
              </p>
              
              <p className="text-xl md:text-2xl text-sage-300 font-semibold">
                「こんまっする〜」
              </p>
            </div>
            
            {/* 下部の控えめな装飾 */}
            <div className="absolute bottom-4 left-4 opacity-30">
              <KnightEmblem size="sm" variant="simple" />
            </div>
            <div className="absolute bottom-4 right-4 opacity-30">
              <KnightEmblem size="sm" variant="simple" />
            </div>
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
      
      {/* 控えめな角装飾 - 参考サイトのような上品さ */}
      <div className="absolute top-12 left-12 opacity-20 hidden lg:block">
        <SwordDecoration size="md" variant="classic" />
      </div>
      <div className="absolute top-12 right-12 opacity-20 hidden lg:block">
        <ShieldDecoration size="md" variant="knight" />
      </div>
      <div className="absolute bottom-24 left-16 opacity-15 hidden lg:block">
        <CowBellDecoration size="sm" variant="single" />
      </div>
      <div className="absolute bottom-24 right-16 opacity-15 hidden lg:block">
        <HoofDecoration size="sm" variant="single" />
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
