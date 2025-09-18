package com.shirogane.holy.knights.adapter.controller

import com.shirogane.holy.knights.application.service.DeploymentReadinessService
import com.shirogane.holy.knights.domain.service.HealthCheckService
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

/**
 * HealthController の基本的なテスト
 * 
 * 注意: このテストは基本的なヘルスチェック機能のみをテストします。
 * データベース接続を含む詳細なテストは統合テストで実装する必要があります。
 */
class HealthControllerTest : FunSpec({

    test("checkHealth should return basic healthy response") {
        // Given - モックサービスを使用（実際のデータベース接続は不要）
        val mockHealthCheckService = object : HealthCheckService {
            override suspend fun performHealthCheck(level: com.shirogane.holy.knights.domain.model.HealthCheckLevel) = 
                throw NotImplementedError("Mock implementation")
            override suspend fun basicHealthCheck() = 
                throw NotImplementedError("Mock implementation")
            override suspend fun detailedHealthCheck() = 
                throw NotImplementedError("Mock implementation")
            override suspend fun completeHealthCheck() = 
                throw NotImplementedError("Mock implementation")
        }
        
        val mockDeploymentReadinessService = DeploymentReadinessService(mockHealthCheckService)
        
        val healthController = HealthController(mockHealthCheckService, mockDeploymentReadinessService)

        // When
        val response = healthController.checkHealth()

        // Then
        response.statusCode shouldBe 200
        val body = response.body as Map<*, *>
        body["status"] shouldBe "healthy"
        body["service"] shouldBe "shirogane-holy-knights-api"
    }
})