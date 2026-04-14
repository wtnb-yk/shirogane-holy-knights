/**
 * アルバムタイプの変換ユーティリティ
 * 英語のアルバムタイプ名を日本語に変換する
 */

export type AlbumTypeName = 'Album' | 'Single' | 'EP' | 'Compilation';

/**
 * アルバムタイプの英語→日本語マッピング
 */
const ALBUM_TYPE_JP_MAP: Record<AlbumTypeName, string> = {
  'Album': 'フルアルバム',
  'Single': 'シングル',
  'EP': 'ミニアルバム',
  'Compilation': 'コンピレーション'
} as const;

/**
 * アルバムタイプ名を日本語に変換
 * @param typeName 英語のアルバムタイプ名
 * @returns 日本語のアルバムタイプ名
 */
export const convertAlbumTypeToJapanese = (typeName: string): string => {
  if (typeName in ALBUM_TYPE_JP_MAP) {
    return ALBUM_TYPE_JP_MAP[typeName as AlbumTypeName];
  }

  // 未知のタイプの場合は元の値をそのまま返す
  console.warn(`Unknown album type: ${typeName}`);
  return typeName;
};

/**
 * アルバムタイプの表示名を取得（日本語優先）
 * @param typeName 英語のアルバムタイプ名
 * @returns 日本語のアルバムタイプ名
 */
export const getAlbumTypeDisplayName = (typeName: string): string => {
  return convertAlbumTypeToJapanese(typeName);
};

/**
 * 全てのアルバムタイプの日本語マッピングを取得
 * @returns アルバムタイプの英語→日本語マッピング
 */
export const getAllAlbumTypeJapaneseMap = (): Record<string, string> => {
  return { ...ALBUM_TYPE_JP_MAP };
};