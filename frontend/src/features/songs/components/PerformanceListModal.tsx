'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody } from '@/components/ui/modal';
import { BottomSheet } from '@/components/common/BottomSheet/BottomSheet';
import { BottomSheetHeader } from '@/components/common/BottomSheet/BottomSheetHeader';
import { StreamSong, Performance } from '../types/types';
import { PerformanceListContent } from './PerformanceListContent';
import { useViewport } from '@/hooks/useViewport';

interface PerformanceListModalProps {
  song: StreamSong | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPerformancePlay?: (song: StreamSong, performance: Performance) => void;
}

export const PerformanceListModal = ({ song, open, onOpenChange, onPerformancePlay }: PerformanceListModalProps) => {
  const { isMobile, isLoaded } = useViewport();

  if (!song || !isLoaded) return null;

  const handleClose = () => onOpenChange(false);

  // スマホの場合はBottomSheetを表示
  if (isMobile) {
    return (
      <BottomSheet isOpen={open} onClose={handleClose}>
        <BottomSheetHeader
          title={`${song.title} - ${song.artist}`}
          onClose={handleClose}
        />
        <div className="flex-1 overflow-y-auto">
          <PerformanceListContent
            song={song}
            onPerformancePlay={onPerformancePlay}
            onClose={handleClose}
            isMobile={true}
          />
        </div>
      </BottomSheet>
    );
  }

  // デスクトップの場合はDialogを表示
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span className="font-bold text-gray-900">{song.title}</span>
            <span className="ml-3 font-medium text-gray-600 text-base">{song.artist}</span>
          </DialogTitle>
          <DialogClose onClose={handleClose} />
        </DialogHeader>
        <DialogBody className="p-0">
          <PerformanceListContent
            song={song}
            onPerformancePlay={onPerformancePlay}
            onClose={handleClose}
            isMobile={false}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
