'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { DateRangeSectionProps } from '@/types/common';
import { DateRangeInput } from '@/components/common/Sidebar/DateRangeInput';

/**
 * セクション付き日付範囲コンポーネント
 * タイトル、説明、アイコンと組み合わせた日付範囲選択
 */
export const DateRangeSection = ({
  title,
  description,
  icon,
  className,
  ...dateRangeProps
}: DateRangeSectionProps) => {
  // デフォルトアイコン
  const defaultIcon = (
    <div className="w-1 h-4 bg-accent-gold rounded-full"></div>
  );

  const iconElement = icon !== undefined ? icon : defaultIcon;

  return (
    <div className={cn('w-full', className)}>
      {/* セクションヘッダー */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          {iconElement}
          {title}
        </h4>
        {description && (
          <p className="text-xs text-text-secondary mt-1">
            {description}
          </p>
        )}
      </div>

      {/* 日付範囲入力 */}
      <DateRangeInput
        {...dateRangeProps}
      />
    </div>
  );
};