'use client';

import React from 'react';
import { TrendingUp, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { SortBy, SortOrder } from '../../types/types';

interface SortBySectionProps {
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export const SortBySection = ({
  sortBy,
  sortOrder
}: SortBySectionProps) => {

  const getSortDisplayInfo = () => {
    const sortByInfo = {
      [SortBy.SING_COUNT]: { 
        label: '歌唱回数',
        description: '歌われた回数で並び替え', 
        icon: TrendingUp 
      },
      [SortBy.LATEST_SING_DATE]: { 
        label: '最新歌唱日',
        description: '最後に歌われた日付で並び替え', 
        icon: Calendar 
      }
    };
    
    return sortByInfo[sortBy] || { 
      label: '歌唱回数',
      description: '歌われた回数で並び替え', 
      icon: TrendingUp 
    };
  };

  const getSortOrderInfo = () => {
    const isDesc = sortOrder === SortOrder.DESC;
    
    switch (sortBy) {
      case SortBy.SING_COUNT:
        return {
          label: isDesc ? '多い順' : '少ない順',
          icon: isDesc ? ArrowDown : ArrowUp
        };
      case SortBy.LATEST_SING_DATE:
        return {
          label: isDesc ? '新しい順' : '古い順',
          icon: isDesc ? ArrowDown : ArrowUp
        };
      default:
        return {
          label: isDesc ? '降順' : '昇順',
          icon: isDesc ? ArrowDown : ArrowUp
        };
    }
  };

  const sortDisplayInfo = getSortDisplayInfo();
  const sortOrderInfo = getSortOrderInfo();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          並び順
        </h3>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <sortDisplayInfo.icon className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-sm text-gray-800">
              {sortDisplayInfo.label}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {sortDisplayInfo.description}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <sortOrderInfo.icon className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-sm text-gray-800">
              {sortOrderInfo.label}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            現在の表示順序
          </p>
        </div>
      </div>
    </div>
  );
};