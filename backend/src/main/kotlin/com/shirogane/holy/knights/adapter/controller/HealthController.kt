package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.service.DeploymentReadinessService
import com.shirogane.holy.knights.domain.model.HealthCheckLevel
import com.shirogane.holy.knights.domain.model.HealthStatus
import com.shirogane.holy.knights.domain.service.HealthCheckService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class HealthController(
    private val healthCheckService: HealthCheckService,
    private val deploymentReadinessService: DeploymentReadinessService
) {
    private val logger = LoggerFactory.getLogger(HealthController::class.java)
    
    /**
     * 基本ヘルスチェック（従来の軽量チェック）
     */
    suspend fun checkHealth() = ApiResponse(
        200,
        mapOf(
            "status" to "healthy",
            "service" to "shirogane-holy-knights-api"
        )
    ).also {
        logger.info("Basic health check requested")
    }
    
    /**
     * 段階的ヘルスチェック
     */
    suspend fun checkHealthWithLevel(level: HealthCheckLevel): ApiResponse {
        logger.info("Health check requested with level: $level")
        
        return try {
            val result = healthCheckService.performHealthCheck(level)
            
            val statusCode = when (result.status) {
                HealthStatus.HEALTHY -> 200
                HealthStatus.DEGRADED -> 200  // 一部機能に問題があるが利用可能
                HealthStatus.UNHEALTHY -> 503 // サービス利用不可
            }
            
            ApiResponse(
                statusCode,
                mapOf(
                    "status" to result.status.name.lowercase(),
                    "service" to result.service,
                    "timestamp" to result.timestamp.toString(),
                    "version" to result.version,
                    "uptime" to result.uptime,
                    "checks" to result.checks.mapValues { (_, health) ->
                        mapOf(
                            "status" to health.status.name.lowercase(),
                            "message" to health.message,
                            "responseTime" to health.responseTime,
                            "details" to health.details
                        ).filterValues { it != null }
                    }
                ).filterValues { it != null }
            )
        } catch (e: Exception) {
            logger.error("Health check failed", e)
            ApiResponse(
                503,
                mapOf(
                    "status" to "unhealthy",
                    "service" to "shirogane-holy-knights-api",
                    "error" to e.message
                )
            )
        }
    }
    
    /**
     * 基本ヘルスチェック
     */
    suspend fun checkBasicHealth(): ApiResponse {
        return checkHealthWithLevel(HealthCheckLevel.BASIC)
    }
    
    /**
     * 詳細ヘルスチェック（データベース接続含む）
     */
    suspend fun checkDetailedHealth(): ApiResponse {
        return checkHealthWithLevel(HealthCheckLevel.DETAILED)
    }
    
    /**
     * 完全ヘルスチェック（全依存関係の確認）
     */
    suspend fun checkCompleteHealth(): ApiResponse {
        return checkHealthWithLevel(HealthCheckLevel.COMPLETE)
    }
    
    /**
     * デプロイメント完了判定
     */
    suspend fun checkDeploymentReadiness(): ApiResponse {
        logger.info("Deployment readiness check requested")
        
        return try {
            val result = deploymentReadinessService.checkDeploymentReadiness(
                maxRetries = 1, // 単発チェック
                retryDelayMs = 0
            )
            
            val statusCode = if (result.isReady) 200 else 503
            
            ApiResponse(
                statusCode,
                mapOf(
                    "ready" to result.isReady,
                    "attempts" to result.attempts,
                    "message" to result.message,
                    "error" to result.error,
                    "service" to "shirogane-holy-knights-api"
                ).filterValues { it != null }
            )
        } catch (e: Exception) {
            logger.error("Deployment readiness check failed", e)
            ApiResponse(
                503,
                mapOf(
                    "ready" to false,
                    "message" to "Deployment readiness check failed",
                    "error" to e.message,
                    "service" to "shirogane-holy-knights-api"
                )
            )
        }
    }
}