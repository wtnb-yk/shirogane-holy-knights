# PLAN フェーズ

## 目的
実装方針の決定、タスク分解、ファイル変更計画、テスト方針を策定する。

## 必要な入力ファイル
- `docs/investigate/investigate_{TIMESTAMP}.md` - 調査結果

## 注意事項
- 関連するコードは全て読むこと。
- 全ての処理においてultrathinkでしっかりと考えて作業を行うこと。

# ユーザの入力
# $ARGUMENTS

## タスクに含まれるべきTODO
1. ユーザの指示を理解する
2. 最新の `docs/investigate/investigate_{TIMESTAMP}.md` を読み込み、調査結果を確認
3. 調査結果を元に実装方針を決定
4. 詳細実装タスクを分解し、優先度を設定
5. ファイル変更計画を作成（新規作成・修正・削除）
6. リスク分析と対策を検討
7. 実装計画を文書化し、`docs/plan/plan_{TIMESTAMP}.md`に保存

## 出力ファイル
- `docs/plan/plan_{TIMESTAMP}.md`

## 最終出力形式
- 必ず以下の二つの形式で出力を行ってください

### プラン策定完了の場合
status: SUCCESS
next: IMPLEMENT
details: "実装プラン策定完了。plan_{TIMESTAMP}.mdに詳細記録。実装フェーズに移行。"

### 調査不足の場合
status: NEED_MORE_INFO
next: INVESTIGATE
details: "情報不足。plan_{TIMESTAMP}.mdに詳細記録。追加調査が必要。"
