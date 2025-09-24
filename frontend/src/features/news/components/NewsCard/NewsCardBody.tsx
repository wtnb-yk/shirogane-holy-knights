'use client';

import React from 'react';
import { NewsDto } from '../../types/types';

interface NewsCardBodyProps {
  news: NewsDto;
  isExternalLink: boolean;
}

export const NewsCardBody = ({ news, isExternalLink }: NewsCardBodyProps) => {
  return (
    <>
      {/* タイトル */}
      <h3 className={`font-semibold mb-2 text-text-primary ${
        isExternalLink
          ? 'text-sm md:text-base font-bold'
          : 'text-base md:text-lg hover:text-accent-blue transition-colors duration-ui'
      }`}>
        {news.title}
      </h3>

      {/* コンテンツ */}
      {news.content && (
        <p className="text-sm text-text-secondary mb-1 leading-normal">
          {news.content}
        </p>
      )}
    </>
  );
};