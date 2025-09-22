'use client';

import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface Tab {
  value: string;
  label: string;
}

const contentTypeTabsVariants = cva(
  "flex rounded-lg border p-1 transition-all",
  {
    variants: {
      size: {
        sm: "text-xs gap-0.5 p-0.5 [&_button]:min-w-[60px] [&_button]:py-1.5 [&_button]:px-2",
        md: "text-sm gap-1 p-1 [&_button]:min-w-[80px] [&_button]:py-2 [&_button]:px-3",
        lg: "text-base gap-1.5 p-1.5 [&_button]:min-w-[100px] [&_button]:py-2.5 [&_button]:px-4"
      },
      variant: {
        default: "border-surface-border bg-bg-secondary",
        compact: "border-surface-border bg-bg-secondary [&>div]:inline-flex [&_button]:flex-none",
        minimal: "border-transparent bg-transparent"
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  }
);

const buttonVariants = cva(
  "font-medium transition-all rounded-md flex-1"
);

interface ContentTypeTabsProps extends VariantProps<typeof contentTypeTabsVariants> {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

export const ContentTypeTabs = ({ tabs, activeTab, onTabChange, size, variant, className }: ContentTypeTabsProps) => {
  return (
    <div className={cn(contentTypeTabsVariants({ size, variant }), className)}>
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