'use client';

import React from 'react';
import { FilterableSidebar, SidebarSectionConfig } from '@/components/common/Sidebar/FilterableSidebar';
import { ContentTypeTabs, Tab } from '@/components/common/ContentTypeTabs';
import { SongSearchSection } from './SongsSidebar/SongSearchSection';
import { DatePresetsSection } from '@/components/common/DatePresetsSection';
import { YearPresetsSection } from '@/components/common/YearPresetsSection';
import { SongFrequencySection } from './SongsSidebar/SongFrequencySection';
import { SongFilterOptions, SongContentType } from '../types/types';

interface SongsSidebarConfig {
  searchSection?: {
    title?: string;
  };
  width?: 'sm' | 'md' | 'lg' | string;
}

interface SongsSidebarProps {
  songContentType: SongContentType;
  onSongContentTypeChange: (type: SongContentType) => void;
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onOptionsClick: () => void;
  hasActiveOptions: boolean;
  filters: SongFilterOptions;
  onFiltersChange: (filters: SongFilterOptions) => void;
  config?: SongsSidebarConfig;
}

export const SongsSidebar = ({
  songContentType,
  onSongContentTypeChange,
  searchValue,
  onSearch,
  onClearSearch,
  onOptionsClick,
  hasActiveOptions,
  filters,
  onFiltersChange,
  config = {}
}: SongsSidebarProps) => {
  const {
    searchSection = {
      title: '楽曲検索'
    },
    width = 'lg'
  } = config;

  const songContentTypeTabs: Tab[] = [
    { value: SongContentType.CONCERT, label: 'ライブ' },
    { value: SongContentType.STREAM, label: '歌枠' }
  ];

  const baseSections: SidebarSectionConfig[] = [
    {
      id: 'content-tabs',
      component: ContentTypeTabs,
      props: {
        tabs: songContentTypeTabs,
        activeTab: songContentType,
        onTabChange: onSongContentTypeChange
      }
    },
    {
      id: 'song-search',
      component: SongSearchSection,
      props: {
        searchValue,
        onSearch,
        onClearSearch,
        onOptionsClick,
        hasActiveOptions,
        title: searchSection.title,
      }
    }
  ];

  // ライブタブの場合は年単位の歌唱日フィルター、歌枠タブの場合は通常の歌唱日フィルター＋歌唱頻度
  const dateSection: SidebarSectionConfig = songContentType === SongContentType.CONCERT 
    ? {
        id: 'year-presets',
        component: YearPresetsSection,
        props: {
          filters,
          onFiltersChange,
          title: '歌唱日'
        }
      }
    : {
        id: 'date-presets',
        component: DatePresetsSection,
        props: {
          filters,
          onFiltersChange,
          title: '歌唱日'
        }
      };

  const sections: SidebarSectionConfig[] = [...baseSections, dateSection];
  
  // 歌枠タブの場合のみ歌唱頻度フィルターを追加
  if (songContentType === SongContentType.STREAM) {
    sections.push({
      id: 'frequency-filter',
      component: SongFrequencySection,
      props: {
        filters,
        onFiltersChange,
      }
    });
  }

  return (
    <FilterableSidebar
      sections={sections}
      width={width}
    />
  );
};
