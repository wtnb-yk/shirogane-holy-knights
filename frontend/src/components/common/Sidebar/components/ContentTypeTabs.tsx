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
  "font-medium transition-all rounded-md",
  {
    variants: {
      size: {
        sm: "flex-1",
        md: "flex-1", 
        lg: "flex-1"
      },
      variant: {
        default: "",
        compact: "",
        minimal: ""
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  }
);

interface ContentTypeOption {
  key: string;
  label: string;
}

interface ContentTypeTabsPropsWithOptions extends VariantProps<typeof contentTypeTabsVariants> {
  options: ContentTypeOption[];
  selectedType: string;
  onTypeChange: (type: string) => void;
  className?: string;
  tabs?: never;
  activeTab?: never;
  onTabChange?: never;
}

interface ContentTypeTabsPropsWithTabs extends VariantProps<typeof contentTypeTabsVariants> {
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
  const { className, size, variant } = props;
  
  // Tab[]形式の場合
  if ('tabs' in props && props.tabs) {
    const { tabs, activeTab, onTabChange } = props;
    const options = tabs.map(tab => ({ key: tab.value, label: tab.label }));
    return renderTabs(options, activeTab, onTabChange, size, variant, className);
  }
  
  // ContentTypeOption[]形式の場合
  if ('options' in props && props.options) {
    const { options, selectedType, onTypeChange } = props;
    return renderTabs(options, selectedType, onTypeChange, size, variant, className);
  }
  
  return null;
};

const renderTabs = (
  options: ContentTypeOption[],
  selectedType: string,
  onTypeChange: (type: string) => void,
  size?: "sm" | "md" | "lg" | null,
  variant?: "default" | "compact" | "minimal" | null,
  className?: string
) => {
  return (
    <div className={cn(contentTypeTabsVariants({ size, variant }), className)}>
      <div className="flex w-full">
        {options.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onTypeChange(key)}
            className={cn(
              buttonVariants({ size, variant }),
              selectedType === key
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