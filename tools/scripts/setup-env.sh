#!/bin/bash

# 環境設定セットアップスクリプト

echo "=== 環境設定ファイルのセットアップ ==="

# 引数チェック
if [ $# -eq 0 ]; then
    echo "使用方法: $0 <環境名>"
    echo "例:"
    echo "  $0 dev    # 開発環境用"
    echo "  $0 prd    # 本番環境用"
    exit 1
fi

ENV_NAME=$1
TEMPLATE_FILE="../config/.env.${ENV_NAME}.template"
ENV_FILE="../config/.env.${ENV_NAME}"

# テンプレートファイルの存在確認
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "エラー: テンプレートファイル '$TEMPLATE_FILE' が見つかりません"
    exit 1
fi

# 既存ファイルの確認
if [ -f "$ENV_FILE" ]; then
    echo "警告: '$ENV_FILE' は既に存在します"
    read -p "上書きしますか？ (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "処理を中止しました"
        exit 1
    fi
fi

# ファイルをコピー
cp "$TEMPLATE_FILE" "$ENV_FILE"
echo "✅ '$TEMPLATE_FILE' を '$ENV_FILE' にコピーしました"

echo ""
echo "次の手順："
echo "1. '$ENV_FILE' を編集して実際の設定値を入力してください"
echo "2. 実行時に環境変数を指定してください:"
echo "   export ENV_FILE=$ENV_FILE"
echo "   python3 youtube_data_pipeline.py"
echo ""
echo "または:"
echo "   ENV_FILE=$ENV_FILE python3 youtube_data_pipeline.py"