# 設計書

## 概要

ディスコグラフィー機能は、既存の音楽リリース用データベーススキーマを活用して、ユーザーが音楽リリース（アルバム、シングル、EP）を閲覧、検索、発見するための包括的なインターフェースを提供します。この機能は、Songs、Archives、Newsなどの他の機能で使用されている確立されたアーキテクチャパターンに従い、一貫性と保守性を確保します。

## アーキテクチャ

### フロントエンドアーキテクチャ
ディスコグラフィー機能は、確立された機能ベースのアーキテクチャパターンに従います：

```
frontend/src/features/discography/
├── api/
│   └── discographyClient.ts
├── components/
│   ├── DiscographyGrid.tsx
│   ├── DiscographyCard.tsx
│   ├── DiscographySidebar.tsx
│   ├── DiscographyBottomSheetContent.tsx
│   ├── DiscographySearchResultsSummary.tsx
│   ├── DiscographyStatsSummary.tsx
│   ├── DiscographyDetailModal.tsx
│   └── SkeletonDiscographyCard.tsx
├── hooks/
│   ├── useDiscography.ts
│   └── useDiscographyQuery.ts
├── types/
│   └── types.ts
└── utils/
    └── releaseUtils.ts
```

### バックエンドアーキテクチャ
バックエンドは既存のSpring Boot Lambda関数とデータベーススキーマを活用します：

- **データベース**: 既存の `albums`, `album_types`, `album_songs`, `music_releases`, `music_platforms` テーブル
- **APIエンドポイント**: アルバム検索と取得のための新しいLambda関数
- **統合**: トラックリスト用の既存の `songs` テーブルとの連携

## コンポーネントとインターフェース

### コアデータモデル

```typescript
// アルバムリリースタイプ
export enum AlbumType {
  ALBUM = 'ALBUM',
  SINGLE = 'SINGLE',
  EP = 'EP',
  COMPILATION = 'COMPILATION'
}

// ソートオプション
export enum DiscographySortBy {
  RELEASE_DATE = 'releaseDate',
  TITLE = 'title',
  ARTIST = 'artist'
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

// メインアルバムインターフェース
export interface Album {
  id: string;
  title: string;
  artist: string;
  albumType: AlbumType;
  releaseDate: string;
  coverImageUrl?: string;
  trackCount?: number;
  tracks?: AlbumTrack[];
  musicReleases?: MusicRelease[];
}

// アルバムトラックインターフェース
export interface AlbumTrack {
  songId: string;
  title: string;
  artist: string;
  trackNumber: number;
}

// 音楽プラットフォームリリースインターフェース
export interface MusicRelease {
  id: string;
  platformName: string;
  platformUrl: string;
  platformIconUrl?: string;
  releaseDate: string;
}

// 検索パラメータ
export interface DiscographySearchParams {
  query?: string;
  albumTypes?: AlbumType[];
  startDate?: string;
  endDate?: string;
  sortBy?: DiscographySortBy;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}

// 検索結果
export interface DiscographySearchResult {
  items: Album[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

### APIクライアント

```typescript
export class DiscographyClient {
  static async searchAlbums(params: DiscographySearchParams): Promise<DiscographySearchResult>;
  static async getAlbumDetails(albumId: string): Promise<Album>;
}
```

### 主要コンポーネント

#### DiscographyGrid
- アルバムカード用のレスポンシブグリッドレイアウト
- スケルトンローディング状態
- 空の状態ハンドリング
- 無限スクロールサポート

#### DiscographyCard
- 最適化された読み込みでのアルバムアートワーク表示
- リリース情報（タイトル、アーティスト、日付、タイプ）
- ホバーエフェクトとクリックインタラクション
- モバイル最適化されたタッチターゲット

#### DiscographySidebar
- 検索機能
- アルバムタイプフィルター（アルバム、シングル、EPなど）
- 日付範囲フィルタリング
- ソートオプション（リリース日、タイトル、アーティスト）
- フィルタークリア機能

#### DiscographyDetailModal
- 完全なアルバム情報表示
- Songs機能へのリンク付きトラックリスト
- 音楽プラットフォームリンク
- 関連コンテンツ提案

### ページ構造

メインディスコグラフィーページ（`/discography`）は確立されたPageLayoutパターンに従います：

```typescript
export default function DiscographyPage() {
  // 検索、フィルター、ページネーションの状態管理
  // useDiscographyフックとの統合
  // レスポンシブサイドバーとボトムシートハンドリング
  // アルバム詳細のモーダル状態管理
}
```

## データモデル

### データベース統合
この機能は既存のデータベーステーブルを利用します：

- **albums**: メインアルバム情報
- **album_types**: アルバムタイプ分類
- **album_songs**: トラックリストと順序
- **songs**: 個別トラック詳細
- **music_releases**: プラットフォーム固有のリリース情報
- **music_platforms**: ストリーミングプラットフォーム詳細

### APIレスポンス構造
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "アルバムタイトル",
      "artist": "アーティスト名",
      "albumType": "ALBUM",
      "releaseDate": "2024-01-15",
      "coverImageUrl": "https://...",
      "trackCount": 12,
      "tracks": [
        {
          "songId": "uuid",
          "title": "トラックタイトル",
          "artist": "アーティスト名",
          "trackNumber": 1
        }
      ],
      "musicReleases": [
        {
          "id": "uuid",
          "platformName": "Spotify",
          "platformUrl": "https://...",
          "platformIconUrl": "https://...",
          "releaseDate": "2024-01-15"
        }
      ]
    }
  ],
  "totalCount": 50,
  "page": 1,
  "pageSize": 20,
  "hasMore": true
}
```

