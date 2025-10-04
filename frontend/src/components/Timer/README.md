# CountdownTimer Component

リアルタイムでカウントダウンを表示する美しい再利用可能なコンポーネントです。スペシャルイベントの開始時刻までの残り時間を表示するために作成されました。

## 機能

- **リアルタイム更新**: 1秒ごとに残り時間を更新
- **タイムゾーン対応**: ユーザーのローカルタイムゾーンを考慮した時間計算
- **美しいデザイン**: プロジェクトのデザインシステムに完全統合
- **複数のバリアント**: default、compact、card の3つのスタイル
- **アクセシビリティ対応**: スクリーンリーダー対応とARIA属性
- **期限切れ処理**: 期限切れ時のコールバック機能とステータス表示
- **アニメーション**: 秒数のパルスアニメーションと視覚的フィードバック

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `targetDate` | `string` | - | 目標日時（ISO 8601形式） |
| `className` | `string` | - | 追加のCSSクラス |
| `variant` | `'default' \| 'compact' \| 'card'` | `'default'` | 表示スタイル |
| `onExpired` | `() => void` | - | 期限切れ時のコールバック |

## 使用例

### 基本的な使用

```tsx
import { CountdownTimer } from '@/components/Timer';

function MyComponent() {
  const eventDate = '2024-12-25T00:00:00Z';
  
  return (
    <CountdownTimer 
      targetDate={eventDate}
      onExpired={() => console.log('Event started!')}
    />
  );
}
```

### コンパクトバリアント（インライン表示）

```tsx
<CountdownTimer 
  targetDate={eventDate}
  variant="compact"
/>
```

### カードバリアント（強調表示）

```tsx
<CountdownTimer 
  targetDate={eventDate}
  variant="card"
/>
```

### SpecialEventDto との統合

```tsx
import { SpecialEventCountdown } from '@/features/specials/components';

function EventCard({ event }: { event: SpecialEventDto }) {
  return (
    <div>
      <h3>{event.title}</h3>
      <SpecialEventCountdown 
        event={event}
        variant="card"
        onEventStarted={(event) => {
          console.log(`Event ${event.title} has started!`);
        }}
      />
    </div>
  );
}
```

## バリアント

### Default
- インライン表示、軽いアクセント背景
- アクセントカラーのインジケーター付き
- モノスペースフォントで数字を表示
- 秒数にアクセントカラーを適用

### Compact
- 最小限のスペースで表示
- コロン区切りの時間表示
- インライン要素として使用可能

### Card
- 美しいグラデーション背景
- 大きな数字とラベル
- 秒数にパルスアニメーション
- 独立したカードとして表示

## デザインシステム統合

### カラーパレット
- `accent-gold`: メインアクセントカラー
- `accent-gold-light`: 背景グラデーション
- `accent-gold-dark`: 強調表示
- `text-primary`: メインテキスト
- `text-muted`: サブテキスト
- `bg-accent`: アクセント背景

### アニメーション
- 秒数の `animate-pulse` エフェクト
- インジケーターの `animate-pulse` エフェクト
- スムーズなトランジション

## アクセシビリティ

- `role="timer"` 属性
- `aria-live="polite"` でスクリーンリーダーに更新を通知
- `aria-label` で現在の残り時間を説明
- 適切なコントラスト比の確保

## 技術的な詳細

### 時間計算
- `Date.getTime()` を使用してミリ秒単位で計算
- ユーザーのローカルタイムゾーンを自動的に考慮
- 負の値（過去の日時）を適切に処理

### パフォーマンス
- `useMemo` を使用して計算関数をメモ化
- `useEffect` でタイマーのクリーンアップを適切に処理
- 1秒間隔での更新（`setInterval`）

### 表示ロジック
- 1日未満の場合は日数を非表示
- 期限切れの場合は美しいステータスバッジを表示
- 数字は常に2桁表示（ゼロパディング）
- モノスペースフォントで数字の幅を統一

## 関連コンポーネント

- `SpecialEventCountdown`: SpecialEventDto専用のラッパーコンポーネント（ステータス管理付き）