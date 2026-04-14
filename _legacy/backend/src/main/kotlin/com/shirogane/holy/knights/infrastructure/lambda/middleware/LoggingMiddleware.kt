package com.shirogane.holy.knights.infrastructure.lambda.middleware

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class LoggingMiddleware : Middleware {
    private val logger = LoggerFactory.getLogger(LoggingMiddleware::class.java)
    
    override suspend fun handle(
        request: APIGatewayProxyRequestEvent,
        next: suspend () -> APIGatewayProxyResponseEvent
    ): APIGatewayProxyResponseEvent {
        val startTime = System.currentTimeMillis()
        
        logger.info("Processing request: ${request.httpMethod} ${request.path}")
        
        val response = next()
        
        val duration = System.currentTimeMillis() - startTime
        logger.info("Request completed: ${request.httpMethod} ${request.path} - Status: ${response.statusCode} - Duration: ${duration}ms")
        
        return response
    }
}