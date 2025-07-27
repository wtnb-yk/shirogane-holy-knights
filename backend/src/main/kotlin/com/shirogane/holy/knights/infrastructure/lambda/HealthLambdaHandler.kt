package com.shirogane.holy.knights.infrastructure.lambda

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory

/**
 * 最小限のHealth Check Lambda ハンドラー
 * 
 * Dependencies無しで動作するため、クラスローディング問題を回避できます。
 */
class HealthLambdaHandler : RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    
    private val logger = LoggerFactory.getLogger(HealthLambdaHandler::class.java)
    private val objectMapper = ObjectMapper()
    
    override fun handleRequest(
        input: APIGatewayProxyRequestEvent,
        context: Context
    ): APIGatewayProxyResponseEvent {
        
        logger.info("リクエスト受信: ${input.httpMethod} ${input.path}")
        
        return try {
            val response = when {
                input.path == "/health" -> createHealthResponse()
                input.path == "/test" -> createTestResponse()
                input.path?.startsWith("/api/archives") == true -> createArchivesResponse()
                else -> createNotFoundResponse(input.path)
            }
            
            logger.info("レスポンス送信: ${response.statusCode}")
            response
            
        } catch (e: Exception) {
            logger.error("エラーが発生しました", e)
            createErrorResponse(e)
        }
    }
    
    private fun createHealthResponse(): APIGatewayProxyResponseEvent {
        val body = mapOf(
            "status" to "healthy",
            "service" to "shirogane-holy-knights-api",
            "timestamp" to System.currentTimeMillis(),
            "version" to "0.1.0"
        )
        
        return APIGatewayProxyResponseEvent().apply {
            statusCode = 200
            headers = mapOf(
                "Content-Type" to "application/json",
                "Access-Control-Allow-Origin" to "*"
            )
            this.body = objectMapper.writeValueAsString(body)
        }
    }
    
    private fun createTestResponse(): APIGatewayProxyResponseEvent {
        val body = mapOf(
            "message" to "Test endpoint is working",
            "timestamp" to System.currentTimeMillis()
        )
        
        return APIGatewayProxyResponseEvent().apply {
            statusCode = 200
            headers = mapOf(
                "Content-Type" to "application/json",
                "Access-Control-Allow-Origin" to "*"
            )
            this.body = objectMapper.writeValueAsString(body)
        }
    }
    
    private fun createArchivesResponse(): APIGatewayProxyResponseEvent {
        val body = mapOf(
            "message" to "Archives API is working",
            "archives" to emptyList<Any>(),
            "timestamp" to System.currentTimeMillis()
        )
        
        return APIGatewayProxyResponseEvent().apply {
            statusCode = 200
            headers = mapOf(
                "Content-Type" to "application/json",
                "Access-Control-Allow-Origin" to "*"
            )
            this.body = objectMapper.writeValueAsString(body)
        }
    }
    
    private fun createNotFoundResponse(path: String?): APIGatewayProxyResponseEvent {
        val body = mapOf(
            "message" to "Not Found",
            "path" to (path ?: "unknown")
        )
        
        return APIGatewayProxyResponseEvent().apply {
            statusCode = 404
            headers = mapOf(
                "Content-Type" to "application/json",
                "Access-Control-Allow-Origin" to "*"
            )
            this.body = objectMapper.writeValueAsString(body)
        }
    }
    
    private fun createErrorResponse(e: Exception): APIGatewayProxyResponseEvent {
        val body = mapOf(
            "error" to "Internal Server Error",
            "message" to (e.message ?: "Unknown error"),
            "timestamp" to System.currentTimeMillis()
        )
        
        return APIGatewayProxyResponseEvent().apply {
            statusCode = 500
            headers = mapOf(
                "Content-Type" to "application/json",
                "Access-Control-Allow-Origin" to "*"
            )
            this.body = objectMapper.writeValueAsString(body)
        }
    }
}