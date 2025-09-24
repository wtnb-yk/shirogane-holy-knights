'use client';

import React from 'react';
import { NewsFilterOptions } from '../types/types';
import { FilterableSidebar, SidebarSectionConfig } from '@/components/common/Sidebar/FilterableSidebar';
import { NewsSearchSection } from './NewsSidebar/NewsSearchSection';
import { NewsCategorySection } from './NewsSidebar/NewsCategorySection';

interface NewsSidebarConfig {
  searchSection?: {
    title?: string;
  };
}

interface NewsSidebarProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  filters: NewsFilterOptions;
  setFilters: (filters: NewsFilterOptions) => void;
  config?: NewsSidebarConfig;
}

export const NewsSidebar = ({
  searchValue,
  onSearch,
  onClearSearch,
  filters,
  setFilters,
  config = {}
}: NewsSidebarProps) => {
  const {
    searchSection = {
      title: 'ニュース検索'
    }
  } = config;

  const sections: SidebarSectionConfig[] = [
    {
      id: 'news-search',
      component: NewsSearchSection,
      props: {
        searchValue,
        onSearch,
        onClearSearch,
        title: searchSection.title
      }
    },
    {
      id: 'news-category',
      component: NewsCategorySection,
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