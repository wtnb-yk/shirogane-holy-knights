/**
 * アルバムDTOの型定義
 */
export interface AlbumDto {
  id: string;
  title: string;
  artist: string;
  albumType: AlbumTypeDto;
  releaseDate?: string;
  coverImageUrl?: string;
  tracks: AlbumTrackDto[];
  musicReleases: MusicReleaseDto[];
}

/**
 * アルバムタイプDTOの型定義
 */
export interface AlbumTypeDto {
  id: number;
  name: string;
  description?: string;
}

/**
 * アルバムトラックDTOの型定義
 */
export interface AlbumTrackDto {
  songId: string;
  title: string;
  artist: string;
  trackNumber: number;
}

/**
 * 音楽リリースDTOの型定義
 */
export interface MusicReleaseDto {
  id: string;
  platformName: string;
  platformUrl: string;
  platformIconUrl?: string;
  releaseDate: string;
}

/**
 * アルバム検索パラメータの型定義 (統合版：一覧取得と検索機能を統合)
 * News実装パターンに完全準拠
 */
export interface AlbumSearchParamsDto {
  query?: string;
  albumTypes?: string[];
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

/**
 * アルバム検索結果の型定義
 */
export interface AlbumSearchResultDto {
  items: AlbumDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * フィルターオプションの型定義
 */
export interface AlbumFilterOptions {
  albumTypes?: string[];
  startDate?: string;
  endDate?: string;
}

/**
 * Lambda関数レスポンス用のエラー型定義
 */
export interface AlbumApiError {
  error: string;
  statusCode?: number;
}