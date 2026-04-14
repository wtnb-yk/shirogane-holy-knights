'use client';

import React, { useState, useEffect } from 'react';
import { OptimizedImage } from '@/components/Image/OptimizedImage';
import hero1 from '@/assets/hero/hero_1.png';
import hero2 from '@/assets/hero/hero_2.png';
import hero3 from '@/assets/hero/hero_3.png';
import hero4 from '@/assets/hero/hero_4.png';
import hero5 from '@/assets/hero/hero_5.png';
import hero6 from '@/assets/hero/hero_6.png';
import { TAILWIND_Z_INDEX } from '@/constants/zIndex';

const heroImages = [hero1, hero2, hero3, hero4, hero5, hero6];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }, 5000); // 5秒ごとに切り替え

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentImageIndex === heroImages.length) {
      // アニメーション完了後に最初の位置にリセット
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentImageIndex(0);
        // 次のフレームでトランジションを再有効化
        setTimeout(() => setIsTransitioning(true), 50);
      }, 1000);
    }
  }, [currentImageIndex]);

  return (
    <section className="relative h-[70vh] flex items-center justify-center">
      {/* 背景画像 */}
      <div className={`absolute inset-0 ${TAILWIND_Z_INDEX.BASE} overflow-hidden`}>
        <div 
          className={`flex h-full ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
          style={{
            width: `${(heroImages.length + 1) * 100}vw`,
            transform: `translateX(-${currentImageIndex * 100}vw)`
          }}
        >
          {heroImages.map((image, index) => (
            <div key={index} className="relative w-screen h-full flex-shrink-0">
              <OptimizedImage
                src={image}
                alt={`ヒーロー背景 ${index + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
            </div>
          ))}
          {/* 無限ループ用の最初の画像の複製 */}
          <div className="relative w-screen h-full flex-shrink-0">
            <OptimizedImage
              src={heroImages[0]!}
              alt="ヒーロー背景 1（ループ用）"
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* メインコンテンツ */}
      <div className={`relative ${TAILWIND_Z_INDEX.BASE_CONTENT} text-center px-6 max-w-4xl mx-auto`}>
        <div className="text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="inline-block">だんいん</span>
            <span className="inline-block">ポータル</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-2 opacity-90">
            白銀ノエルさんの非公式ファンサイト
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
