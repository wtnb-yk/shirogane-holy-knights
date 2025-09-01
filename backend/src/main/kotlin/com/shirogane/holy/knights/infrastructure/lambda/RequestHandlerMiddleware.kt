package com.shirogane.holy.knights.infrastructure.lambda

import arrow.core.Either
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import com.shirogane.holy.knights.adapter.controller.ApiResponse
import com.shirogane.holy.knights.adapter.controller.error.ErrorResponse
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class RequestHandlerMiddleware(
    private val responseBuilder: ApiGatewayResponseBuilder
) {
    private val logger = LoggerFactory.getLogger(RequestHandlerMiddleware::class.java)
    
    fun handle(
        request: APIGatewayProxyRequestEvent,
        handler: suspend (APIGatewayProxyRequestEvent) -> ApiResponse
    ): APIGatewayProxyResponseEvent {
        return Either.catch {
            val result = runBlocking { handler(request) }

            when (result.body) {
                is ErrorResponse -> responseBuilder.errorResponse(result.statusCode, result.body)
                else -> responseBuilder.success(result.body)
            }
        }.fold(
            { e ->
                logger.error("Error processing request", e)
                responseBuilder.error()
            },
            { it }
        )
    }
}