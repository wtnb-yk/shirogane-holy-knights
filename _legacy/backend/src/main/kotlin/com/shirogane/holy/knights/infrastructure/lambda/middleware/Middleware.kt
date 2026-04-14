package com.shirogane.holy.knights.infrastructure.lambda.middleware

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent

interface Middleware {
    suspend fun handle(
        request: APIGatewayProxyRequestEvent,
        next: suspend () -> APIGatewayProxyResponseEvent
    ): APIGatewayProxyResponseEvent
}