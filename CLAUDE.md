# CLAUDE.md

# エラー解決における絶対原則

## 1. 徹底的な現状把握
- エラーメッセージを表面的に読まず、**なぜそのエラーが出るのか**を理解する
- 設定ファイルだけでなく、**実行環境の実際の状態**を確認する
- ローカルの変更と**リモート環境の状態の乖離**を常に疑う

## 2. 過去の試行履歴の完全な把握
- `git log`で過去の変更履歴を必ず確認
- 削除されたファイルや設定も含めて調査
- **「これは試していない」と断言できるまで確認**してから提案

## 3. 因果関係の深掘り
- 症状ではなく原因を治療する
- 「エラーが出た」→「なぜ？」の連鎖を**最低3回**は繰り返す
- 表面的な対処療法は絶対に避ける

## 4. 変更の完全性の検証
- コードの変更 ≠ 実行環境への反映
- 特にIaCツール使用時は、**適用後の実環境を必ず確認**
- キャッシュや残存設定の可能性を常に考慮

## 5. 解決策の検証可能性
- 「これで解決するはず」ではなく「これで解決する、なぜなら...」と説明
- **未試行であることを確実に検証してから提案**
- 実装後の検証方法まで考えてから実行

---

# 団員ポータル開発構成・設計まとめ（Kotlin/Spring Bootバックエンド版・認証後回し版）

## 1. アプリ名・目的
- **アプリ名**：団員ポータル  
- **目的**：白銀ノエルさんファン（団員）向けに過去配信アーカイブの検索・閲覧などの情報提供を行うWebアプリ。

## 2. 実装機能（MVP）
- 過去配信アーカイブの検索（タイトル、タグ、配信日などで絞り込み）  
- 配信一覧表示、YouTubeリンクへの遷移  

## 3. 技術スタック

| 項目           | 技術・サービス                      | コメント                                             |
|----------------|-----------------------------------|------------------------------------------------------|
| フロントエンド  | Next.js（App Router）               | Reactベースの最新ルーティング構成を使用              |
| ホスティング    | AWS Amplify Console               | Next.jsアプリのビルド・デプロイ・ホスティング          |
| バックエンドAPI | AWS Lambda + API Gateway           | Kotlin（Spring Boot）でREST API。GraalVMネイティブコンパイルで高速起動化 |
| データベース    | Amazon RDS（PostgreSQL）           | フルリレーショナルDBで柔軟な検索・拡張が可能          |
| 認証            | Amazon Cognito（Amplify Auth）     | 認証機能は後から段階的に導入                            |
| IaC            | Terraform / CloudFormation         | AWSリソース環境をコードで管理                          |
| CI/CD          | Amplify Console / GitHub Actions  | ビルド・テスト・デプロイの自動化                       |

## 4. リポジトリ構成（ルート直下ディレクトリ）
- `backend/`：Kotlin（Spring Boot）バックエンドコード  
  - `src/main/kotlin/com/shirogane/holy/knights/`
    - `adapter/`：外部インターフェース層（controllerとgatewayを含む）
    - `application/`：アプリケーション層（ユースケース、DTO、ポート）
    - `domain/`：ドメイン層（モデル、リポジトリインターフェース、サービス）
    - `infrastructure/`：インフラストラクチャ層（設定、データベース、Lambda関連）
- `frontend/`：Next.jsフロントエンドコード  
- `infrastructure/`：TerraformまたはCloudFormationでのIaCコード  
- `ci-cd/`：AmplifyやGitHub ActionsなどCI/CD設定ファイル  
- `docs/`：設計・仕様・ドキュメント関連ファイル
  - `database-schema.md`：データベーススキーマ仕様書（PostgreSQL 13テーブル構成）

## 5. バックエンド設計ポイント
- **Spring Boot採用**：安定したエコシステムと豊富なライブラリを持つフレームワーク。
- **GraalVMネイティブコンパイル**：コールドスタート時間の短縮。  
- **Spring Web MVC**：REST APIの実装に最適なコントローラーモデル。
- **Spring Data JDBC**：データアクセスの簡素化。
- **PostgreSQL接続**：標準JDBCドライバ利用。  
- **Spring Cloud Function**：AWS Lambdaサポートの予定。
- **ヘキサゴナルアーキテクチャ採用**：アプリケーション、ドメイン、インフラの分離による保守性・テスト容易性の向上。

## 6. 開発・デプロイ体制
- **IaC導入**によりAWS環境（RDS、Lambda、API Gatewayなど認証以外）をコードで構築・管理。  
- **CI/CDパイプライン構築**でAmplify ConsoleやGitHub Actionsを利用し、ビルド・テスト・デプロイを自動化。  
- フロントエンドとバックエンドの連携・動作検証を先行。  

## 7. 開発の進め方（認証後回し版）

1. **環境構築と基盤整備**  
   - IaCでAWSリソース構築（認証無し）。  
   - Spring Boot＋GraalVM環境セットアップ。  

2. **APIのプロトタイプ実装**  
   - 最小限の検索・配信一覧APIを軽量OpenAPI定義で設計し、試験的に実装。  
   - フロントエンドから呼び出して動作確認。  

3. **フロントエンド基本機能実装**  
   - Next.jsで検索UIや一覧表示、YouTubeリンク遷移などの基本機能開発。  
   - 認証なしの状態で動作検証を行う。  

4. **API仕様ブラッシュアップとドキュメント化**  
   - 実装APIに基づきOpenAPIを詳細化し、ドキュメント化。  

6. **機能拡張と認証準備開始**  
   - RDS Proxy導入や検索エンジン連携検討も同時に進める。  
   - 認証用Cognito環境を準備し検証。  

