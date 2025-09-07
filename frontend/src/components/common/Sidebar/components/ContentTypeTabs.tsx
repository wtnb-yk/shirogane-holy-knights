'use client';

import React from 'react';

export interface Tab {
  value: string;
  label: string;
}

interface ContentTypeOption {
  key: string;
  label: string;
}

interface ContentTypeTabsPropsWithOptions {
  options: ContentTypeOption[];
  selectedType: string;
  onTypeChange: (type: string) => void;
  className?: string;
  tabs?: never;
  activeTab?: never;
  onTabChange?: never;
}

interface ContentTypeTabsPropsWithTabs {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
  options?: never;
  selectedType?: never;
  onTypeChange?: never;
}

type ContentTypeTabsProps = ContentTypeTabsPropsWithOptions | ContentTypeTabsPropsWithTabs;

export const ContentTypeTabs = (props: ContentTypeTabsProps) => {
  const { className = "" } = props;
  
  // Tab[]形式の場合
  if ('tabs' in props && props.tabs) {
    const { tabs, activeTab, onTabChange } = props;
    const options = tabs.map(tab => ({ key: tab.value, label: tab.label }));
    return renderTabs(options, activeTab, onTabChange, className);
  }
  
  // ContentTypeOption[]形式の場合
  if ('options' in props && props.options) {
    const { options, selectedType, onTypeChange } = props;
    return renderTabs(options, selectedType, onTypeChange, className);
  }
  
  return null;
};

const renderTabs = (
  options: ContentTypeOption[],
  selectedType: string,
  onTypeChange: (type: string) => void,
  className: string
) => {
  return (
    <div className={className}>
      <div className="flex rounded-lg border border-surface-border p-1 bg-bg-secondary">
        {options.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onTypeChange(key)}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-all rounded-md ${
              selectedType === key
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};