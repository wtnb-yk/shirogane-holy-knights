import React from 'react';
import { ImagePlaceholder } from '../ImagePlaceholder';
import { SwordDecoration } from './SwordDecoration';
import { ShieldDecoration } from './ShieldDecoration';
import { CowBellDecoration } from './CowBellDecoration';
import { HoofDecoration } from './HoofDecoration';

interface ImageLayoutProps {
  layout?: 'hero-gallery' | 'portrait-showcase' | 'decorative-grid' | 'knight-formation';
  className?: string;
  showAnimations?: boolean;
}

export function ImageLayout({ 
  layout = 'hero-gallery', 
  className = '', 
  showAnimations = true 
}: ImageLayoutProps) {
  const getLayoutContent = () => {
    switch (layout) {
      case 'portrait-showcase':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* メイン画像 */}
            <div className="md:col-span-2">
              <div className="relative">
                <ImagePlaceholder 
                  variant="noel-portrait" 
                  size="hero" 
                  message="白銀ノエル様のメイン画像"
                />
                {showAnimations && (
                  <>
                    <div className="absolute -top-4 -left-4 animate-sword-glow">
                      <SwordDecoration size="md" variant="ceremonial" animate />
                    </div>
                    <div className="absolute -bottom-4 -right-4 animate-shield-shine">
                      <ShieldDecoration size="md" variant="royal" animate />
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* サブ画像とアクセサリー */}
            <div className="space-y-6">
              <ImagePlaceholder 
                variant="knight-scene" 
                size="lg" 
                message="騎士シーン画像"
              />
              <ImagePlaceholder 
                variant="cow-theme" 
                size="lg" 
                message="牛テーマ画像"
              />
              
              {showAnimations && (
                <div className="flex justify-center space-x-4 mt-4">
                  <CowBellDecoration size="md" variant="cluster" animate />
                  <HoofDecoration size="md" variant="trail" animate />
                </div>
              )}
            </div>
          </div>
        );
      
      case 'decorative-grid':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ImagePlaceholder variant="noel-portrait" size="md" message="ポートレート" />
            <ImagePlaceholder variant="knight-scene" size="md" message="ナイトシーン" />
            <ImagePlaceholder variant="cow-theme" size="md" message="牛テーマ" />
            <ImagePlaceholder variant="decorative" size="md" message="装飾画像" />
            <ImagePlaceholder variant="knight-scene" size="md" message="アクション" />
            <ImagePlaceholder variant="noel-portrait" size="md" message="表情" />
            <ImagePlaceholder variant="decorative" size="md" message="背景" />
            <ImagePlaceholder variant="cow-theme" size="md" message="アクセサリー" />
            
            {showAnimations && (
              <>
                <div className="absolute top-0 left-0 animate-sword-trail">
                  <SwordDecoration size="sm" variant="classic" />
                </div>
                <div className="absolute top-0 right-0 animate-float">
                  <CowBellDecoration size="sm" variant="single" />
                </div>
                <div className="absolute bottom-0 left-0 animate-hoof-bounce">
                  <HoofDecoration size="sm" variant="single" />
                </div>
                <div className="absolute bottom-0 right-0 animate-shield-shine">
                  <ShieldDecoration size="sm" variant="knight" />
                </div>
              </>
            )}
          </div>
        );
      
      case 'knight-formation':
        return (
          <div className="relative">
            {/* 中央のメイン画像 */}
            <div className="flex justify-center mb-8">
              <ImagePlaceholder 
                variant="noel-portrait" 
                size="xl" 
                message="団長ノエル様"
              />
            </div>
            
            {/* 周囲の騎士テーマ画像 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <ImagePlaceholder variant="knight-scene" size="lg" message="剣技" />
              <ImagePlaceholder variant="knight-scene" size="lg" message="盾防御" />
              <ImagePlaceholder variant="knight-scene" size="lg" message="騎士装備" />
              <ImagePlaceholder variant="knight-scene" size="lg" message="団長姿" />
            </div>
            
            {/* 装飾的な武器配置 */}
            {showAnimations && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-1/4 animate-sword-glow">
                  <SwordDecoration size="lg" variant="ornate" animate />
                </div>
                <div className="absolute top-4 right-1/4 animate-sword-glow" style={{ animationDelay: '1s' }}>
                  <SwordDecoration size="lg" variant="ceremonial" animate />
                </div>
                <div className="absolute bottom-4 left-1/3 animate-shield-shine">
                  <ShieldDecoration size="lg" variant="royal" animate />
                </div>
                <div className="absolute bottom-4 right-1/3 animate-shield-shine" style={{ animationDelay: '0.5s' }}>
                  <ShieldDecoration size="lg" variant="heraldic" animate />
                </div>
              </div>
            )}
          </div>
        );
      
      default: // hero-gallery
        return (
          <div className="relative">
            {/* ヒーロー画像 */}
            <div className="mb-12">
              <ImagePlaceholder 
                variant="noel-portrait" 
                size="hero" 
                message="白銀ノエル様のヒーロー画像"
              />
            </div>
            
            {/* ギャラリー画像 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <ImagePlaceholder variant="knight-scene" size="lg" message="騎士シーン1" />
                <ImagePlaceholder variant="cow-theme" size="md" message="牛テーマ1" />
              </div>
              <div className="space-y-4">
                <ImagePlaceholder variant="noel-portrait" size="lg" message="ポートレート2" />
                <ImagePlaceholder variant="decorative" size="md" message="装飾画像1" />
              </div>
              <div className="space-y-4">
                <ImagePlaceholder variant="knight-scene" size="lg" message="騎士シーン2" />
                <ImagePlaceholder variant="cow-theme" size="md" message="牛テーマ2" />
              </div>
            </div>
            
            {/* フローティング装飾 */}
            {showAnimations && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-8 left-8 animate-float">
                  <SwordDecoration size="md" variant="classic" animate />
                </div>
                <div className="absolute top-16 right-8 animate-float" style={{ animationDelay: '2s' }}>
                  <CowBellDecoration size="md" variant="chain" animate />
                </div>
                <div className="absolute bottom-16 left-16 animate-float" style={{ animationDelay: '1s' }}>
                  <ShieldDecoration size="md" variant="knight" animate />
                </div>
                <div className="absolute bottom-8 right-16 animate-float" style={{ animationDelay: '3s' }}>
                  <HoofDecoration size="md" variant="walking" animate />
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      {getLayoutContent()}
    </div>
  );
}