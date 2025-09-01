package com.shirogane.holy.knights.infrastructure.lambda

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.util.function.Function

/**
 * AWS Lambda + API Gateway用のFunction実装
 * ルーティングとエラーハンドリングのみを担当
 */
@Component
class ApiGatewayFunction(
    private val router: ApiGatewayRouter,
    private val corsHandler: CorsHandler,
) : Function<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private val logger = LoggerFactory.getLogger(ApiGatewayFunction::class.java)

    override fun apply(request: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent {
        logger.info("Lambda Function called: ${request.httpMethod} ${request.path}")
        
        // OPTIONSリクエストの処理（プリフライト）
        if (request.httpMethod == "OPTIONS") {
            return corsHandler.createOptionsResponse(request)
        }

        val response = runBlocking { router.route(request) }
        return corsHandler.addCorsHeaders(request, response)
    }
}
