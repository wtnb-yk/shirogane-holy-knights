package com.shirogane.holy.knights.infrastructure.lambda

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import org.springframework.core.env.Environment
import org.springframework.stereotype.Component

@Component
class CorsHandler(
    private val environment: Environment
) {
    private val allowedOriginsConfig: String by lazy {
        environment.getProperty("cors.allowed-origins", "*")
    }
    
    fun addCorsHeaders(request: APIGatewayProxyRequestEvent, response: APIGatewayProxyResponseEvent): APIGatewayProxyResponseEvent {
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
    
    fun createOptionsResponse(request: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent {
        val response = APIGatewayProxyResponseEvent()
            .withStatusCode(200)
            .withBody("")
        return addCorsHeaders(request, response)
    }
    
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