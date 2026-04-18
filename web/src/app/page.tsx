import { Cover } from '@/features/home/components/cover';
import { BentoGrid } from '@/features/home/components/bento-grid';
import { websiteJsonLd } from '@/lib/json-ld';

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <Cover />
      <BentoGrid />
    </>
  );
}
