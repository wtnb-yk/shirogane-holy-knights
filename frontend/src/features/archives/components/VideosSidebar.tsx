'use client';

import React from 'react';
import { ContentType } from '../types/types';
import { FilterableSidebar, SidebarSectionConfig } from '@/components/common/Sidebar/FilterableSidebar';
import { ContentTypeTabs, Tab } from '@/components/common/ContentTypeTabs';
import { SearchSection } from './VideosSidebar/SearchSection';
import { CategoryFilter } from './VideosSidebar/CategoryFilter';
import { DatePresetsSection } from '@/components/common/DatePresetsSection';
import { FilterOptions } from './filter/VideoFilterSection';

interface VideosSidebarConfig {
  displayCategories?: string[];
  searchSection?: {
    title?: string;
    description?: string;
  };
  width?: 'sm' | 'md' | 'lg' | string;
}

interface VideosSidebarProps {
  contentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onFilterClick: () => void;
  hasActiveOptions: boolean;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  config?: VideosSidebarConfig;
}

export const VideosSidebar = ({
  contentType,
  onContentTypeChange,
  searchValue,
  onSearch,
  onClearSearch,
  onFilterClick,
  hasActiveOptions,
  filters,
  setFilters,
  config = {}
}: VideosSidebarProps) => {
  const {
    displayCategories = ['雑談', 'ゲーム','ASMR', '歌枠', 'コラボ'],
    searchSection = {},
    width = 'lg'
  } = config;

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.selectedTags || [];
    if (currentTags.includes(tag)) {
      // 同じタグをクリックした場合は選択解除
      setFilters({
        ...filters,
        selectedTags: []
      });
    } else {
      // 異なるタグをクリックした場合は、そのタグのみを選択
      setFilters({
        ...filters,
        selectedTags: [tag]
      });
    }
  };

  const handleTagClear = () => {
    setFilters({
      ...filters,
      selectedTags: []
    });
  };

  const contentTypeTabs: Tab[] = [
    { value: ContentType.STREAMS, label: '配信' },
    { value: ContentType.VIDEOS, label: '動画' }
  ];

  const sections: SidebarSectionConfig[] = [
    {
      id: 'content-tabs',
      component: ContentTypeTabs,
      props: {
        tabs: contentTypeTabs,
        activeTab: contentType,
        onTabChange: onContentTypeChange
      }
    },
    {
      id: 'search',
      component: SearchSection,
      props: {
        searchValue,
        onSearch,
        onClearSearch,
        onFilterClick,
        hasActiveOptions,
        title: searchSection.title,
        description: searchSection.description
      }
    },
    {
      id: 'category-filter',
      component: CategoryFilter,
      props: {
        categories: displayCategories,
        selectedCategories: filters.selectedTags || [],
        onCategoryToggle: handleTagToggle,
        onClearAll: handleTagClear
      }
    },
    {
      id: 'date-presets',
      component: DatePresetsSection,
      props: {
        filters,
        onFiltersChange: setFilters,
        title: '配信日'
      }
    }
  ];

  return (
    <FilterableSidebar
       sections={sections}
      width={width}
    />
  );
};
