import { websiteJsonLd } from '@/lib/json-ld';
import { getStreams } from '@/lib/data/streams';
import { getUtawakuStreams } from '@/lib/data/music';
import { getAsmrStreams } from '@/lib/data/asmr';
import { Hero } from '@/features/home/components/hero';
import { HubStreams } from '@/features/home/components/hub-streams';
import { HubReportPreview } from '@/features/home/components/hub-report-preview';
import { HubSetlist } from '@/features/home/components/hub-setlist';
import { HubAsmrDraw } from '@/features/home/components/hub-asmr-draw';
import { HubFootprint } from '@/features/home/components/hub-footprint';

export default function Home() {
  const streams = getStreams();
  const utawakuStreams = getUtawakuStreams();
  const asmrStreams = getAsmrStreams();

  const latestStreams = streams.slice(0, 3);
  const thumbnails = streams.slice(0, 36).map((s) => s.thumbnailUrl);
  const latestUtawaku = utawakuStreams[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />

      <Hero thumbnails={thumbnails} />

      <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg pt-md pb-lg md:pt-lg md:pb-xl grid grid-cols-1 md:grid-cols-12 gap-md [&>*]:flex [&>*>*]:w-full">
        {/* Row 1 */}
        <div className="md:col-span-8">
          <HubStreams streams={latestStreams} />
        </div>
        <div className="md:col-span-4">
          <HubReportPreview allStreams={streams} />
        </div>

        {/* Row 2 */}
        <div className="md:col-span-5">
          {latestUtawaku && <HubSetlist stream={latestUtawaku} />}
        </div>
        <div className="md:col-span-4">
          <HubAsmrDraw count={asmrStreams.length} />
        </div>
        <div className="md:col-span-3">
          <HubFootprint />
        </div>
      </div>
    </>
  );
}
