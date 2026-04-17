import { ImageResponse } from 'next/og';
import { loadOgFonts } from '@/lib/og/fonts';
import { OG, OgBaseTemplate, OgDefaultContent } from '@/lib/og/base-template';

export const runtime = 'edge';

export async function GET() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <OgBaseTemplate>
      <OgDefaultContent />
    </OgBaseTemplate>,
    {
      width: OG.width,
      height: OG.height,
      fonts,
    },
  );
}
