'use client';

import React from 'react';

export interface Tab {
  value: string;
  label: string;
}

interface ContentTypeTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const ContentTypeTabs = ({
  tabs,
  activeTab,
  onTabChange
}: ContentTypeTabsProps) => {
  return (
    <div>
      <div className="flex bg-gray-200 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.value
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};