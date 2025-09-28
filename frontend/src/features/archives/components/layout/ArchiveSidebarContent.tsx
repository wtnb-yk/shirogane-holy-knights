'use client';

import React from 'react';
import { ContentType } from '../../types/types';
import { SidebarSection } from '@/components/Sidebar/internals/SidebarSection';
import { SidebarSectionConfig } from '@/types';
import { SegmentedControl, Tab } from '@/components/Input/SegmentedControl';
import { ArchiveSearchSection } from '../search/internals/ArchiveSearchSection';
import { SelectableList } from '@/components/List/SelectableList';
import { DatePresetsSection } from '@/components/Section/DatePresetsSection';
import { FilterOptions } from '../search/internals/ArchiveFilterSection';

interface ArchiveSidebarContentConfig {
  displayCategories?: string[];
  searchSection?: {
    title?: string;
    description?: string;
  };
}

interface ArchiveSidebarContentProps {
  contentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onFilterClick: () => void;
  hasActiveOptions: boolean;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  config?: ArchiveSidebarContentConfig;
  loading?: boolean;
}

export const ArchiveSidebarContent = ({
  contentType,
  onContentTypeChange,
  searchValue,
  onSearch,
  onClearSearch,
  onFilterClick,
  hasActiveOptions,
  filters,
  setFilters,
  config = {},
  loading = false
}: ArchiveSidebarContentProps) => {
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
        allOptionLabel: 'すべて',
        loading: loading
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
    <>
      {sections.map((section: any, index: number) => {
        const Component = section.component;
        const isLast = index === sections.length - 1;

        return (
          <SidebarSection
            key={section.id}
            noBorder={section.noBorder !== undefined ? section.noBorder : isLast}
          >
            <Component {...section.props} />
          </SidebarSection>
        );
      })}
    </>
  );
};
