# SEOルール

## 新規ページ追加時の必須チェックリスト

`app/` 配下に新しい page.tsx を作成する際、以下を必ず対応する。

### 1. metadata export

```ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ページ名',  // layout.tsx の template が「%s — だんいんログ」を付与
  description: 'ページの説明文',
};
```

- `title` にはサイト名を含めない（template が自動付与）
- `description` は30〜80文字程度で、ページの内容を具体的に書く
- ページ固有のOGP画像がある場合は `openGraph.images` も追加

### 2. sitemap への追加

`web/src/app/sitemap.ts` の `pages` 配列にパスを追加する。

### 3. 画像の alt 属性

サムネイル等の `<img>` タグには必ず意味のある `alt` を設定する。`alt=""` は禁止。

### 4. JSON-LD（任意）

トップページには `WebSite` スキーマを設置済み。個別ページへの `WebPage` 追加は任意。

## 共通定数

サイトURL・サイト名・説明文は `lib/site.ts` に一元化済み。ハードコードせず import して使う。

```ts
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';
```