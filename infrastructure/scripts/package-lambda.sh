#!/usr/bin/env bash
set -euo pipefail

# Lambda デプロイパッケージ (package.zip) を生成する
# 使い方: ./infrastructure/scripts/package-lambda.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LAMBDA_DIR="$SCRIPT_DIR/../lambda"
BUILD_DIR="$LAMBDA_DIR/.build"
OUTPUT="$LAMBDA_DIR/package.zip"

echo "=== Lambda package build ==="

# Clean
rm -rf "$BUILD_DIR" "$OUTPUT"
mkdir -p "$BUILD_DIR"

# Install dependencies
echo "Installing dependencies (Linux x86_64 for Lambda)..."
pip3 install -r "$LAMBDA_DIR/requirements.txt" -t "$BUILD_DIR" \
  --platform manylinux2014_x86_64 \
  --implementation cp \
  --python-version 3.12 \
  --only-binary=:all: \
  --quiet

# Copy Lambda source
echo "Copying Lambda source..."
cp "$LAMBDA_DIR/handler.py" "$BUILD_DIR/"
cp "$LAMBDA_DIR/youtube_fetcher.py" "$BUILD_DIR/"

# Create zip
echo "Creating zip..."
cd "$BUILD_DIR"
zip -r "$OUTPUT" . -q

# Clean build dir
rm -rf "$BUILD_DIR"

SIZE=$(du -h "$OUTPUT" | cut -f1)
echo "=== Done: $OUTPUT ($SIZE) ==="
