'use client';

import React from 'react';
import { GenericSidebar } from './internals/GenericSidebar';
import { SidebarSection } from './internals/SidebarSection';

export interface SidebarSectionConfig<T = any> {
  id: string;
  component: React.ComponentType<T>;
  props: T;
  noBorder?: boolean;
}

interface FilterableSidebarProps {
  sections: SidebarSectionConfig[];
  className?: string;
  style?: React.CSSProperties;
}

export const FilterableSidebar = ({
  sections,
  className,
  style
}: FilterableSidebarProps) => {
  return (
    <GenericSidebar
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