7. **認証機能（Cognito）導入**  
   - API・フロントエンドに認証機能を段階的に組み込み。  
   - 一定期間テストを挟みながら安全に切替実施。  

8. **本番リリース・安定運用開始**  

## 8. 今後の拡張・運用検討
- RDS ProxyやOpenSearch導入による性能強化。  
- API自動生成やテスト拡充。  
- モニタリング・ロギングの段階的導入。  

## 9. 実装上の注意
- テストを目的にプロダクトコードを修正しないこと（例：APIの動作確認用にエンドポイントを追加する）
- TODOを立てたら必ず確認を行う

## 10. フロントエンドデザイン方針
### カラーパレット
- **sage-100**: `#ACBDC5` - 最も明るいセージカラー（薄い背景、タグ背景）
- **sage-200**: `#acabb2` - 中間のセージカラー（ボーダー、無効状態）
- **sage-300**: `#89939d` - 最も濃いセージカラー（アクセントカラー、アイコン、選択状態）

### デザイン原則
1. **白をベースカラーとして使用**
   - カード背景、検索ボックス、ボタン基本色は白
   - 清潔感とプロフェッショナルな印象を重視

2. **sage色はアクセントとして控えめに使用**
   - テキスト、アイコン、ボーダーにsage-300
   - 背景グラデーションは透明度を下げて控えめに
   - ホバー状態やタグ背景にsage-100/200を使用

3. **タイトル・見出しは目立たせる**
   - メインタイトルは`text-gray-800`で強いコントラスト
   - サブタイトルや説明文は`text-sage-300`でバランス

4. **可読性と階層構造を重視**
   - 適切なコントラスト比を保持
   - 要素間の視覚的階層を明確に
   - ホバー状態での色変化で操作性を向上

### 実装ガイドライン
- 新しいUIコンポーネント作成時は上記の色使い方針に従う
- 白ベース + sage色アクセントの組み合わせを維持
- デザインの一貫性を保つため、独自の色は原則使用しない

## 11. フロントエンドパフォーマンス・アニメーション方針

### パフォーマンス最適化指針
1. **軽量なアニメーション実装**
   - framer-motionなど重いライブラリは避ける
   - CSSアニメーション・transitionを優先使用
   - ハードウェア加速（transform、opacity）を活用

2. **画像最適化**
   - Next.js Imageコンポーネントでlazy loading
   - placeholder="blur"で体感速度向上
   - 適切なsizes属性でレスポンシブ最適化
   - sage-100背景色でロード中の視覚的安定性

3. **Re-render最適化**
   - React.memoで不要な再描画防止
   - useMemoでコンポーネント戻り値最適化
   - 依存関係の最小化

### アニメーション設計原則
1. **段階的表示アニメーション**
   - タイトル：即座表示
   - 検索バー：100ms遅延でslide-up
   - カード：50ms間隔でfade-in（最大300ms遅延）
   - 統計情報：600ms遅延で最後に表示

2. **ホバーエフェクト**
   - カード：hover時にscale(1.02) + translateY(-4px) + shadow強化
   - リンク：hover時にtranslateX(8px)
   - ボタン：hover時にscale(1.1) + translateY(-2px)

3. **アニメーション仕様**
   - 継続時間：200-400ms（軽快さ重視）
   - イージング：ease-out（自然な動き）
   - 遅延：最大300ms（過度な待機時間を避ける）

### コンポーネント設計方針
1. **疎結合アーキテクチャ**
   - 機能毎にコンポーネント分離
   - 再利用可能な小さなコンポーネント
   - 単一責任の原則を遵守

2. **ファイル構成**
   ```
   frontend/src/
   ├── components/
   │   └── videos/
   │       ├── VideoCard.tsx
   │       ├── SkeletonCard.tsx
   │       ├── SearchBar.tsx
   │       ├── Pagination.tsx
   │       └── VideosGrid.tsx
   └── hooks/
       └── useVideos.ts
   ```

3. **実装指針**
   - パフォーマンスと体験のバランス重視
   - 過度なアニメーションは避ける
   - ユーザビリティを損なわない範囲で最適化

## 12. Lambda R2DBC統合 - 重要な学習事項

### 解決済み技術課題
1. **Spring Cloud Function AWS Lambda 統合**
   - **問題**: FunctionInvokerクラスのClassNotFoundExceptionエラー
   - **根本原因**: JAR の MANIFEST.MF 設定が不適切
   - **解決策**: 専用のshadowJarタスクで適切なMANIFEST設定
   ```kotlin
   // build.gradle.kts
   val springCloudFunctionLambdaJar by tasks.creating(ShadowJar::class) {
       manifest {
           attributes(
               "Main-Class" to "org.springframework.cloud.function.adapter.aws.FunctionInvoker",
               "Start-Class" to "com.shirogane.holy.knights.Application"
           )
       }
   }
   ```

2. **R2DBC設定の確立**
   - ConnectionFactory + PostgresDialect 明示指定で解決
   - R2dbcConfigクラスでBean統合管理

### 開発プロセスの教訓
1. **過去の試行履歴を必ず参照してから提案する**
2. **デプロイ完了を必ず確認してからテスト実行**
3. **エラーの根本原因を体系的に分析（表面的な対処療法を避ける）**
4. **実行前に必ず手順を説明して確認を得る**
5. **解決宣言前に必ず動作確認を行う**
6. **"実行して修正して"の繰り返しを避ける**

### Lambda環境での正常動作確認済み
- `/health` エンドポイント: ✅ 正常応答
- `/videos` エンドポイント: ✅ 正常応答
- Spring Boot + R2DBC + PostgreSQL: ✅ 正常動作
- Spring Cloud Function統合: ✅ 正常動作
