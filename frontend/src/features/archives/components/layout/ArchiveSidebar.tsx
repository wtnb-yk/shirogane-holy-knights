'use client';

import React from 'react';
import { ContentType } from '../../types/types';
import { FilterableSidebar, SidebarSectionConfig } from '@/components/common/Sidebar/FilterableSidebar';
import { SegmentedControl, Tab } from '@/components/common/Sidebar/SegmentedControl';
import { ArchiveSearchSection } from '../search/internals/ArchiveSearchSection';
import { SelectableList } from '@/components/common/SelectableList';
import { DatePresetsSection } from '@/components/common/DatePresetsSection';
import { FilterOptions } from '../search/ArchiveFilterSection';

interface ArchiveSidebarConfig {
  displayCategories?: string[];
  searchSection?: {
    title?: string;
    description?: string;
  };
}

interface ArchiveSidebarProps {
  contentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onFilterClick: () => void;
  hasActiveOptions: boolean;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  config?: ArchiveSidebarConfig;
}

export const ArchiveSidebar = ({
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
}: ArchiveSidebarProps) => {
  const {
    displayCategories = ['雑談', 'ゲーム','ASMR', '歌枠', 'コラボ'],
    searchSection = {}
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
      component: SegmentedControl,
      props: {
        tabs: contentTypeTabs,
        activeTab: contentType,
        onTabChange: onContentTypeChange
      }
    },
    {
      id: 'search',
      component: ArchiveSearchSection,
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
    ...(contentType === ContentType.STREAMS ? [{
      id: 'category-filter',
      component: SelectableList,
      props: {
        title: 'タグ',
        items: displayCategories,
        selectedItems: filters.selectedTags || [],
        onItemToggle: handleTagToggle,
        onClearAll: handleTagClear,
        allOptionLabel: 'すべて'
      }
    }] : []),
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
    />
  );
};
