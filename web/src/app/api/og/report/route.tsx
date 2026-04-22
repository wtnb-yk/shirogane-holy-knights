import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';
import { loadOgFonts } from '@/lib/og/fonts';
import { OG } from '@/lib/og/base-template';
import { getOgReportTheme } from '@/lib/og/report-theme';
import { ReportOgTemplate } from '@/lib/og/report-template';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const sc = Number(sp.get('sc'));
  const cr = Number(sp.get('cr'));
  if (!sc || Number.isNaN(sc) || Number.isNaN(cr)) {
    return new Response('Bad Request', { status: 400 });
  }

  const gStr = sp.get('g') ?? '';
  const genres = gStr
    ? gStr.split(',').map((p) => {
        const [name, c] = p.split(':');
        return { name: name || '', count: Number(c) || 0 };
      })
    : [];

  const data = {
    streamCount: sc,
    coverageRate: cr,
    weeklyAverage: Number(sp.get('wa')) || 0,
    maxStreak: Number(sp.get('ms')) || 0,
    favoriteSongCount: Number(sp.get('fs')) || 0,
    genres,
  };

  const themeKey = sp.get('t') ?? 'l';
  const theme = getOgReportTheme(themeKey);
  const fonts = await loadOgFonts();

  return new ImageResponse(<ReportOgTemplate data={data} theme={theme} />, {
    width: OG.width,
    height: OG.height,
    fonts,
  });
}
