package com.shirogane.holy.knights.domain.model

import java.time.Instant

/**
 * ヘルスチェックの結果を表すドメインモデル
 */
data class HealthCheckResult(
    val status: HealthStatus,
    val service: String,
    val timestamp: Instant,
    val checks: Map<String, ComponentHealth>,
    val version: String? = null,
    val uptime: Long? = null
)

/**
 * 個別コンポーネントのヘルス状態
 */
data class ComponentHealth(
    val status: HealthStatus,
    val message: String? = null,
    val responseTime: Long? = null,
    val details: Map<String, Any>? = null
)

/**
 * ヘルスステータス
 */
enum class HealthStatus {
    HEALTHY,    // 正常
    DEGRADED,   // 一部機能に問題があるが利用可能
    UNHEALTHY   // 利用不可
}

/**
 * ヘルスチェックレベル
 */
enum class HealthCheckLevel {
    BASIC,      // 基本チェック（サービス起動確認のみ）
    DETAILED,   // 詳細チェック（データベース接続含む）
    COMPLETE    // 完全チェック（全依存関係の確認）
}