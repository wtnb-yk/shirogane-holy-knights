package com.shirogane.holy.knights.infrastructure.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

/**
 * CORS設定クラス - WebFilter版
 * 環境変数から許可するOriginを動的に設定（複数Origin対応）
 */
@Configuration
class CorsConfig {

    @Value("\${cors.allowed-origins:*}")
    private val allowedOriginsConfig: String = "*"

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    fun corsWebFilter(): WebFilter {
        return WebFilter { exchange: ServerWebExchange, chain: WebFilterChain ->
            val response = exchange.response
            val headers = response.headers
            val request = exchange.request
            
            // リクエストのOriginを取得
            val requestOrigin = request.headers.getFirst(HttpHeaders.ORIGIN)
            
            // 許可するOriginを決定
            val allowedOrigin = determineAllowedOrigin(requestOrigin)
            
            // CORSヘッダーを設定
            if (allowedOrigin != null) {
                headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, allowedOrigin)
                headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true")
            }
            headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "GET, POST, PUT, DELETE, OPTIONS")
            headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, "*")
            headers.add(HttpHeaders.ACCESS_CONTROL_MAX_AGE, "3600")
            
            // OPTIONSリクエストの場合はここで終了
            if (exchange.request.method == HttpMethod.OPTIONS) {
                response.statusCode = HttpStatus.OK
                return@WebFilter Mono.empty()
            }
            
            chain.filter(exchange)
        }
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
