'use client';

import React from 'react';
import { GenericSidebar, SidebarWidth } from './GenericSidebar';
import { SidebarSection } from '@/components';

export interface SidebarSectionConfig<T = any> {
  id: string;
  component: React.ComponentType<T>;
  props: T;
  noBorder?: boolean;
}

interface FilterableSidebarProps {
  sections: SidebarSectionConfig[];
  width?: SidebarWidth | string;
  className?: string;
  style?: React.CSSProperties;
}

export const FilterableSidebar = ({
  sections,
  width = 'md',
  className,
  style
}: FilterableSidebarProps) => {
  return (
    <GenericSidebar
      width={width}
      className={className}
      style={style}
    >
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
    </GenericSidebar>
  );
};
