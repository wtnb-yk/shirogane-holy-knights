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
  BASE_CONTENT: 10,

  // オーバーレイレイヤー (40-49)
  OVERLAY: {
    NAVIGATION: 40,     // ナビゲーション背景オーバーレイ
    MODAL: 50,          // モーダル背景オーバーレイ
    BOTTOM_SHEET: 50,   // ボトムシート背景オーバーレイ
  },

  // コンテンツレイヤー (53-60) - 競合回避のための階層化
  CONTENT: {
    FLOATING_LINK: 53,     // 浮動リンクボタン
    OFFLINE_INDICATOR: 54, // オフライン表示
    HEADER: 55,            // ヘッダー
    TOAST: 56,             // トースト通知
    MODAL: 57,             // モーダルコンテンツ
    BOTTOM_SHEET: 58,      // ボトムシートコンテンツ
    DROPDOWN: 59,          // ドロップダウンメニュー
    TOOLTIP: 60,           // ツールチップ
  }
} as const;

/**
 * Tailwindクラス用のz-index値
 * 使用例: className={`fixed inset-0 ${TAILWIND_Z_INDEX.OVERLAY.MODAL}`}
 */
export const TAILWIND_Z_INDEX = {
  BASE: 'z-0',
  BASE_CONTENT: 'z-10',

  OVERLAY: {
    NAVIGATION: 'z-40',
    MODAL: 'z-50',
    BOTTOM_SHEET: 'z-50',
  },

  CONTENT: {
    FLOATING_LINK: 'z-[53]',
    OFFLINE_INDICATOR: 'z-[54]',
    HEADER: 'z-[55]',
    TOAST: 'z-[56]',
    MODAL: 'z-[57]',
    BOTTOM_SHEET: 'z-[58]',
    DROPDOWN: 'z-[59]',
    TOOLTIP: 'z-[60]',
  }
} as const;

/**
 * z-index値の型定義
 */
export type ZIndexLayer = keyof typeof Z_INDEX;
export type ZIndexOverlay = keyof typeof Z_INDEX.OVERLAY;
export type ZIndexContent = keyof typeof Z_INDEX.CONTENT;
