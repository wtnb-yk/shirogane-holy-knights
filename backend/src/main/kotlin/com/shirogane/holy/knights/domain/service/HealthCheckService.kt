package com.shirogane.holy.knights.domain.service

import com.shirogane.holy.knights.domain.model.HealthCheckResult
import com.shirogane.holy.knights.domain.model.HealthCheckLevel

/**
 * ヘルスチェックサービスのドメインサービスインターフェース
 */
interface HealthCheckService {
    
    /**
     * 指定されたレベルでヘルスチェックを実行
     */
    suspend fun performHealthCheck(level: HealthCheckLevel): HealthCheckResult
    
    /**
     * 基本ヘルスチェック（サービス起動確認のみ）
     */
    suspend fun basicHealthCheck(): HealthCheckResult
    
    /**
     * 詳細ヘルスチェック（データベース接続含む）
     */
    suspend fun detailedHealthCheck(): HealthCheckResult
    
    /**
     * 完全ヘルスチェック（全依存関係の確認）
     */
    suspend fun completeHealthCheck(): HealthCheckResult
}