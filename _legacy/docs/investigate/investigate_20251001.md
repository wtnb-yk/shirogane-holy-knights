# ボタンコンポーネント共通化調査レポート

## 作成日: 2025-10-01
## ブランチ: feature/button-component-consolidation

---

## 1. 調査概要

プロジェクト全体のボタン実装状況を調査し、共通化の必要性と実装方針を決定する。

---

## 2. 現状分析

### 2.1 既存ボタンコンポーネント

**Button.tsx** (`/frontend/src/components/Button/Button.tsx`)
- バリアント: primary, secondary, outline, ghost
- サイズ: sm, md, lg
- 使用状況: わずか3ファイル（11.5%）
- 問題: アイコン非対応、CVA未使用、バリアント不足

**SearchOptionsButton.tsx**
- 存在するが4つの検索セクションで使われていない
- 代わりに全く同じコードが4ファイルで重複

**その他の特殊ボタン**
- FilterToggleButton.tsx - ほぼ未使用
- ModalButton.tsx - 固定スタイルで柔軟性なし
- EventExternalLinkButton.tsx - 個別実装
- HamburgerButton.tsx - 個別実装

### 2.2 インライン実装の状況

**検索セクション（重複コード）**
- 4ファイルで全く同じボタンコードが重複
- TODOコメント「共通化」が放置

**ヘッダーコンポーネント**
- ModalHeader.tsx: 戻る・閉じるボタンをインライン実装
- BottomSheetHeader.tsx: ModalHeaderと同じパターンを重複実装

**その他**
- Pagination.tsx: ページボタン、ナビゲーションボタンをインライン実装
- SegmentedControl.tsx: CVA使用済みの独自実装
- Toast.tsx: アクション・閉じるボタンをインライン実装
- CalendarHeader.tsx: ナビゲーションボタンをインライン、今日ボタンはButton.tsx使用（混在）

### 2.3 統計

- `<button>`使用ファイル: 26ファイル
- Button.tsx使用: 3ファイル（11.5%）
- インライン実装: 23ファイル（88.5%）
- **良い点**: 全てで`<button>`要素を正しく使用（`<div onClick>`等のアンチパターンなし）

---

## 3. 根本原因

### 3.1 Button.tsxが使われない理由

1. **機能不足**
   - アイコン非対応
   - ローディング状態なし
   - バリアント不足（4種類のみ）
   - サイズ不足（xs, xlがない）

2. **CVA未使用**
   - テンプレートリテラルで実装
   - 拡張性が低い

3. **デザイン責任の分散**
   - 使う側が毎回デザインを書く
   - 本来コンポーネント側で定義すべき

### 3.2 コード重複

- SearchOptionsButton存在するのに使われず、4ファイルで重複
- ModalHeader/BottomSheetHeaderで同じパターン重複
- 共通化できるのに個別実装

---

## 4. 解決方針

### 4.1 設計原則

**デザインの完全集約**
```tsx
// ❌ 現状：使う側がデザインを全部書く
<button className="px-4 py-2 bg-accent-gold...">保存</button>

// ✅ 目指す形：デザインはコンポーネント側で定義
<Button variant="primary">保存</Button>
```

**責任分離**
- コンポーネント側: デザイン定義（色、サイズ、状態、トランジション）
- 使う側: バリアント選択、ラベル、イベントハンドラ

### 4.2 実装するコンポーネント（YAGNIに従う）

**1. Button.tsx（完全作り直し）**
- CVAで実装
- アイコン対応（先頭/末尾）
- ローディング状態
- 全サイズ（xs, sm, md, lg, xl）
- 必要な全バリアント

**2. IconButton.tsx（新規作成）**
- アイコン専用ボタン
- ModalHeader/BottomSheetHeaderで**今すぐ使う**
- CVAで実装

**3. 既存コンポーネント活用**
- SearchOptionsButton: 4ファイルで使用
- SegmentedControl: そのまま維持（既にCVA実装済み）
- Pagination: 専用ロジックあるのでそのまま維持

---

## 5. 実装計画

### 5.1 一括実装（フェーズ分けしない）

**理由**:
- フェーズ分けは先延ばしでしかない
- 今できることを後回しにする理由がない
- 一気に完成させる方が効率的

**実装内容**:

1. **Button.tsx完全作り直し**（CVA、アイコン、ローディング）
2. **IconButton.tsx新規作成**
3. **SearchOptionsButton使用**（4ファイル）
4. **移行可能なファイルを全て移行**
   - CalendarHeader
   - ModalHeader/BottomSheetHeader（IconButton使用）
   - Toast
   - ErrorDisplay/ErrorBoundary

### 5.2 維持するもの（YAGNIに従う）

**専用実装を維持**:
- SegmentedControl: 既にCVA実装、タブUI専用
- Pagination: 複雑な状態管理、ページネーション専用
- カレンダーイベントボタン: 動的ポジショニング、色分け必要

**理由**: 無理に共通化しても複雑化するだけ

---

## 6. 影響ファイル

### 6.1 作成/完全書き直し
- `/frontend/src/components/Button/Button.tsx`（完全書き直し）
- `/frontend/src/components/Button/IconButton.tsx`（新規）

### 6.2 修正（SearchOptionsButton使用）
1. `/frontend/src/features/archives/components/search/internals/ArchiveSearchSection.tsx`
2. `/frontend/src/features/news/components/layout/internals/NewsSearchSection.tsx`
3. `/frontend/src/features/songs/components/search/internals/SongSearchSection.tsx`
4. `/frontend/src/features/discography/components/DiscographySidebar/DiscographySearchSection.tsx`

### 6.3 修正（Button.tsx/IconButton.tsx使用）
5. `/frontend/src/components/Modal/ModalHeader.tsx`
6. `/frontend/src/components/BottomSheet/BottomSheetHeader.tsx`
7. `/frontend/src/features/calendar/components/calender/internals/CalendarHeader.tsx`
8. `/frontend/src/components/Feedback/Toast.tsx`
9. `/frontend/src/components/Error/ErrorDisplay.tsx`
10. `/frontend/src/components/Error/ErrorBoundary.tsx`

### 6.4 維持（変更なし）
- SegmentedControl.tsx
- Pagination.tsx
- MobileEventCard.tsx / EventBand.tsx / CalendarEventItem.tsx

---

## 7. 技術スタック

- **Next.js**: 15.1.6
- **React**: 19.1.1
- **Tailwind CSS**: 4.1.13
- **class-variance-authority**: 0.7.1（CVA）
- **clsx + tailwind-merge**: cn()
- **lucide-react**: 0.542.0

---

## 8. 成功指標

- Button.tsx使用率: 11.5% → 60%以上
- コード重複: 90%削減
- 保守性: 1箇所修正で全体反映

---

## 9. 結論

**やること**:
1. Button.tsxをCVAで完全作り直し
2. IconButton.tsx新規作成
3. 既存ファイルを一括移行
4. SearchOptionsButton使用（重複削除）

**やらないこと**:
- フェーズ分け（先延ばしでしかない）
- 無理な共通化（SegmentedControl、Pagination等）
- 不要なコンポーネント作成

**方針**: YAGNIに従い、今必要なものだけ実装する。
