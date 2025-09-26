'use client';

import React from 'react';
import { NewsFilterOptions } from '../../types/types';
import { SidebarSection } from '@/components/common/Sidebar/internals/SidebarSection';
import { SidebarSectionConfig } from '@/types';
import { NewsSearchSection } from './internals/NewsSearchSection';
import { NewsCategorySection } from './internals/NewsCategorySection';

interface NewsSidebarContentConfig {
  searchSection?: {
    title?: string;
  };
}

interface NewsSidebarContentProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  filters: NewsFilterOptions;
  setFilters: (filters: NewsFilterOptions) => void;
  config?: NewsSidebarContentConfig;
}

export const NewsSidebarContent = ({
  searchValue,
  onSearch,
  onClearSearch,
  filters,
  setFilters,
  config = {}
}: NewsSidebarContentProps) => {
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
