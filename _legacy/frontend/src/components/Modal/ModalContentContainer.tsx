'use client';

import React from 'react';

export interface ModalContentItem<T extends string = string> {
  mode: T;
  content: React.ReactNode;
  transitionDirection?: 'left' | 'right';
}

export interface ModalContentContainerProps<T extends string = string> {
  currentMode: T;
  contents: ModalContentItem<T>[];
  transitionDuration?: number;
  className?: string;
}

export function ModalContentContainer<T extends string = string>({
  currentMode,
  contents,
  transitionDuration = 300,
  className = '',
}: ModalContentContainerProps<T>) {
  return (
    <div className={`relative ${className}`}>
      {contents.map((item) => {
        const isActive = item.mode === currentMode;

        let inactiveTransform = '';
        if (item.transitionDirection === 'left') {
          inactiveTransform = '-translate-x-5';
        } else if (item.transitionDirection === 'right') {
          inactiveTransform = 'translate-x-5';
        }

        return (
          <div
            key={item.mode}
            className={`
              transition-all ease-in-out
              ${isActive
                ? 'opacity-100 translate-x-0 pointer-events-auto relative'
                : `opacity-0 ${inactiveTransform} pointer-events-none absolute inset-0`
              }
            `}
            style={{ transitionDuration: `${transitionDuration}ms` }}
            aria-hidden={!isActive}
            role="region"
            aria-label={`${item.mode} content`}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
