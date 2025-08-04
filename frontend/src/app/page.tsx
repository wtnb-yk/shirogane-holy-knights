import React from 'react';
import HeroSection from '@/features/home/components/HeroSection';
import ProfileSection from '@/features/home/components/ProfileSection';
import CharmsSection from '@/features/home/components/CharmsSection';
import StatsSection from '@/features/home/components/StatsSection';
import NewsPreviewSection from '@/features/home/components/NewsPreviewSection';
import ArchivePreviewSection from '@/features/home/components/ArchivePreviewSection';
import YouTubeLinkSection from '@/features/home/components/YouTubeLinkSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProfileSection />
      <CharmsSection />
      <StatsSection />
      <NewsPreviewSection />
      <ArchivePreviewSection />
      <YouTubeLinkSection />
    </div>
  );
}
