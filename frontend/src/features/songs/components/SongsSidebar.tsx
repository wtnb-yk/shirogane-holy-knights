'use client';

import React from 'react';
import { FilterableSidebar, SidebarSectionConfig } from '@/components/common/Sidebar/FilterableSidebar';
import { SongSearchSection } from './SongsSidebar/SongSearchSection';

interface SongsSidebarConfig {
  searchSection?: {
    title?: string;
  };
  width?: 'sm' | 'md' | 'lg' | string;
  responsive?: boolean;
}

interface SongsSidebarProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onOptionsClick: () => void;
  hasActiveOptions: boolean;
  config?: SongsSidebarConfig;
}

export const SongsSidebar = ({
  searchValue,
  onSearch,
  onClearSearch,
  onOptionsClick,
  hasActiveOptions,
  config = {}
}: SongsSidebarProps) => {
  const {
    searchSection = {
      title: '楽曲検索'
    },
    width = 'lg',
    responsive = true
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
  ];

  return (
    <FilterableSidebar
      sections={sections}
      width={width}
      responsive={responsive}
    />
  );
};
