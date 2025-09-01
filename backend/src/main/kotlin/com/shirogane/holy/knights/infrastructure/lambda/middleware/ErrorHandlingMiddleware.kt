package com.shirogane.holy.knights.infrastructure.lambda.middleware

import arrow.core.Either
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import com.fasterxml.jackson.core.JsonProcessingException
import com.shirogane.holy.knights.infrastructure.lambda.ApiGatewayResponseBuilder
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class ErrorHandlingMiddleware(
    private val responseBuilder: ApiGatewayResponseBuilder
) : Middleware {
    private val logger = LoggerFactory.getLogger(ErrorHandlingMiddleware::class.java)
    
    override suspend fun handle(
        request: APIGatewayProxyRequestEvent,
        next: suspend () -> APIGatewayProxyResponseEvent
    ): APIGatewayProxyResponseEvent {
        return Either.catch {
            next()
        }.fold(
            { e ->
                logger.error("Error processing request", e)
                when (e) {
                    is JsonProcessingException -> responseBuilder.error(400, "Invalid JSON format")
                    else -> responseBuilder.error()
                }
            },
            { it }
        )
    }
}