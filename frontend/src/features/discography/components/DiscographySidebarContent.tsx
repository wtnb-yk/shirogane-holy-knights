'use client';

import React from 'react';
import { AlbumFilterOptions } from '../types/types';
import { SidebarSection } from '@/components/common/Sidebar/internals/SidebarSection';
import { SidebarSectionConfig } from '@/types';
import { DiscographySearchSection } from './DiscographySidebar/DiscographySearchSection';
import { DiscographyFilterSection } from './DiscographySidebar/DiscographyFilterSection';

interface DiscographySidebarContentConfig {
  searchSection?: {
    title?: string;
  };
}

interface DiscographySidebarContentProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  filters: AlbumFilterOptions;
  setFilters: (filters: AlbumFilterOptions) => void;
  config?: DiscographySidebarContentConfig;
}

export const DiscographySidebarContent = ({
  searchValue,
  onSearch,
  onClearSearch,
  filters,
  setFilters,
  config = {}
}: DiscographySidebarContentProps) => {
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
