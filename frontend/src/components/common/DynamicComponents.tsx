'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Simple loading components for dynamic imports
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

const BottomSheetSkeleton = () => (
  <div className="fixed bottom-0 left-0 right-0 h-96 bg-white rounded-t-lg p-4">
    <Skeleton className="h-6 w-32 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-4" />
  </div>
);

const VideoSkeleton = () => (
  <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
    <Skeleton className="w-full h-full" />
  </div>
);

// Dynamic imports for heavy components with loading states
export const DynamicSearchOptionsModal = dynamic(
  () => import('@/features/archives/components/search/ArchiveSearchOptionsModal').then(mod => ({ default: mod.ArchiveSearchOptionsModal })),
  {
    loading: ModalSkeleton,
    ssr: false,
  }
);

export const DynamicBottomSheet = dynamic(
  () => import('@/components/common/BottomSheet/BottomSheet').then(mod => ({ default: mod.BottomSheet })),
  {
    loading: BottomSheetSkeleton,
    ssr: false,
  }
);

export const DynamicYouTubePlayer = dynamic(
  () => import('@/features/songs/components/display/player/YouTubePlayer').then(mod => ({ default: mod.YouTubePlayer })),
  {
    loading: VideoSkeleton,
    ssr: false,
  }
);


export const DynamicEventDetailModal = dynamic(
  () => import('@/features/calendar/components/EventDetailModal').then(mod => ({ default: mod.EventDetailModal })),
  {
    loading: ModalSkeleton,
    ssr: false,
  }
);

export const DynamicDayEventsModal = dynamic(
  () => import('@/features/calendar/components/DayEventsModal').then(mod => ({ default: mod.DayEventsModal })),
  {
    loading: ModalSkeleton,
    ssr: false,
  }
);
