#!/bin/bash

# デプロイメント完了判定スクリプト
# 段階的ヘルスチェックを実行してデプロイメントの完了を確認

set -e

# デフォルト設定
API_BASE_URL="${API_BASE_URL:-https://api.shirogane-portal.com}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-30}"
RETRY_DELAY="${RETRY_DELAY:-5}"
TIMEOUT="${TIMEOUT:-10}"

# ログ関数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

# ヘルスチェック実行関数
check_health() {
    local endpoint="$1"
    local description="$2"
    
    log "Checking $description..."
    
    local response
    local http_code
    
    response=$(curl -s -w "\n%{http_code}" --max-time "$TIMEOUT" "$API_BASE_URL$endpoint" || echo -e "\n000")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [[ "$http_code" == "200" ]]; then
        log "$description: OK"
        return 0
    elif [[ "$http_code" == "503" ]]; then
        log "$description: Service Unavailable (503)"
        if [[ -n "$body" ]]; then
            log "Response: $body"
        fi
        return 1
    else
        error "$description: HTTP $http_code"
        if [[ -n "$body" ]]; then
            error "Response: $body"
        fi
        return 1
    fi
}

# 段階的ヘルスチェック実行
perform_staged_health_check() {
    local attempt="$1"
    
    log "=== Deployment readiness check (attempt $attempt/$MAX_ATTEMPTS) ==="
    
    # Stage 1: 基本ヘルスチェック
    if ! check_health "/health/basic" "Basic health check"; then
        return 1
    fi
    
    # Stage 2: 詳細ヘルスチェック（データベース接続含む）
    if ! check_health "/health/detailed" "Detailed health check (with database)"; then
        return 1
    fi
    
    # Stage 3: 完全ヘルスチェック（全依存関係）
    if ! check_health "/health/complete" "Complete health check (all dependencies)"; then
        return 1
    fi
    
    log "All health check stages passed!"
    return 0
}

# メイン処理
main() {
    log "Starting deployment readiness check"
    log "API Base URL: $API_BASE_URL"
    log "Max attempts: $MAX_ATTEMPTS"
    log "Retry delay: ${RETRY_DELAY}s"
    log "Request timeout: ${TIMEOUT}s"
    
    for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
        if perform_staged_health_check "$attempt"; then
            log "=== Deployment is ready! ==="
            log "Deployment readiness confirmed after $attempt attempts"
            exit 0
        fi
        
        if [[ "$attempt" -lt "$MAX_ATTEMPTS" ]]; then
            log "Waiting ${RETRY_DELAY}s before next attempt..."
            sleep "$RETRY_DELAY"
        fi
    done
    
    error "=== Deployment readiness check failed ==="
    error "Failed to confirm deployment readiness after $MAX_ATTEMPTS attempts"
    exit 1
}

# 使用方法表示
show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Check deployment readiness using staged health checks.

OPTIONS:
    -u, --url URL           API base URL (default: https://api.shirogane-portal.com)
    -m, --max-attempts N    Maximum number of attempts (default: 30)
    -d, --delay SECONDS     Delay between attempts in seconds (default: 5)
    -t, --timeout SECONDS   Request timeout in seconds (default: 10)
    -h, --help             Show this help message

ENVIRONMENT VARIABLES:
    API_BASE_URL           API base URL
    MAX_ATTEMPTS           Maximum number of attempts
    RETRY_DELAY            Delay between attempts in seconds
    TIMEOUT                Request timeout in seconds

EXAMPLES:
    # Basic usage
    $0

    # Custom API URL
    $0 --url https://dev-api.shirogane-portal.com

    # Quick check with fewer retries
    $0 --max-attempts 10 --delay 2

    # Using environment variables
    API_BASE_URL=https://dev-api.shirogane-portal.com MAX_ATTEMPTS=15 $0

EXIT CODES:
    0    Deployment is ready
    1    Deployment readiness check failed
EOF
}

# コマンドライン引数解析
while [[ $# -gt 0 ]]; do
    case $1 in
        -u|--url)
            API_BASE_URL="$2"
            shift 2
            ;;
        -m|--max-attempts)
            MAX_ATTEMPTS="$2"
            shift 2
            ;;
        -d|--delay)
            RETRY_DELAY="$2"
            shift 2
            ;;
        -t|--timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# 必要なコマンドの確認
if ! command -v curl &> /dev/null; then
    error "curl is required but not installed"
    exit 1
fi

# メイン処理実行
main