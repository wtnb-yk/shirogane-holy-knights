'use client';

import React from 'react';

interface SpecialEventCardDescriptionProps {
  title: string;
  description: string;
}

export const SpecialEventCardDescription = React.memo(({ title, description }: SpecialEventCardDescriptionProps) => {
  return (
    <>
      <h3 className="text-xl font-bold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-secondary mb-4 line-clamp-3">
        {description}
      </p>
    </>
  );
});

SpecialEventCardDescription.displayName = 'SpecialEventCardDescription';
