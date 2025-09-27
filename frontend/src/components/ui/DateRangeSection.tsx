'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { DateRangeSectionProps } from '@/types/common';
import { DateRangeInput } from '@/components/common/Sidebar/DateRangeInput';
import {BottomSheetSectionHeader} from "@/components/common/BottomSheetSectionHeader";

/**
 * セクション付き日付範囲コンポーネント
 * タイトル、説明、アイコンと組み合わせた日付範囲選択
 */
export const DateRangeSection = ({
  title,
  className,
  ...dateRangeProps
}: DateRangeSectionProps) => {
  return (
    <div className={cn('w-full', className)}>
      {/* セクションヘッダー */}
      {title && (
        <BottomSheetSectionHeader title={title} />
      )}

      {/* 日付範囲入力 */}
      <DateRangeInput
        {...dateRangeProps}
      />
    </div>
  );
};
