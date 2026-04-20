import { Cover } from '@/features/home/components/cover';
import { TodaySection } from '@/features/home/components/today-section';
import { MyLogSection } from '@/features/home/components/my-log-section';
import { BentoGrid } from '@/features/home/components/bento-grid';
import { SectionDivider } from '@/components/ui/section-divider';
import { websiteJsonLd } from '@/lib/json-ld';

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <Cover />
      <TodaySection />
      <SectionDivider />
      <MyLogSection />
      <SectionDivider />
      <BentoGrid />
    </>
  );
}
