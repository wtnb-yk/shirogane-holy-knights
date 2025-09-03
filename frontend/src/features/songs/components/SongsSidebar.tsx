'use client';

import React from 'react';
import { FilterableSidebar, SidebarSectionConfig } from '@/components/common/Sidebar/FilterableSidebar';
import { SongSearchSection } from './SongsSidebar/SongSearchSection';
import { SongDatePresetsSection } from './SongsSidebar/SongDatePresetsSection';
import { SongFrequencySection } from './SongsSidebar/SongFrequencySection';
import { SongFilterOptions } from '../types/types';

interface SongsSidebarConfig {
  searchSection?: {
    title?: string;
  };
  width?: 'sm' | 'md' | 'lg' | string;
}

interface SongsSidebarProps {
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

  const sections: SidebarSectionConfig[] = [
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
      component: SongDatePresetsSection,
      props: {
        filters,
        onFiltersChange,
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
