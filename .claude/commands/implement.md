# IMPLEMENT フェーズ

# ユーザの入力
# $ARGUMENTS

## 目的
plan.mdに基づきタスク単位で実装を行う。

## 注意事項
- 常にultrathinkでしっかりと考えて作業を行うこと
- コード中に絵文字は使用されるべきではありません。
- コードの品質を最優先し、テスト可能で保守しやすいコードを書くこと。
- YAGNI（You Aren't Gonna Need It）の原則に従い、必要な機能のみを実装すること。

## 必要な入力ファイル
- `docs/plan/plan_{TIMESTAMP}.md` - 実装計画書
- 関連する既存ファイル・コード

## タスクに含まれるべきTODO
1. ユーザの指示を理解し、実装開始をコンソールで通知
2. 最新の `docs/plan/plan_{TIMESTAMP}.md` ファイルを読み込み、実装計画を確認
3. 現在のブランチを確認し、適切なブランチにいることを確認
4. プランに従った実装を段階的に実行
5. 実装内容の詳細を `docs/implement/implement_{TIMESTAMP}.md` に記録
6. 関連するplanファイル、実装詳細ファイルをコンソール出力

## 出力ファイル
- `docs/implement/implement_{TIMESTAMP}.md` - 実装詳細記録

## 最終出力形式
- 必ず以下の三つの形式で出力を行ってください

### 実装完了の場合
status: SUCCESS
next: TEST
details: "実装完了。implement_{TIMESTAMP}.mdに詳細記録。"

### 追加作業が必要な場合
status: NEED_MORE
next: IMPLEMENT
details: "依存関係の実装が必要。implement_{TIMESTAMP}.mdに詳細記録。タスク継続。"

### プラン見直しが必要な場合
status: NEED_REPLAN
next: PLAN
details: "設計変更が必要。implement_{TIMESTAMP}.mdに詳細記録。プランフェーズに戻る。"