## エラーハンドリング

### フロントエンドエラーハンドリング
- 再試行メカニズムによるネットワークエラー回復
- 欠損アルバムアートワークの優雅な劣化
- 検索失敗時のユーザーフレンドリーなエラーメッセージ
- API呼び出し中のローディング状態管理

### バックエンドエラーハンドリング
- 検索パラメータの入力検証
- データベース接続エラーハンドリング
- 適切なHTTPステータスコードとエラーレスポンス
- デバッグと監視のためのログ記録

### エラー状態
- 有用な提案付きの空の検索結果
- ネットワーク接続問題
- 無効な日付範囲や検索パラメータ
- アルバム詳細読み込み失敗

## テスト戦略

### ユニットテスト
- コンポーネントレンダリングとインタラクションテスト
- フック機能と状態管理テスト
- APIクライアントリクエスト/レスポンスハンドリングテスト
- 日付フォーマットとフィルタリングのユーティリティ関数テスト

### 統合テスト
- エンドツーエンド検索とフィルタリングワークフロー
- モーダルインタラクションとナビゲーション
- レスポンシブデザインとモバイルインタラクション
- モックデータでのAPI統合

### パフォーマンステスト
- 大規模データセットレンダリングパフォーマンス
- 画像読み込み最適化
- 検索レスポンス時間測定
- 長時間閲覧中のメモリ使用量

### アクセシビリティテスト
- キーボードナビゲーションサポート
- スクリーンリーダー互換性
- 色のコントラストと視覚的アクセシビリティ
- モバイルデバイス用タッチターゲットサイズ

## パフォーマンス考慮事項

### フロントエンド最適化
- アルバムアートワーク画像の遅延読み込み
- 大規模結果セット用の仮想スクロール
- API呼び出しを減らすためのデバウンス検索入力
- 高コスト計算のメモ化

### バックエンド最適化
- 適切なインデックスによるデータベースクエリ最適化
- レスポンスサイズを制限するページネーション
- 頻繁にアクセスされるデータのキャッシュ戦略
- 関連データの効率的なJOIN操作

### 画像ハンドリング
- デバイス機能に基づくレスポンシブ画像サイズ
- プレースホルダー画像による段階的読み込み
- 高速画像配信のためのCDN統合
- フォールバック付きWebPフォーマットサポート

## 統合ポイント

### ナビゲーション統合
- メインナビゲーションメニューへの追加
- パンくずナビゲーションサポート
- SEOフレンドリーなURL構造

## モバイルレスポンシブ

### レイアウト適応
- 異なる画面サイズでのグリッドレイアウト調整
- モバイルフィルター用ボトムシート実装
- タッチ最適化インタラクションパターン
- モーダルナビゲーション用スワイプジェスチャー

### モバイルでのパフォーマンス
- モバイルデバイス用の縮小画像サイズ
- 高速読み込みのための最適化されたバンドルサイズ
- 低速接続での段階的拡張
- バッテリー効率的なレンダリングとアニメーション