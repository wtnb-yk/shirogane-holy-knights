'use client';

import React from 'react';
import { GenericSidebar } from '@/components/Sidebar/internals/GenericSidebar';
import { BottomSheet } from '@/components/BottomSheet/BottomSheet';
import { BreadcrumbSchema } from '@/components/Seo/JsonLd';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface PageLayoutProps {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  breadcrumbItems: BreadcrumbItem[];
  primaryTabs?: React.ReactNode;

  desktopSidebar?: {
    content: React.ReactNode;
    modal?: {
      isOpen: boolean;
      onClose: () => void;
      content: React.ReactNode;
    };
  };

  mobileBottomSheet?: {
    trigger: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    content: React.ReactNode;
  };
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  children,
  breadcrumbItems,
  primaryTabs,
  desktopSidebar,
  mobileBottomSheet
}) => {
  // 日本語文字が含まれているかを判定
  // const hasJapanese = true;
  const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(title);

  return (
    <>
      {/* メインコンテナ */}
      <div className="flex flex-col md:flex-row max-w-full py-4 sm:py-8 px-4 sm:px-6 gap-2 sm:gap-4">
        {/* メインコンテンツ */}
        <main className="flex-1 min-w-0">
          {/* ページヘッダー */}
          <div className="page-header mb-6">
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black text-surface-primary mb-4 tracking-wider ${hasJapanese ? 'heading-ja' : ''}`}>
              {title}
            </h1>

            {/* モバイル: タブ+検索+グリッド切り替え全て左揃え */}
            {(primaryTabs || mobileBottomSheet?.trigger) && (
              <div className="lg:hidden mb-3 flex items-center gap-2">
                {primaryTabs}
                {mobileBottomSheet?.trigger}
              </div>
            )}

            {/* デスクトップ以上では説明文とボタンを横並び */}
            <div className="hidden lg:flex items-start justify-between gap-4 mb-3">
              <div className="text-base text-text-secondary leading-relaxed flex-1">
                {description}
              </div>
            </div>
          </div>

          {/* SEO用のパンくずリスト構造化データ */}
          <BreadcrumbSchema items={breadcrumbItems} />

          {/* メインコンテンツ */}
          {children}
        </main>

        {/* デスクトップサイドバー */}
        {desktopSidebar && (
          <div className="hidden lg:block">
            <GenericSidebar>
              {desktopSidebar.content}
            </GenericSidebar>
          </div>
        )}
      </div>

      {/* モバイルボトムシート */}
      {mobileBottomSheet && (
        <BottomSheet
          isOpen={mobileBottomSheet.isOpen}
          onClose={mobileBottomSheet.onClose}
          title={mobileBottomSheet.title}
        >
          {mobileBottomSheet.content}
        </BottomSheet>
      )}

      {/* デスクトップサイドバーのモーダル */}
      {desktopSidebar?.modal?.isOpen && desktopSidebar.modal.content}
    </>
  );
};
