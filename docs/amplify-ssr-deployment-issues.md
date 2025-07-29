# AWS Amplify Next.js SSRデプロイ技術知見と問題点

## 概要
2025年7月29日にAWS AmplifyでNext.js SSRアプリケーションのデプロイを試行した際の技術知見と遭遇した問題点をまとめる。

## 技術構成
- **フロントエンド**: Next.js 14 (App Router)
- **ホスティング**: AWS Amplify Console
- **プラットフォーム**: WEB_COMPUTE (SSR対応)
- **フレームワーク**: Next.js - SSR
- **リポジトリ構成**: モノレポ (`frontend/`ディレクトリ配下)

## 正しい設定構成

### 1. Next.js設定 (`frontend/next.config.js`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // SSR用設定
  images: {
    domains: ['i.ytimg.com'],
  },
}

module.exports = nextConfig
```

### 2. Terraform Amplify設定
```hcl
resource "aws_amplify_app" "main" {
  name = "${var.project_name}-${var.environment}"
  
  # Next.js 14+ SSR requires WEB_COMPUTE platform
  platform = "WEB_COMPUTE"

  # GitHub連携
  repository   = var.github_repository
  access_token = var.github_access_token

  build_spec = var.build_spec

  # モノレポ対応の環境変数
  environment_variables = {
    NEXT_PUBLIC_API_URL = var.api_url
    PORT = "3000"
    AMPLIFY_MONOREPO_APP_ROOT = "frontend"  # 重要: モノレポ対応
  }

  # Next.js SSR routing
  custom_rule {
    source = "/<*>"
    status = "200"
    target = "/<*>"
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.main.id
  branch_name = "main"

  framework = "Next.js - SSR"  # SSR専用フレームワーク設定
  stage     = var.environment == "prod" ? "PRODUCTION" : "DEVELOPMENT"

  enable_auto_build = true
}
```

### 3. buildspec設定 (`amplify-buildspec.yml`)
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci  # AMPLIFY_MONOREPO_APP_ROOTにより既にfrontendディレクトリ内
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next  # SSR用ディレクトリ
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*  # AMPLIFY_MONOREPO_APP_ROOTによりfrontend/は不要
```

## 遭遇した主要な問題

### 1. モノレポ設定エラー
**エラー**: `Cannot read 'next' version in package.json`
**原因**: `AMPLIFY_MONOREPO_APP_ROOT`環境変数の未設定
**解決策**: 環境変数に`"frontend"`を設定

### 2. buildspec設定の競合
**問題**: `cd frontend`コマンドと`AMPLIFY_MONOREPO_APP_ROOT`の競合
**解決策**: buildspecから`cd frontend`を削除し、パスもfrontend/プレフィックスを除去

### 3. プラットフォーム設定不備
**問題**: Next.js 14+でのSSR未対応
**解決策**: `platform = "WEB_COMPUTE"`の明示的設定

### 4. フレームワーク設定ミス
**問題**: 一般的な「Web」フレームワーク設定
**解決策**: `framework = "Next.js - SSR"`の専用設定

## 継続する問題点

### ビルドエラーの根本原因
複数回のデプロイ試行後も継続的にビルドエラーが発生している状況：

1. **Job ID 17-20**: 全てFAILED状態
2. **エラーパターン**: BUILD段階での失敗
3. **ログアクセス**: S3 URLからのログ取得に失敗

### 推定される原因
1. **モノレポ設定の不完全性**: `AMPLIFY_MONOREPO_APP_ROOT`設定後もパス解決に問題
2. **buildspec構文エラー**: YAMLまたはコマンド設定の不整合
3. **依存関係問題**: `frontend/package.json`またはnode_modules関連
4. **Amplify内部処理**: 環境変数の反映タイミングやキャッシュ問題

## 今後の調査・対応方針

### 短期対応
1. **ビルドログの詳細調査**: エラー内容の正確な把握
2. **段階的設定検証**: 最小構成から段階的に設定を追加
3. **Amplifyキャッシュクリア**: 過去の設定の完全削除

### 中長期対応
1. **代替デプロイ手法の検討**: 
   - Amplify以外のSSRホスティング（Vercel、AWS App Runner等）
   - コンテナベースデプロイ（ECS、Cloud Run等）
2. **設定自動化の改善**: Terraformでの完全なIaC化
3. **モニタリング強化**: デプロイ状況の可視化

## 学習事項

### 技術的知見
1. **Next.js 14+でのAmplify SSR**: WEB_COMPUTEプラットフォーム必須
2. **モノレポ対応**: `AMPLIFY_MONOREPO_APP_ROOT`環境変数が重要
3. **buildspec設計**: 環境変数設定との整合性確保が必要

### プロセス改善
1. **エラー分析の体系化**: ログ取得・分析手法の確立
2. **段階的デプロイ**: 最小構成での動作確認を優先
3. **設定バージョン管理**: 試行錯誤の設定変更履歴管理

## 現在の状況サマリー
- **バックエンド**: ✅ Lambda + API Gateway + RDS で正常稼働
- **フロントエンド**: ❌ Amplify SSRデプロイでビルドエラー継続
- **次ステップ**: 根本原因の特定とデプロイ手法の再検討が必要