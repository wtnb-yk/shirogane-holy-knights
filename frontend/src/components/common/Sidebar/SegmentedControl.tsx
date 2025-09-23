'use client';

import React from 'react';
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface Tab {
  value: string;
  label: string;
}

const segmentedControlVariants = cva(
  "flex rounded-lg border p-1 transition-all text-sm gap-1 border-surface-border bg-bg-secondary [&>div]:inline-flex [&_button]:flex-none [&_button]:min-w-[80px] [&_button]:py-2 [&_button]:px-3"
);

const buttonVariants = cva(
  "font-medium transition-all rounded-md flex-1"
);

interface SegmentedControlProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl = ({ tabs, activeTab, onTabChange, className }: SegmentedControlProps) => {
  return (
    <div className={cn(segmentedControlVariants(), className)}>
      <div className="flex w-full">
        {tabs.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onTabChange(value)}
            className={cn(
              buttonVariants(),
              activeTab === value
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};