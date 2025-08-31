package com.shirogane.holy.knights.adapter.controller

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class HealthController {
    private val logger = LoggerFactory.getLogger(HealthController::class.java)
    
    fun checkHealth() = mapOf(
        "status" to "healthy",
        "service" to "shirogane-holy-knights-api"
    ).also {
        logger.info("Health check requested")
    }
}