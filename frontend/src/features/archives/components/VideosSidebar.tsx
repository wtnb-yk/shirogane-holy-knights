'use client';

import React from 'react';
import { ContentType } from '../types/types';
import { FilterableSidebar, SidebarSectionConfig } from '@/components/common/Sidebar/FilterableSidebar';
import { ContentTypeTabs } from './VideosSidebar/ContentTypeTabs';
import { SearchSection } from './VideosSidebar/SearchSection';
import { CategoryFilter } from './VideosSidebar/CategoryFilter';

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
  filters: { selectedTags: string[] };
  setFilters: (filters: { selectedTags: string[] }) => void;
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
        selectedTags: []
      });
    } else {
      // 異なるタグをクリックした場合は、そのタグのみを選択
      setFilters({
        selectedTags: [tag]
      });
    }
  };

  const handleTagClear = () => {
    setFilters({
      selectedTags: []
    });
  };

  const sections: SidebarSectionConfig[] = [
    {
      id: 'content-tabs',
      component: ContentTypeTabs,
      props: {
        contentType,
        onContentTypeChange
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
    }
  ];

  return (
    <FilterableSidebar
      sections={sections}
      width={width}
    />
  );
};
