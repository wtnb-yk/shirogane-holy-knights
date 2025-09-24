'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = '選択してください',
  className
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, showAbove: false });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(item => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const handleRemove = (option: string) => {
    onChange(value.filter(item => item !== option));
  };

  const updateDropdownPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const maxDropdownHeight = 320; // max-h-80 = 20rem = 320px
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // 下側に表示できるかチェック
      const canShowBelow = spaceBelow >= Math.min(maxDropdownHeight, 200); // 最低200px必要
      const canShowAbove = spaceAbove >= Math.min(maxDropdownHeight, 200);

      // より多くのスペースがある方向を選択、または下側を優先
      const showAbove = !canShowBelow && canShowAbove;

      setDropdownPosition({
        top: showAbove
          ? rect.top + window.scrollY - 4
          : rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
        showAbove
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition);
      window.addEventListener('resize', updateDropdownPosition);
    }

    return () => {
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        dropdownRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={cn('relative', className)}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-10 w-full items-center justify-between rounded-md border border-surface-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
      >
        <div className="flex-1 flex flex-wrap items-center gap-1 text-left">
          {value.length === 0 ? (
            <span className="text-text-secondary">{placeholder}</span>
          ) : (
            value.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded-md bg-accent-gold/90 px-2 py-1 text-xs text-white"
              >
                {item}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                  className="hover:bg-white/20 rounded-full p-0.5 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown className={cn('h-4 w-4 opacity-50 transition-transform ml-2 flex-shrink-0', isOpen && 'rotate-180')} />
      </button>

      {/* Dropdown Portal */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-52 max-h-80 overflow-auto rounded-md border border-surface-border bg-white shadow-lg"
          style={{
            [dropdownPosition.showAbove ? 'bottom' : 'top']: dropdownPosition.showAbove
              ? window.innerHeight - dropdownPosition.top
              : dropdownPosition.top,
            left: dropdownPosition.left,
          width: dropdownPosition.width,
            pointerEvents: 'auto',
          }}
        >
            <div className="p-1">
              {options.map((option) => {
                const isSelected = value.includes(option);
                return (
                  <div
                    key={option}
                    onClick={() => handleToggle(option)}
                    className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent-gold/10 focus:bg-accent-gold/10"
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {isSelected && <Check className="h-4 w-4 text-accent-gold" />}
                    </span>
                    <span className={cn(isSelected && 'font-medium')}>{option}</span>
                  </div>
                );
              })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
