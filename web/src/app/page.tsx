import { websiteJsonLd } from '@/lib/json-ld';
import { getStreams } from '@/lib/data/streams';
import { getSongs } from '@/lib/data/music';
import { getAsmrStreams } from '@/lib/data/asmr';
import { Hero } from '@/features/home/components/hero';
import { StreamGrid } from '@/features/home/components/stream-grid';
import { SidebarActivity } from '@/features/home/components/sidebar-activity';
import { SidebarMusic } from '@/features/home/components/sidebar-music';
import { SidebarAsmr } from '@/features/home/components/sidebar-asmr';

export default function Home() {
  const streams = getStreams();
  const songs = getSongs();
  const asmrStreams = getAsmrStreams();

  const latestStreams = streams.slice(0, 4);
  const thumbnails = streams.slice(0, 20).map((s) => s.thumbnailUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />

      <Hero
        streamCount={streams.length}
        songCount={songs.length}
        asmrCount={asmrStreams.length}
        thumbnails={thumbnails}
      />

      <div className="max-w-[var(--content-max)] mx-auto px-md md:px-lg pt-lg pb-xl md:pt-xl md:pb-2xl grid grid-cols-1 md:grid-cols-[1fr_340px] gap-lg">
        {/* 左: 最新の配信 */}
        <StreamGrid streams={latestStreams} totalCount={streams.length} />

        {/* 右: サイドバー */}
        <aside className="flex flex-col gap-md">
          <SidebarActivity />
          <SidebarMusic songs={songs} />
          <SidebarAsmr count={asmrStreams.length} />
        </aside>
      </div>
    </>
  );
}
