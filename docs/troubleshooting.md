# CI/CD トラブルシューティングガイド

## Deploy Backend関連

### 問題: Lambda関数は更新されるが実際の処理が失敗する

**症状**:
- GitHub Actionsワークフローは正常完了（短時間で終了）
- JAR作成・Lambda更新は成功
- しかし実際のAPI呼び出しが失敗

**調査日**: 2025-07-29

**根本原因**: RDSデータベース接続エラー
```
PostgresqlAuthenticationFailure: no pg_hba.conf entry for host "10.0.12.198", user "postgres", database "shirogane", no encryption
```

**詳細分析**:
1. **ワークフロー自体は正常動作**
   - JAR作成: ✅ 正常（`springCloudFunctionLambdaJar`タスク）
   - Lambda更新: ✅ 正常（コードサイズ43,987,939バイト）
   - AWS認証: ✅ 正常（OIDC Provider使用）

2. **実際の問題はインフラ設定**
   - Lambda IP: `10.0.12.198`（VPC内プライベートIP）
   - RDS側でLambdaからの接続を拒否
   - pg_hba.conf設定またはセキュリティグループ問題

**解決すべき項目**:
1. RDSセキュリティグループ設定確認
2. VPCエンドポイント・ルーティング確認  
3. Lambda環境変数のDB接続設定確認
4. pg_hba.conf設定（必要に応じて）

**ワークフロー改善案**:
- デプロイ後の動作確認ステップ追加
- ヘルスチェックエンドポイント呼び出し
- エラー時のより詳細な診断情報出力

---

## Deploy Frontend関連

### 状況確認結果（2025-07-29）

**Amplify設定状況**:
- アプリID: `d3tuiikdacsjk0`
- フレームワーク: Next.js - SSR
- 自動ビルド: **無効** (`enableAutoBuild: False`)
- ステージ: DEVELOPMENT

**最近のビルド履歴**:
- Job ID 28 (最新): ✅ 成功 (2分22秒)
- Job ID 27: ✅ 成功 (3分18秒)  
- Job ID 26: ✅ 成功 (5分25秒)
- Job ID 25: ❌ 失敗 (BUILD段階で失敗)
- Job ID 24: ❌ 失敗

**現在のサイト状況**:
- URL: https://dev.noe-room.com  
- ステータス: ✅ 正常動作 (HTTP 200)
- キャッシュ: HIT (Next.js)

**Deploy Frontendワークフローの期待動作**:
1. `enableAutoBuild: False`のため手動トリガーが適切
2. ワークフローからの`aws amplify start-job`が正しい手法
3. ビルド時間は約2-5分程度が正常

**注意点**:
- 過去にBUILD段階での失敗例あり
- 現在は安定しているが、失敗時はログ詳細確認が必要
- 自動ビルドが無効なのでGitプッシュでは自動デプロイされない

---

## Terraform Workflow関連

### 問題: Terraform planが無限に終了しない

**症状**:
- GitHub ActionsのTerraform Workflowがタイムアウト
- ワークフローを手動キャンセルする必要がある
- 長時間実行されても結果が得られない

**調査日**: 2025-07-29

**根本原因**: インタラクティブ変数入力待機
```
Creating Terraform plan...
var.db_password
  Database password

Error: The operation was canceled.
```

**詳細分析**:
1. **症状の表面**: ワークフローが終了しない
2. **直接原因**: `terraform plan`でユーザー入力待機
3. **根本原因**: `db_password`変数未定義でインタラクティブモード

**解決済み修正内容**:
1. **非インタラクティブモード強制**
   ```yaml
   terraform plan -input=false -no-color -out=tfplan
   terraform apply -input=false -auto-approve tfplan
   ```

2. **環境変数でのシークレット管理**
   ```yaml
   env:
     TF_VAR_db_password: ${{ secrets.DB_PASSWORD }}
   ```

3. **タイムアウト設定追加**
   ```yaml
   timeout-minutes: 15  # plan用
   timeout-minutes: 30  # apply用
   ```

**今後の対策**:
- GitHub Secretsに`DB_PASSWORD`を設定必須
- 全てのTerraform変数を環境変数またはvarsファイルで定義
- `-input=false`フラグを必ず使用してインタラクティブモードを無効化

**学んだ教訓**:
- ワークフローが「終わらない」≠「エラー」、入力待機の可能性を考慮
- 実際のログ確認なしに推測で回答してはいけない
- Terraformはデフォルトでインタラクティブモード、CI/CDでは明示的に無効化が必要

---

## 一般的なトラブルシューティング手順

### 1. ワークフロー vs 実際の動作を分離して確認
- GitHub Actionsのステップ実行状況
- AWSリソースの実際の状態
- アプリケーションの動作確認

### 2. ログの確認順序
1. GitHub Actionsログ
2. CloudWatch Logs（Lambda/Amplify）
3. AWS リソース状態（Lambda/RDS/Amplify）
4. 実際のエンドポイント呼び出し結果

### 3. 問題の切り分け
- デプロイプロセスの問題 vs アプリケーション動作の問題
- 権限の問題 vs 設定の問題
- 一時的な問題 vs 恒久的な設定問題