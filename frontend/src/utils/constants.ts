/**
 * アプリケーション全体で使用される定数
 */

// ページネーション関連
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  ALLOWED_PAGE_SIZES: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1
} as const;

// 検索関連
export const SEARCH = {
  MIN_QUERY_LENGTH: 1,
  MAX_QUERY_LENGTH: 100,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 1000
} as const;

// 日付関連
export const DATE_FORMATS = {
  DISPLAY: 'ja-JP',
  ISO: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss'
} as const;

// アニメーション関連
export const ANIMATION = {
  DURATION: {
    FAST: 150,
    NORMAL: 200,
    SLOW: 300
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out'
  },
  STAGGER_DELAY: 50
} as const;

// レスポンシブブレークポイント
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

// グリッドレイアウト
export const GRID = {
  COLUMNS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 3,
    WIDE: 4
  },
  GAP: {
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem'
  }
} as const;

// カード関連
export const CARD = {
  MAX_TAGS_DISPLAY: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 200
} as const;

// API関連
export const API = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const;

// ファイル関連
export const FILE = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm']
} as const;

// バリデーション関連
export const VALIDATION = {
  EMAIL_MAX_LENGTH: 254,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30
} as const;

// ローカルストレージキー
export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
  USER_PREFERENCES: 'userPreferences',
  SEARCH_HISTORY: 'searchHistory'
} as const;

// エラーメッセージ
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  VALIDATION_ERROR: '入力内容に誤りがあります',
  NOT_FOUND: 'データが見つかりません',
  UNAUTHORIZED: '認証が必要です',
  FORBIDDEN: 'アクセス権限がありません',
  SERVER_ERROR: 'サーバーエラーが発生しました'
} as const;

// 成功メッセージ
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: '保存しました',
  DELETE_SUCCESS: '削除しました',
  UPDATE_SUCCESS: '更新しました',
  COPY_SUCCESS: 'コピーしました'
} as const;

// ソート関連
export const SORT = {
  DIRECTIONS: ['ASC', 'DESC'] as const,
  DEFAULT_DIRECTION: 'DESC' as const
} as const;

// コンテンツタイプ
export const CONTENT_TYPES = {
  VIDEO: 'video',
  STREAM: 'stream',
  NEWS: 'news',
  SONG: 'song',
  EVENT: 'event'
} as const;