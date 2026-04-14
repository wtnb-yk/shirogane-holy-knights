/**
 * 画像URL管理ユーティリティ
 * S3パスからCloudFront URLを生成、または外部URLをそのまま返す
 */

/**
 * 画像URLを生成する
 * @param url - S3相対パスまたは完全なURL
 * @returns 完全な画像URL
 */
export function getImageUrl(url: string | undefined | null): string | undefined {
  if (!url) {
    return undefined;
  }

  // 既に完全なURLの場合（http/httpsで始まる）はそのまま返す
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // CDN URLが設定されていない場合はundefinedを返す
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
  if (!cdnUrl) {
    console.warn('NEXT_PUBLIC_CDN_URL is not configured');
    return undefined;
  }

  // S3相対パスからCloudFront URLを生成
  // 先頭のスラッシュを除去（あれば）
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  
  // CDN URLの末尾のスラッシュを除去（あれば）
  const cleanCdnUrl = cdnUrl.endsWith('/') ? cdnUrl.slice(0, -1) : cdnUrl;
  
  return `${cleanCdnUrl}/${cleanPath}`;
}

/**
 * 画像URLが有効かチェックする
 * @param url - チェックするURL
 * @returns URLが有効な場合true
 */
export function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url) {
    return false;
  }

  // 完全なURLの場合
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true;
  }

  // CDN URLが設定されていて、相対パスが提供されている場合
  return !!process.env.NEXT_PUBLIC_CDN_URL;
}