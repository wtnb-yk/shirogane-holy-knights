package com.shirogane.holy.knights.infrastructure.lambda

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.port.`in`.VideoUseCasePort
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import org.springframework.core.env.Environment
import org.springframework.stereotype.Component
import java.util.function.Function

/**
 * AWS Lambda + API Gateway用のFunction実装
 */
@Component
class ApiGatewayFunction(
    private val videoUseCase: VideoUseCasePort,
    private val objectMapper: ObjectMapper,
    private val environment: Environment
) : Function<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private val logger = LoggerFactory.getLogger(ApiGatewayFunction::class.java)
    
    private val allowedOriginsConfig: String by lazy {
        environment.getProperty("cors.allowed-origins", "*")
    }

    override fun apply(request: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent {
        logger.info("Lambda Function called: ${request.httpMethod} ${request.path}")
        
        // OPTIONSリクエストの処理（プリフライト）
        if (request.httpMethod == "OPTIONS") {
            return createCorsResponse(request, 200, "")
        }
        
        return try {
            val response = when {
                request.path == "/health" && request.httpMethod == "GET" -> handleHealth()
                request.path == "/videoSearch" && request.httpMethod == "POST" -> handleVideoSearch(request)
                else -> {
                    logger.warn("Unknown path: ${request.httpMethod} ${request.path}")
                    APIGatewayProxyResponseEvent()
                        .withStatusCode(404)
                        .withHeaders(mapOf("Content-Type" to "application/json"))
                        .withBody(objectMapper.writeValueAsString(mapOf("error" to "Not Found")))
                }
            }
            // 通常のレスポンスにCORSヘッダーを追加
            addCorsHeaders(request, response)
        } catch (e: Exception) {
            logger.error("Lambda Function error", e)
            val errorResponse = APIGatewayProxyResponseEvent()
                .withStatusCode(500)
                .withHeaders(mapOf("Content-Type" to "application/json"))
                .withBody(objectMapper.writeValueAsString(mapOf("error" to "Internal Server Error")))
            addCorsHeaders(request, errorResponse)
        }
    }

    private fun handleHealth(): APIGatewayProxyResponseEvent {
        logger.info("Health check requested")
        val response = mapOf(
            "status" to "healthy",
            "service" to "shirogane-holy-knights-api"
        )
        
        return APIGatewayProxyResponseEvent()
            .withStatusCode(200)
            .withHeaders(mapOf("Content-Type" to "application/json"))
            .withBody(objectMapper.writeValueAsString(response))
    }

    private fun handleVideoSearch(request: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent {
        logger.info("Video search requested")
        
        val params = if (request.body != null) {
            objectMapper.readValue(request.body, VideoSearchParamsDto::class.java)
        } else {
            VideoSearchParamsDto() // デフォルト値
        }
        
        logger.info("Video search params: $params")
        
        val result = runBlocking { videoUseCase.searchVideos(params) }
        logger.info("Video search returning ${result.items.size} items")
        
        return APIGatewayProxyResponseEvent()
            .withStatusCode(200)
            .withHeaders(mapOf("Content-Type" to "application/json"))
            .withBody(objectMapper.writeValueAsString(result))
    }
    
    /**
     * CORSヘッダーをレスポンスに追加
     */
    private fun addCorsHeaders(request: APIGatewayProxyRequestEvent, response: APIGatewayProxyResponseEvent): APIGatewayProxyResponseEvent {
        val requestOrigin = request.headers?.get("origin") ?: request.headers?.get("Origin")
        val allowedOrigin = determineAllowedOrigin(requestOrigin)
        
        val headers = response.headers?.toMutableMap() ?: mutableMapOf()
        
        if (allowedOrigin != null) {
            headers["Access-Control-Allow-Origin"] = allowedOrigin
            headers["Access-Control-Allow-Credentials"] = "true"
        }
        headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept"
        headers["Access-Control-Max-Age"] = "3600"
        
        return response.withHeaders(headers)
    }
    
    /**
     * OPTIONSリクエスト用のCORSレスポンスを作成
     */
    private fun createCorsResponse(request: APIGatewayProxyRequestEvent, statusCode: Int, body: String): APIGatewayProxyResponseEvent {
        val response = APIGatewayProxyResponseEvent()
            .withStatusCode(statusCode)
            .withBody(body)
        return addCorsHeaders(request, response)
    }
    
    /**
     * リクエストのOriginが許可されているかチェックし、適切なOriginを返す
     */
    private fun determineAllowedOrigin(requestOrigin: String?): String? {
        if (requestOrigin == null) return null
        
        val allowedOrigins = allowedOriginsConfig.split(",").map { it.trim() }
        
        // "*" が含まれている場合は全て許可
        if (allowedOrigins.contains("*")) {
            return requestOrigin
        }
        
        // localhostの任意ポートパターンをチェック
        for (allowedOrigin in allowedOrigins) {
            if (allowedOrigin == "http://localhost:*" && 
                requestOrigin.startsWith("http://localhost:")) {
                return requestOrigin
            }
            // 具体的なOriginがマッチする場合
            if (allowedOrigin == requestOrigin) {
                return requestOrigin
            }
        }
        
        return null
    }
}