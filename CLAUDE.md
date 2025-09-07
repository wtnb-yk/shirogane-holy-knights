# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Principles
- **Logging**: Keep logging to a minimum - only essential information for debugging and monitoring
- **Comments**: Minimize code comments - write self-documenting code with clear naming and structure
- **Clean Code**: Prioritize readable, maintainable code that doesn't require extensive explanation

## Project Overview

だんいんポータル - Fan service for 白銀ノエル

### Architecture

This existing project uses the following technology stack:
- **Backend**: 
  - Local development: Kotlin + Spring Boot 3.2 + Spring Cloud Function + LocalStack Lambda (ホットリロード対応)
  - Production environment: Same as above + AWS Lambda
- **Frontend**: Next.js + TypeScript + SWR + TailwindCSS
- **Database**: PostgreSQL 14 (Liquibase migrations)
- **Infrastructure**: AWS (Lambda, API Gateway, RDS, Amplify, CloudFront) + Terraform
- **Build Tools**: Gradle (Kotlin), npm
- **Local AWS**: LocalStack (Lambda + API Gateway シミュレート)

### System Architecture

**See `infrastructure/README.md` for detailed architecture**

## Essential Commands

### Development Server Ports
- **Frontend**: http://localhost:3001 (Next.js)
- **Backend API**: LocalStack Lambda endpoints

### Backend Development

**See `backend/README.md` for backend-related details**

### Frontend Development

**See `frontend/README.md` for frontend-related details**

### Quick Start

```bash
# 開発環境起動（ホットリロード自動有効）
make dev

# コード編集すると自動的にLambda関数が更新される

# 環境停止
make stop
```

### Connecting to Database

**See `tools/README.md` for connecting to the database**

### Infrastructure Operations

**See `infrastructure/README.md` for infrastructure-related details**

## Important Project Structure

### Backend (Kotlin/Spring Boot)
**See `backend/README.md` for detailed structure**

### Frontend (Next.js)
**See `frontend/README.md` for detailed structure**

### Infrastructure
**See `infrastructure/README.md` for detailed structure**

## Development Notes

### Database Connection
- Local: `localhost:5432/shirogane` (postgres/postgres)
- Dev/Prd: See `infrastructure/README.md` for RDS connection details

### Environment-specific Configuration
- **Backend**: See `backend/README.md` for Spring profiles and Lambda configuration
- **Frontend**: See `frontend/README.md` for environment variables and deployment settings
- **Infrastructure**: See `infrastructure/README.md` for AWS environment configurations

## Development Guidelines

### Backend Development
- **Always refer to `backend/README.md` for backend-related work**
- **For API endpoints, refer to the API section in `backend/README.md`**
- **For database tasks, check the database schema in `backend/docs/database-schema.md`**

### Frontend Development  
- **Always refer to `frontend/README.md` for frontend-related work**
- **For UI/design tasks, check the design guidelines in `frontend/docs/ui-design.md`**

## エラー調査・修正の必須手順 - ALWAYS FOLLOW

### 調査フェーズ（必須）
1. **エラーメッセージの完全把握**
   - エラーメッセージを完全にコピー・記録
   - スタックトレースの全行を確認
   - エラー発生時刻とコンテキストを記録

2. **根本原因の特定**  
   - エラー発生箇所のコードを読む
   - 関連する依存関係・設定を確認
   - 同じパターンの他の実装を探す
   - ログを時系列で追跡して原因を特定

3. **プロジェクト固有の確認**
   - 該当するREADME.mdを必ず確認（backend/frontend/infrastructure）
   - 既存のテストコマンドを特定（npm test, gradle test等）
   - 影響範囲を明確にリストアップ

### 修正フェーズ（必須）
1. **設計を考慮した修正**
   - 既存のアーキテクチャパターンに従う
   - 他の部分への影響を考慮
   - 場当たり的な修正を避ける

2. **修正前の準備**
   - 現在の動作状態を記録
   - テスト環境と確認方法を明確にする
   - 修正計画をExitPlanModeで提示して承認を得る

### 検証フェーズ（必須）
1. **動作確認**
   - テストを実行して結果を確認
   - ローカル環境で動作確認
   - ログでエラーが解消されたか確認

2. **影響確認**
   - 新たなエラーが出ていないか確認
   - 関連機能が壊れていないか確認
   - **確認完了まで「完了」と言わない**

### TodoWriteツールの活用（必須）
- 各フェーズをTodoに記録して進捗管理
- 完了前に勝手に次のステップに進まない
- 未確認項目を明示的に残す

### 品質保証チェックリスト
エラー対応時は以下を機械的に確認：
```
□ エラーメッセージとスタックトレースを完全記録
□ 該当READMEファイルを確認（backend/frontend/infrastructure）
□ 関連するすべてのコードファイルを読む
□ ログで根本原因を特定
□ 既存パターンに従った修正を実装
□ テスト実行で動作確認
□ 関連機能の影響確認
□ 新規エラーの発生確認
□ 確認完了まで作業継続
```

