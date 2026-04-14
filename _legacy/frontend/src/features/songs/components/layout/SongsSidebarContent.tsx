'use client';

import React from 'react';
import { SidebarSection } from '@/components/Sidebar/internals/SidebarSection';
import { SidebarSectionConfig } from '@/types';
import { SegmentedControl, Tab } from '@/components/Input/SegmentedControl';
import { SongSearchSection } from '../search/internals/SongSearchSection';
import { DatePresetsSection } from '@/components/Section/DatePresetsSection';
import { YearPresetsSection } from '@/components/Section/YearPresetsSection';
import { SongFrequencySection } from '../search/internals/SongFrequencySection';
import { SongFilterOptions, SongContentType } from '@/features/songs/types/types';

interface SongsSidebarContentConfig {
  searchSection?: {
    title?: string;
  };
}

interface SongsSidebarContentProps {
  songContentType: SongContentType;
  onSongContentTypeChange: (type: SongContentType) => void;
  searchValue: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onOptionsClick: () => void;
  hasActiveOptions: boolean;
  filters: SongFilterOptions;
  onFiltersChange: (filters: SongFilterOptions) => void;
  config?: SongsSidebarContentConfig;
}

export const SongsSidebarContent = ({
  songContentType,
  onSongContentTypeChange,
  searchValue,
  onSearch,
  onClearSearch,
  onOptionsClick,
  hasActiveOptions,
  filters,
  onFiltersChange,
  config = {}
}: SongsSidebarContentProps) => {
  const {
    searchSection = {
      title: '楽曲検索'
    }
  } = config;

  const songContentTypeTabs: Tab[] = [
    { value: SongContentType.CONCERT, label: 'ライブ' },
    { value: SongContentType.STREAM, label: '歌枠' }
  ];

  const baseSections: SidebarSectionConfig[] = [
    {
      id: 'content-tabs',
      component: SegmentedControl,
      props: {
        tabs: songContentTypeTabs,
        activeTab: songContentType,
        onTabChange: onSongContentTypeChange
      }
    },
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
    }
  ];

  // ライブタブの場合は年単位の歌唱日フィルター、歌枠タブの場合は通常の歌唱日フィルター＋歌唱回数
  const dateSection: SidebarSectionConfig = songContentType === SongContentType.CONCERT 
    ? {
        id: 'year-presets',
        component: YearPresetsSection,
        props: {
          filters,
          onFiltersChange,
          title: '歌唱日'
        }
      }
    : {
        id: 'date-presets',
        component: DatePresetsSection,
        props: {
          filters,
          onFiltersChange,
          title: '歌唱日'
        }
      };

  const sections: SidebarSectionConfig[] = [...baseSections, dateSection];
  
  // 歌枠タブの場合のみ歌唱回数フィルターを追加
  if (songContentType === SongContentType.STREAM) {
    sections.push({
      id: 'frequency-filter',
      component: SongFrequencySection,
      props: {
        filters,
        onFiltersChange,
      }
    });
  }

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
