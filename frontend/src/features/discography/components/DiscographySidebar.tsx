'use client';

import React from 'react';
import { AlbumFilterOptions } from '../types/types';
import { FilterableSidebar, SidebarSectionConfig } from '@/components/common/Sidebar/FilterableSidebar';
import { DiscographySearchSection } from './DiscographySidebar/DiscographySearchSection';
import { DiscographyFilterSection } from './DiscographySidebar/DiscographyFilterSection';

interface DiscographySidebarConfig {
  searchSection?: {
    title?: string;
  };
}

interface DiscographySidebarProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  filters: AlbumFilterOptions;
  setFilters: (filters: AlbumFilterOptions) => void;
  config?: DiscographySidebarConfig;
}

export const DiscographySidebar = ({
  searchValue,
  onSearch,
  onClearSearch,
  filters,
  setFilters,
  config = {}
}: DiscographySidebarProps) => {
  const {
    searchSection = {
      title: 'アルバム検索'
    }
  } = config;

  const sections: SidebarSectionConfig[] = [
    {
      id: 'discography-search',
      component: DiscographySearchSection,
      props: {
        searchValue,
        onSearch,
        onClearSearch,
        title: searchSection.title
      }
    },
    {
      id: 'discography-filter',
      component: DiscographyFilterSection,
      props: {
        filters,
        onFiltersChange: setFilters
      }
    }
  ];

  return (
    <FilterableSidebar
      sections={sections}
    />
  );
};