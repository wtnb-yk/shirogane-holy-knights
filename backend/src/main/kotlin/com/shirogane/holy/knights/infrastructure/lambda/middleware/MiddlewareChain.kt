package com.shirogane.holy.knights.infrastructure.lambda.middleware

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import com.shirogane.holy.knights.adapter.controller.ApiResponse
import com.shirogane.holy.knights.adapter.controller.error.ErrorResponse
import com.shirogane.holy.knights.infrastructure.lambda.ApiGatewayResponseBuilder
import org.springframework.stereotype.Component

@Component
class MiddlewareChain(
    private val responseBuilder: ApiGatewayResponseBuilder
) {
    suspend fun execute(
        request: APIGatewayProxyRequestEvent,
        middlewares: List<Middleware>,
        finalHandler: suspend (APIGatewayProxyRequestEvent) -> ApiResponse
    ): APIGatewayProxyResponseEvent {
        
        fun buildChain(index: Int): suspend () -> APIGatewayProxyResponseEvent {
            return if (index >= middlewares.size) {
                // 最終的なハンドラを実行してレスポンス変換
                {
                    val result = finalHandler(request)
                    when (result.body) {
                        is ErrorResponse -> responseBuilder.errorResponse(result.statusCode, result.body)
                        else -> {
                            // パスに基づいてキャッシュ戦略を決定
                            val cacheMaxAge = determineCacheMaxAge(request.path)
                            if (cacheMaxAge > 0) {
                                responseBuilder.successWithLongCache(result.body, cacheMaxAge)
                            } else {
                                responseBuilder.successNoCache(result.body)
                            }
                        }
                    }
                }
            } else {
                // 次のMiddlewareまたはハンドラを実行
                {
                    middlewares[index].handle(request, buildChain(index + 1))
                }
            }
        }
        
        return buildChain(0)()
    }
    
    /**
     * パスに基づいてキャッシュ時間を決定
     */
    private fun determineCacheMaxAge(path: String?): Int {
        return when (path) {
            // 静的データ（長期キャッシュ）
            "/stream-tags", "/video-tags", "/news/categories", "/calendar/event-types" -> 3600 // 1時間
            "/stream-songs/stats", "/concert-songs/stats" -> 1800 // 30分
            // 検索結果（短期キャッシュ）
            "/videos", "/streams", "/news", "/calendar/events" -> 300 // 5分
            // ヘルスチェック（キャッシュなし）
            "/health" -> 0
            // デフォルト（短期キャッシュ）
            else -> 300
        }
    }
}