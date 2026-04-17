#!/bin/bash
# コンポーネント設計チェック（.claude/rules/architecture.md 準拠）
# PostToolUse (Write|Edit) フックから呼ばれる。stdin に JSON が渡される。
set -euo pipefail

FILE=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty' 2>/dev/null)

# .tsx 以外はスキップ
if [[ -z "$FILE" || ! "$FILE" =~ \.tsx$ || ! -f "$FILE" ]]; then
  exit 0
fi

ERRORS=""
NAME="${FILE##*/}"

# 1. 総行数チェック（150行上限）
TOTAL=$(wc -l < "$FILE" | tr -d ' ')
if (( TOTAL > 150 )); then
  ERRORS="${ERRORS}${NAME}: ${TOTAL}行（上限150行）分割を検討\n"
fi

# 2. JSX行数チェック（return内 50行上限）
JSX_LINES=$(awk '
  /return \(/ { in_jsx=1; count=0; next }
  in_jsx && /^\s*\);?\s*$/ {
    if (count > max) max = count
    in_jsx=0
    next
  }
  in_jsx { count++ }
  END { print max+0 }
' "$FILE")

if (( JSX_LINES > 50 )); then
  ERRORS="${ERRORS}${NAME}: JSX ${JSX_LINES}行（上限50行）子コンポーネント抽出を検討\n"
fi

# 3. パレット直接参照チェック
if grep -qE 'text-(navy|cream|gold|dark|silver)-|bg-(navy|cream|gold|dark|silver)-|border-(navy|cream|gold|dark|silver)-' "$FILE"; then
  ERRORS="${ERRORS}${NAME}: パレット色を直接参照しています。セマンティックトークンを使ってください\n"
fi

# 4. default export チェック（page.tsx / layout.tsx 以外）
if [[ "$NAME" != "page.tsx" && "$NAME" != "layout.tsx" ]]; then
  if grep -qE '^export default ' "$FILE"; then
    ERRORS="${ERRORS}${NAME}: default export は page.tsx / layout.tsx のみ。named export を使ってください\n"
  fi
fi

if [[ -n "$ERRORS" ]]; then
  MSG=$(printf '%b' "$ERRORS")
  jq -n --arg ctx "[コンポーネント設計チェック違反]\n$MSG" \
    '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":$ctx}}'
fi