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
    
    private val allowedMethods: String by lazy {
        environment.getProperty("cors.allowed-methods", "GET,POST,PUT,DELETE,OPTIONS")
    }
    
    private val allowedHeaders: String by lazy {
        environment.getProperty("cors.allowed-headers", "Content-Type,Authorization,X-Requested-With,Accept")
    }
    
    private val maxAge: String by lazy {
        environment.getProperty("cors.max-age", "3600")
    }
    
    fun addCorsHeaders(request: APIGatewayProxyRequestEvent, response: APIGatewayProxyResponseEvent): APIGatewayProxyResponseEvent {
        val requestOrigin = request.headers?.get("origin") ?: request.headers?.get("Origin")
        val allowedOrigin = determineAllowedOrigin(requestOrigin)
        
        val headers = response.headers?.toMutableMap() ?: mutableMapOf()
        
        if (allowedOrigin != null) {
            headers["Access-Control-Allow-Origin"] = allowedOrigin
            // 本番環境では認証情報を含むリクエストのみ許可
            if (isProductionEnvironment() && allowedOrigin != "*") {
                headers["Access-Control-Allow-Credentials"] = "true"
            }
        }
        
        headers["Access-Control-Allow-Methods"] = allowedMethods
        headers["Access-Control-Allow-Headers"] = allowedHeaders
        headers["Access-Control-Max-Age"] = maxAge
        
        // セキュリティヘッダーの追加
        headers["X-Content-Type-Options"] = "nosniff"
        headers["X-Frame-Options"] = "DENY"
        headers["X-XSS-Protection"] = "1; mode=block"
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
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
        
        // 本番環境では "*" を許可しない
        if (allowedOrigins.contains("*") && !isProductionEnvironment()) {
            return requestOrigin
        }
        
        // localhostの任意ポートパターンをチェック（開発環境のみ）
        for (allowedOrigin in allowedOrigins) {
            if (allowedOrigin == "http://localhost:*" && 
                requestOrigin.startsWith("http://localhost:") &&
                !isProductionEnvironment()) {
                return requestOrigin
            }
            // 具体的なOriginがマッチする場合
            if (allowedOrigin == requestOrigin) {
                return requestOrigin
            }
            // ワイルドカードサブドメインのチェック（例: *.example.com）
            if (allowedOrigin.startsWith("*.") && 
                requestOrigin.endsWith(allowedOrigin.substring(1))) {
                return requestOrigin
            }
        }
        
        return null
    }
    
    private fun isProductionEnvironment(): Boolean {
        val activeProfiles = environment.activeProfiles
        return activeProfiles.contains("lambda")
    }
}