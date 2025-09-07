import React from 'react';

interface PageLayoutProps {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  headerActions?: React.ReactNode;
  mobileActions?: React.ReactNode;
  mobileRightActions?: React.ReactNode;
  primaryTabs?: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  description,
  children,
  sidebar,
  headerActions,
  mobileActions,
  mobileRightActions,
  primaryTabs
}) => {
  return (
    <div className="bg-bg-page">
      {/* メインコンテナ */}
      <div className="flex flex-col md:flex-row max-w-full py-4 sm:py-8 px-4 sm:px-6 gap-2 sm:gap-4">
        {/* メインコンテンツ */}
        <main className="flex-1 min-w-0">
          {/* ページヘッダー */}
          <div className="page-header mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-surface-primary to-accent-blue bg-clip-text text-transparent mb-4 tracking-wider">
              {title}
            </h1>
            
            
            {/* モバイル: タブ+検索+グリッド切り替え全て左揃え */}
            {(primaryTabs || mobileActions || mobileRightActions) && (
              <div className="lg:hidden mb-3 flex items-center gap-2">
                {primaryTabs}
                {mobileActions}
                {mobileRightActions}
              </div>
            )}
            
            {/* デスクトップ以上では説明文とボタンを横並び */}
            <div className="hidden lg:flex items-start justify-between gap-4 mb-3">
              <div className="text-base text-gray-600 leading-relaxed flex-1">
                {description}
              </div>
              {headerActions}
            </div>
          </div>
          
          {/* メインコンテンツ */}
          {children}
        </main>
        
        {/* サイドバー */}
        {sidebar}
      </div>
    </div>
  );
};
