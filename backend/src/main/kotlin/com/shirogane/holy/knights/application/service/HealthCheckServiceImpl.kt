package com.shirogane.holy.knights.application.service

import com.shirogane.holy.knights.domain.model.*
import com.shirogane.holy.knights.domain.service.HealthCheckService
import kotlinx.coroutines.withTimeoutOrNull
import org.slf4j.LoggerFactory
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.r2dbc.core.awaitSingle
import org.springframework.stereotype.Service
import java.time.Instant
import kotlin.system.measureTimeMillis

/**
 * ヘルスチェックサービスの実装
 */
@Service
class HealthCheckServiceImpl(
    private val template: R2dbcEntityTemplate
) : HealthCheckService {
    
    private val logger = LoggerFactory.getLogger(HealthCheckServiceImpl::class.java)
    private val startTime = Instant.now()
    private val version = System.getProperty("app.version") ?: "unknown"
    
    override suspend fun performHealthCheck(level: HealthCheckLevel): HealthCheckResult {
        return when (level) {
            HealthCheckLevel.BASIC -> basicHealthCheck()
            HealthCheckLevel.DETAILED -> detailedHealthCheck()
            HealthCheckLevel.COMPLETE -> completeHealthCheck()
        }
    }
    
    override suspend fun basicHealthCheck(): HealthCheckResult {
        logger.debug("Performing basic health check")
        
        val checks = mutableMapOf<String, ComponentHealth>()
        
        // サービス起動確認
        checks["service"] = ComponentHealth(
            status = HealthStatus.HEALTHY,
            message = "Service is running",
            responseTime = 0
        )
        
        val overallStatus = determineOverallStatus(checks.values)
        
        return HealthCheckResult(
            status = overallStatus,
            service = "shirogane-holy-knights-api",
            timestamp = Instant.now(),
            checks = checks,
            version = version,
            uptime = Instant.now().epochSecond - startTime.epochSecond
        )
    }
    
    override suspend fun detailedHealthCheck(): HealthCheckResult {
        logger.debug("Performing detailed health check")
        
        val checks = mutableMapOf<String, ComponentHealth>()
        
        // サービス起動確認
        checks["service"] = ComponentHealth(
            status = HealthStatus.HEALTHY,
            message = "Service is running",
            responseTime = 0
        )
        
        // データベース接続確認
        checks["database"] = checkDatabaseConnection()
        
        val overallStatus = determineOverallStatus(checks.values)
        
        return HealthCheckResult(
            status = overallStatus,
            service = "shirogane-holy-knights-api",
            timestamp = Instant.now(),
            checks = checks,
            version = version,
            uptime = Instant.now().epochSecond - startTime.epochSecond
        )
    }
    
    override suspend fun completeHealthCheck(): HealthCheckResult {
        logger.debug("Performing complete health check")
        
        val checks = mutableMapOf<String, ComponentHealth>()
        
        // サービス起動確認
        checks["service"] = ComponentHealth(
            status = HealthStatus.HEALTHY,
            message = "Service is running",
            responseTime = 0
        )
        
        // データベース接続確認
        checks["database"] = checkDatabaseConnection()
        
        // データベーステーブル存在確認
        checks["database_tables"] = checkDatabaseTables()
        
        val overallStatus = determineOverallStatus(checks.values)
        
        return HealthCheckResult(
            status = overallStatus,
            service = "shirogane-holy-knights-api",
            timestamp = Instant.now(),
            checks = checks,
            version = version,
            uptime = Instant.now().epochSecond - startTime.epochSecond
        )
    }
    
    /**
     * データベース接続確認
     */
    private suspend fun checkDatabaseConnection(): ComponentHealth {
        return try {
            val responseTime = measureTimeMillis {
                withTimeoutOrNull(5000) { // 5秒タイムアウト
                    template.databaseClient.sql("SELECT 1 as test")
                        .map { row -> row.get("test", Integer::class.java) }
                        .awaitSingle()
                } ?: throw RuntimeException("Database connection timeout")
            }
            
            ComponentHealth(
                status = HealthStatus.HEALTHY,
                message = "Database connection successful",
                responseTime = responseTime,
                details = mapOf(
                    "host" to (System.getenv("DATABASE_HOST") ?: "localhost"),
                    "port" to (System.getenv("DATABASE_PORT") ?: "5432")
                )
            )
        } catch (e: Exception) {
            logger.error("Database connection check failed", e)
            ComponentHealth(
                status = HealthStatus.UNHEALTHY,
                message = "Database connection failed: ${e.message}",
                details = mapOf(
                    "error" to e.javaClass.simpleName,
                    "host" to (System.getenv("DATABASE_HOST") ?: "localhost"),
                    "port" to (System.getenv("DATABASE_PORT") ?: "5432")
                )
            )
        }
    }
    
    /**
     * データベーステーブル存在確認
     */
    private suspend fun checkDatabaseTables(): ComponentHealth {
        return try {
            var tableCount = 0
            val responseTime = measureTimeMillis {
                withTimeoutOrNull(10000) { // 10秒タイムアウト
                    tableCount = template.databaseClient.sql("""
                        SELECT COUNT(*) as table_count 
                        FROM information_schema.tables 
                        WHERE table_schema = 'public' 
                        AND table_name IN ('videos', 'news', 'songs', 'events')
                    """.trimIndent())
                        .map { row -> 
                            (row.get("table_count") as Number).toInt()
                        }
                        .awaitSingle()
                } ?: throw RuntimeException("Database table check timeout")
            }
            
            if (tableCount >= 4) {
                ComponentHealth(
                    status = HealthStatus.HEALTHY,
                    message = "All required tables exist",
                    responseTime = responseTime,
                    details = mapOf("table_count" to tableCount)
                )
            } else {
                ComponentHealth(
                    status = HealthStatus.DEGRADED,
                    message = "Some required tables are missing",
                    responseTime = responseTime,
                    details = mapOf("table_count" to tableCount, "expected" to 4)
                )
            }
        } catch (e: Exception) {
            logger.error("Database table check failed", e)
            ComponentHealth(
                status = HealthStatus.UNHEALTHY,
                message = "Database table check failed: ${e.message}",
                details = mapOf("error" to e.javaClass.simpleName)
            )
        }
    }
    
    /**
     * 個別チェック結果から全体のステータスを決定
     */
    private fun determineOverallStatus(checks: Collection<ComponentHealth>): HealthStatus {
        return when {
            checks.any { it.status == HealthStatus.UNHEALTHY } -> HealthStatus.UNHEALTHY
            checks.any { it.status == HealthStatus.DEGRADED } -> HealthStatus.DEGRADED
            else -> HealthStatus.HEALTHY
        }
    }
}
