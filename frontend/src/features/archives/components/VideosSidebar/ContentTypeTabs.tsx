'use client';

import React from 'react';
import { ContentType } from '../../types/types';

interface ContentTypeTabsProps {
  contentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
}

export const ContentTypeTabs = ({
  contentType,
  onContentTypeChange
}: ContentTypeTabsProps) => {
  return (
    <div>
      <div className="flex bg-gray-200 p-1 rounded-lg">
        <button
          onClick={() => onContentTypeChange(ContentType.STREAMS)}
          className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all ${
            contentType === ContentType.STREAMS
              ? 'bg-white text-gray-900 shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          配信
        </button>
        <button
          onClick={() => onContentTypeChange(ContentType.VIDEOS)}
          className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all ${
            contentType === ContentType.VIDEOS
              ? 'bg-white text-gray-900 shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          動画
        </button>
      </div>
    </div>
  );
};