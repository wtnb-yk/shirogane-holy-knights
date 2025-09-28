'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/Loading/skeleton';

// Loading skeletons for dynamic imports
const ModalSkeleton = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-10 w-20" />
    </div>
  </div>
);

const VideoSkeleton = () => (
  <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
    <Skeleton className="w-full h-full" />
  </div>
);

// Dynamic imports for heavy components with conditional rendering

// Core Modal components - used only when modals are opened
export const DynamicModal = dynamic(
  () => import('@/components/Modal/Modal').then(mod => ({ default: mod.Modal })),
  {
    loading: ModalSkeleton,
    ssr: false,
  }
);

export const DynamicResponsiveModal = dynamic(
  () => import('@/components/Modal/ResponsiveModal').then(mod => ({ default: mod.ResponsiveModal })),
  {
    loading: ModalSkeleton,
    ssr: false,
  }
);

export const DynamicSearchOptionsModal = dynamic(
  () => import('@/components/Modal/SearchOptionsModal').then(mod => ({ default: mod.SearchOptionsModal })),
  {
    loading: ModalSkeleton,
    ssr: false,
  }
);

// YouTubePlayer - heavy due to react-youtube dependency
export const DynamicYouTubePlayer = dynamic(
  () => import('@/features/songs/components/player/internals/YouTubePlayer').then(mod => ({ default: mod.YouTubePlayer })),
  {
    loading: VideoSkeleton,
    ssr: false,
  }
);
