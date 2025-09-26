/**
 * z-index値の一元管理
 * レイヤー構成：
 * - 0-9: 基本コンテンツ
 * - 10-39: ページ内要素
 * - 40-49: オーバーレイ
 * - 50-59: モーダル・ポップアップ
 */
export const Z_INDEX = {
  // 基本レイヤー (0-9)
  BASE: 0,
  CONTENT: 10,

  // オーバーレイレイヤー (40-49)
  OVERLAY: {
    NAVIGATION: 40,     // ナビゲーション背景オーバーレイ
    MODAL: 50,          // モーダル背景オーバーレイ
    BOTTOM_SHEET: 50,   // ボトムシート背景オーバーレイ
  },

  // コンテンツレイヤー (50-59)
  CONTENT: {
    HEADER: 50,         // ヘッダー
    MODAL: 50,          // モーダルコンテンツ
    BOTTOM_SHEET: 51,   // ボトムシートコンテンツ
    DROPDOWN: 52,       // ドロップダウンメニュー
    TOAST: 50,          // トースト通知
    TOOLTIP: 50,        // ツールチップ
    OFFLINE_INDICATOR: 50, // オフライン表示
    FLOATING_LINK: 50,  // 浮動リンクボタン
  }
} as const;

/**
 * Tailwindクラス用のz-index値
 * 使用例: className={`fixed inset-0 ${TAILWIND_Z_INDEX.OVERLAY.MODAL}`}
 */
export const TAILWIND_Z_INDEX = {
  BASE: 'z-0',
  CONTENT: 'z-10',

  OVERLAY: {
    NAVIGATION: 'z-40',
    MODAL: 'z-50',
    BOTTOM_SHEET: 'z-50',
  },

  CONTENT: {
    HEADER: 'z-50',
    MODAL: 'z-50',
    BOTTOM_SHEET: 'z-[51]',
    DROPDOWN: 'z-[52]',
    TOAST: 'z-50',
    TOOLTIP: 'z-50',
    OFFLINE_INDICATOR: 'z-50',
    FLOATING_LINK: 'z-50',
  }
} as const;

/**
 * z-index値の型定義
 */
export type ZIndexLayer = keyof typeof Z_INDEX;
export type ZIndexOverlay = keyof typeof Z_INDEX.OVERLAY;
export type ZIndexContent = keyof typeof Z_INDEX.CONTENT;