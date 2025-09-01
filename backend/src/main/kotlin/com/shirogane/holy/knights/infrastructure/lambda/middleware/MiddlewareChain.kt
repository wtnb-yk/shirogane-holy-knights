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
                        else -> responseBuilder.success(result.body)
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
}