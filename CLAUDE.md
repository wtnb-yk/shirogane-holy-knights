# CLAUDE.md

# 団員ポータル開発構成・設計まとめ（Kotlin/Spring Bootバックエンド版・認証後回し版）

## 1. アプリ名・目的
- **アプリ名**：団員ポータル  
- **目的**：白銀ノエルさんファン（団員）向けに過去配信アーカイブの検索・閲覧などの情報提供を行うWebアプリ。

## 2. 実装機能（MVP）
- 過去配信アーカイブの検索（タイトル、タグ、配信日などで絞り込み）  
- 配信一覧表示、YouTubeリンクへの遷移  
- 認証機能は後回しで、初期は未認証環境で動作

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