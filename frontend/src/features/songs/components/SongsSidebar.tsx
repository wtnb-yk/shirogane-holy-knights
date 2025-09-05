'use client';

import React from 'react';
import { FilterableSidebar, SidebarSectionConfig } from '@/components/common/Sidebar/FilterableSidebar';
import { ContentTypeTabs, Tab } from '@/components/common/ContentTypeTabs';
import { SongSearchSection } from './SongsSidebar/SongSearchSection';
import { DatePresetsSection } from '@/components/common/DatePresetsSection';
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
    { value: SongContentType.STREAM, label: '歌枠' },
    { value: SongContentType.CONCERT, label: 'ライブ' }
  ];

  const sections: SidebarSectionConfig[] = [
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
    },
    {
      id: 'date-presets',
      component: DatePresetsSection,
      props: {
        filters,
        onFiltersChange,
        title: '歌唱日'
      }
    },
    {
      id: 'frequency-filter',
      component: SongFrequencySection,
      props: {
        filters,
        onFiltersChange,
      }
    },
  ];

  return (
    <FilterableSidebar
      sections={sections}
      width={width}
    />
  );
};
