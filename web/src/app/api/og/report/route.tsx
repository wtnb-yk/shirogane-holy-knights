import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';
import { loadOgFonts } from '@/lib/og/fonts';
import { OG } from '@/lib/og/base-template';
import { getOgReportTheme } from '@/lib/og/report-theme';
import { ReportOgTemplate } from '@/lib/og/report-template';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('d');
  if (!raw) return new Response('Bad Request', { status: 400 });

  let decoded: string;
  try {
    decoded = decodeURIComponent(atob(raw));
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const parts = decoded.split(',');
  if (parts.length < 6) return new Response('Bad Request', { status: 400 });

  const sc = Number(parts[0]);
  if (!sc || Number.isNaN(sc))
    return new Response('Bad Request', { status: 400 });

  const genres = parts.slice(6).map((pair) => {
    const idx = pair.lastIndexOf(':');
    return {
      name: pair.slice(0, idx),
      count: Number(pair.slice(idx + 1)) || 0,
    };
  });

  const data = {
    streamCount: sc,
    coverageRate: Number(parts[1]) || 0,
    weeklyAverage: Number(parts[2]) || 0,
    maxStreak: Number(parts[3]) || 0,
    favoriteSongCount: Number(parts[4]) || 0,
    genres,
  };

  const themeKey = parts[5] || 'l';
  const theme = getOgReportTheme(themeKey);
  const fonts = await loadOgFonts();

  return new ImageResponse(<ReportOgTemplate data={data} theme={theme} />, {
    width: OG.width,
    height: OG.height,
    fonts,
  });
}
