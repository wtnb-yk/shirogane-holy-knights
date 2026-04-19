import { toPng } from 'html-to-image';

/**
 * DOM要素をPNG画像のdata URLとしてキャプチャする
 *
 * フォントの読み込みを待ってからキャプチャを実行する。
 */
export async function captureCardAsDataUrl(el: HTMLElement): Promise<string> {
  await document.fonts.ready;
  return toPng(el, { pixelRatio: 2, cacheBust: true });
}

/** data URL をファイルとしてダウンロードする */
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
