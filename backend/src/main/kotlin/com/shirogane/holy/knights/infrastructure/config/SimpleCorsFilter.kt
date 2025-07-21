package com.shirogane.holy.knights.infrastructure.config

import jakarta.servlet.Filter
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component

/**
 * シンプルなCORSフィルター
 * 
 * Spring MVCとSpring WebFluxの競合が発生した場合のバックアップとして、
 * サーブレットフィルターレベルで直接CORSヘッダーを追加します。
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class SimpleCorsFilter : Filter {
    
    override fun doFilter(req: ServletRequest, res: ServletResponse, chain: FilterChain) {
        val request = req as HttpServletRequest
        val response = res as HttpServletResponse
        
        // CORS用のヘッダーを追加
        response.setHeader("Access-Control-Allow-Origin", "*")
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT")
        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, X-Requested-With")
        
        // OPTIONSリクエストはここで処理
        if ("OPTIONS".equals(request.method, ignoreCase = true)) {
            response.status = HttpServletResponse.SC_OK
            return
        }
        
        // それ以外のリクエストは通常通り処理
        chain.doFilter(req, res)
    }
}