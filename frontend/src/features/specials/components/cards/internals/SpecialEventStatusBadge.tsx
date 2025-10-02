'use client';

import React from 'react';

interface SpecialEventStatusBadgeProps {
  status: 'upcoming' | 'active' | 'ended';
}

export const SpecialEventStatusBadge = React.memo(({ status }: SpecialEventStatusBadgeProps) => {
  const statusConfig = {
    active: {
      label: '開催中',
      className: 'bg-accent-green text-white'
    },
    upcoming: {
      label: '開催予定',
      className: 'bg-accent-blue text-white'
    },
    ended: {
      label: '終了',
      className: 'bg-surface-tertiary text-text-secondary'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
});

SpecialEventStatusBadge.displayName = 'SpecialEventStatusBadge';
