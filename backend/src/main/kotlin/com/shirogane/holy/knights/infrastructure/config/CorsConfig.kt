package com.shirogane.holy.knights.infrastructure.config

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
 */
@Configuration
class CorsConfig {

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    fun corsWebFilter(): WebFilter {
        return WebFilter { exchange: ServerWebExchange, chain: WebFilterChain ->
            val response = exchange.response
            val headers = response.headers
            
            // CORSヘッダーを設定
            headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*")
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
}
