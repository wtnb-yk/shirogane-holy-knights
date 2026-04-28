import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';
import { loadOgFonts } from '@/lib/og/fonts';
import { OG } from '@/lib/og/base-template';
import { FootprintOgTemplate } from '@/lib/og/footprint-template';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const yr = Number(sp.get('yr'));
  const ad = Number(sp.get('ad'));
  if (!yr || Number.isNaN(yr) || Number.isNaN(ad)) {
    return new Response('Bad Request', { status: 400 });
  }

  const data = {
    year: yr,
    activeDays: ad,
    maxStreak: Number(sp.get('ms')) || 0,
    totalChecks: Number(sp.get('tc')) || 0,
  };

  const fonts = await loadOgFonts();

  return new ImageResponse(<FootprintOgTemplate data={data} />, {
    width: OG.width,
    height: OG.height,
    fonts,
  });
}
