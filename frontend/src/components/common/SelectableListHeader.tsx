'use client';

import React from 'react';

interface SelectableListHeaderProps {
  title?: string;
}

export const SelectableListHeader = ({ title }: SelectableListHeaderProps) => {
  if (!title) return null;

  return (
    <h3 className="text-base font-bold text-text-primary mb-3">
      {title}
    </h3>
  );
};