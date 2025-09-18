package com.shirogane.holy.knights.application.service

import com.shirogane.holy.knights.domain.model.HealthCheckLevel
import com.shirogane.holy.knights.domain.model.HealthStatus
import com.shirogane.holy.knights.domain.service.HealthCheckService
import kotlinx.coroutines.delay
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

/**
 * デプロイメント完了判定サービス
 */
@Service
class DeploymentReadinessService(
    private val healthCheckService: HealthCheckService
) {
    private val logger = LoggerFactory.getLogger(DeploymentReadinessService::class.java)
    
    /**
     * 段階的ヘルスチェックによるデプロイメント完了判定
     * 
     * @param maxRetries 最大リトライ回数
     * @param retryDelayMs リトライ間隔（ミリ秒）
     * @return デプロイメント完了判定結果
     */
    suspend fun checkDeploymentReadiness(
        maxRetries: Int = 30,
        retryDelayMs: Long = 2000
    ): DeploymentReadinessResult {
        logger.info("Starting deployment readiness check (maxRetries: $maxRetries, retryDelay: ${retryDelayMs}ms)")
        
        var attempt = 0
        val stages = listOf(
            "basic" to HealthCheckLevel.BASIC,
            "detailed" to HealthCheckLevel.DETAILED,
            "complete" to HealthCheckLevel.COMPLETE
        )
        
        while (attempt < maxRetries) {
            attempt++
            logger.info("Deployment readiness check attempt $attempt/$maxRetries")
            
            try {
                // 段階的ヘルスチェック実行
                for ((stageName, level) in stages) {
                    logger.info("Checking $stageName health...")
                    val result = healthCheckService.performHealthCheck(level)
                    
                    when (result.status) {
                        HealthStatus.HEALTHY -> {
                            logger.info("$stageName health check passed")
                            continue
                        }
                        HealthStatus.DEGRADED -> {
                            logger.warn("$stageName health check shows degraded status: ${result.checks}")
                            if (level == HealthCheckLevel.COMPLETE) {
                                // 完全チェックで劣化状態の場合は警告だが継続
                                logger.warn("Complete health check shows degraded status, but deployment is considered ready")
                                break
                            }
                            // 基本・詳細チェックで劣化状態の場合はリトライ
                            throw RuntimeException("$stageName health check degraded")
                        }
                        HealthStatus.UNHEALTHY -> {
                            logger.error("$stageName health check failed: ${result.checks}")
                            throw RuntimeException("$stageName health check failed")
                        }
                    }
                }
                
                // すべてのステージが成功
                logger.info("All health check stages passed. Deployment is ready.")
                return DeploymentReadinessResult(
                    isReady = true,
                    attempts = attempt,
                    message = "All health check stages passed successfully"
                )
                
            } catch (e: Exception) {
                logger.warn("Deployment readiness check attempt $attempt failed: ${e.message}")
                
                if (attempt >= maxRetries) {
                    logger.error("Deployment readiness check failed after $maxRetries attempts")
                    return DeploymentReadinessResult(
                        isReady = false,
                        attempts = attempt,
                        message = "Deployment readiness check failed after $maxRetries attempts: ${e.message}",
                        error = e.message
                    )
                }
                
                // リトライ前の待機
                logger.info("Waiting ${retryDelayMs}ms before next attempt...")
                delay(retryDelayMs)
            }
        }
        
        return DeploymentReadinessResult(
            isReady = false,
            attempts = attempt,
            message = "Deployment readiness check exceeded maximum attempts",
            error = "Maximum retry attempts exceeded"
        )
    }
    
    /**
     * 特定レベルのヘルスチェックが成功するまで待機
     */
    suspend fun waitForHealthLevel(
        level: HealthCheckLevel,
        maxRetries: Int = 15,
        retryDelayMs: Long = 2000
    ): Boolean {
        logger.info("Waiting for health level $level (maxRetries: $maxRetries)")
        
        repeat(maxRetries) { attempt ->
            try {
                val result = healthCheckService.performHealthCheck(level)
                if (result.status == HealthStatus.HEALTHY) {
                    logger.info("Health level $level achieved after ${attempt + 1} attempts")
                    return true
                }
                logger.info("Health level $level not ready (attempt ${attempt + 1}/$maxRetries): ${result.status}")
            } catch (e: Exception) {
                logger.warn("Health check attempt ${attempt + 1} failed: ${e.message}")
            }
            
            if (attempt < maxRetries - 1) {
                delay(retryDelayMs)
            }
        }
        
        logger.error("Health level $level not achieved after $maxRetries attempts")
        return false
    }
}

/**
 * デプロイメント完了判定結果
 */
data class DeploymentReadinessResult(
    val isReady: Boolean,
    val attempts: Int,
    val message: String,
    val error: String? = null
)