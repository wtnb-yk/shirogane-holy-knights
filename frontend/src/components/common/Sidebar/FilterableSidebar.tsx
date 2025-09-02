'use client';

import React from 'react';
import { GenericSidebar, SidebarWidth } from './GenericSidebar';
import { SidebarSection } from './SidebarSection';

export interface SidebarSectionConfig<T = any> {
  id: string;
  component: React.ComponentType<T>;
  props: T;
  noBorder?: boolean;
}

interface FilterableSidebarProps<TFilters = any> {
  sections: SidebarSectionConfig[];
  width?: SidebarWidth | string;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const FilterableSidebar = <TFilters = any>({
  sections,
  width = 'md',
  responsive = true,
  className,
  style
}: FilterableSidebarProps<TFilters>) => {
  return (
    <GenericSidebar
      width={width}
      responsive={responsive}
      className={className}
      style={style}
    >
      {sections.map((section, index) => {
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
    </GenericSidebar>
  );
};