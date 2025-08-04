import React from 'react';
import { CowPatternDecoration } from './decorations/CowPatternDecoration';
import { SwordDecoration } from './decorations/SwordDecoration';
import { ShieldDecoration } from './decorations/ShieldDecoration';

interface ImagePlaceholderProps {
  variant?: 'noel-portrait' | 'knight-scene' | 'cow-theme' | 'decorative';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  message?: string;
  showDecorations?: boolean;
}

export function ImagePlaceholder({ 
  variant = 'noel-portrait', 
  size = 'md', 
  className = '', 
  message = '画像は後日追加予定',
  showDecorations = true
}: ImagePlaceholderProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-32 w-32';
      case 'md': return 'h-48 w-48';
      case 'lg': return 'h-64 w-64';
      case 'xl': return 'h-80 w-80';
      case 'hero': return 'h-96 w-full max-w-2xl';
      default: return 'h-48 w-48';
    }
  };

  const getVariantContent = () => {
    switch (variant) {
      case 'knight-scene':
        return {
          emoji: '⚔️',
          bgGradient: 'from-gray-100 via-gray-50 to-silver-100',
          pattern: showDecorations ? (
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="grid grid-cols-3 gap-4">
                <SwordDecoration size="sm" variant="classic" />
                <ShieldDecoration size="sm" variant="knight" />
                <SwordDecoration size="sm" variant="ornate" />
                <ShieldDecoration size="sm" variant="royal" />
                <SwordDecoration size="sm" variant="ceremonial" />
                <ShieldDecoration size="sm" variant="heraldic" />
              </div>
            </div>
          ) : null,
          title: 'ナイトシーン'
        };
      
      case 'cow-theme':
        return {
          emoji: '🐄',
          bgGradient: 'from-white via-gray-50 to-gray-100',
          pattern: showDecorations ? (
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <CowPatternDecoration size={size === 'hero' ? 'xl' : 'lg'} variant="spots" />
            </div>
          ) : null,
          title: '牛テーマ'
        };
      
      case 'decorative':
        return {
          emoji: '✨',
          bgGradient: 'from-pink-50 via-purple-50 to-blue-50',
          pattern: showDecorations ? (
            <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-4 gap-2 h-full">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {i % 3 === 0 && <SwordDecoration size="sm" variant="classic" />}
                    {i % 3 === 1 && <ShieldDecoration size="sm" variant="knight" />}
                    {i % 3 === 2 && <CowPatternDecoration size="sm" variant="scattered" />}
                  </div>
                ))}
              </div>
            </div>
          ) : null,
          title: '装飾的'
        };
      
      default: // noel-portrait
        return {
          emoji: '👑',
          bgGradient: 'from-sage-100/30 via-white to-sage-200/20',
          pattern: showDecorations ? (
            <div className="absolute inset-0 opacity-8">
              <div className="absolute top-4 left-4">
                <ShieldDecoration size="sm" variant="royal" animate />
              </div>
              <div className="absolute bottom-4 right-4">
                <SwordDecoration size="sm" variant="ceremonial" animate />
              </div>
              <div className="absolute top-4 right-4">
                <CowPatternDecoration size="sm" variant="spots" />
              </div>
              <div className="absolute bottom-4 left-4">
                <CowPatternDecoration size="sm" variant="patches" />
              </div>
            </div>
          ) : null,
          title: 'ノエル様ポートレート'
        };
    }
  };

  const variantContent = getVariantContent();

  return (
    <div className={`${getSizeClasses()} relative rounded-2xl overflow-hidden border-2 border-dashed border-sage-200 ${className}`}>
      {/* 背景グラデーション */}
      <div className={`absolute inset-0 bg-gradient-to-br ${variantContent.bgGradient}`} />
      
      {/* 装飾パターン */}
      {variantContent.pattern}
      
      {/* メインコンテンツ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 relative z-10">
        <div className={`text-6xl mb-4 ${size === 'hero' ? 'text-8xl mb-6' : ''} drop-shadow-lg`}>
          {variantContent.emoji}
        </div>
        
        <div className="bg-white/90 rounded-lg px-4 py-2 shadow-md backdrop-blur-sm">
          <p className="text-sage-300 font-bold text-sm mb-1">
            {variantContent.title}
          </p>
          <p className="text-xs text-sage-200">
            {message}
          </p>
        </div>
        
        {size === 'hero' && (
          <div className="mt-4 bg-gradient-to-r from-sage-100/80 to-sage-200/80 rounded-full px-6 py-2 backdrop-blur-sm">
            <p className="text-sage-300 font-semibold text-sm">
              ユーザー様から提供される画像素材をお待ちしております
            </p>
          </div>
        )}
      </div>
      
      {/* コーナー装飾 */}
      {showDecorations && (
        <>
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-sage-300 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-sage-300 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-sage-300 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-sage-300 rounded-br-lg" />
        </>
      )}
    </div>
  );
}