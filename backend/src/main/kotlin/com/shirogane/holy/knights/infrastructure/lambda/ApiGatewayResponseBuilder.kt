package com.shirogane.holy.knights.infrastructure.lambda

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.adapter.controller.error.ErrorResponse
import org.springframework.stereotype.Component

@Component
class ApiGatewayResponseBuilder(
    private val objectMapper: ObjectMapper
) {
    
    fun success(body: Any): APIGatewayProxyResponseEvent {
        return APIGatewayProxyResponseEvent()
            .withStatusCode(200)
            .withHeaders(mapOf("Content-Type" to "application/json"))
            .withBody(objectMapper.writeValueAsString(body))
    }
    
    fun badRequest(message: String = "Bad Request"): APIGatewayProxyResponseEvent {
        return APIGatewayProxyResponseEvent()
            .withStatusCode(400)
            .withHeaders(mapOf("Content-Type" to "application/json"))
            .withBody(objectMapper.writeValueAsString(mapOf("error" to message)))
    }
    
    fun notFound(): APIGatewayProxyResponseEvent {
        return APIGatewayProxyResponseEvent()
            .withStatusCode(404)
            .withHeaders(mapOf("Content-Type" to "application/json"))
            .withBody(objectMapper.writeValueAsString(mapOf("error" to "Not Found")))
    }
    
    fun error(statusCode: Int = 500, message: String = "Internal Server Error"): APIGatewayProxyResponseEvent {
        return APIGatewayProxyResponseEvent()
            .withStatusCode(statusCode)
            .withHeaders(mapOf("Content-Type" to "application/json"))
            .withBody(objectMapper.writeValueAsString(mapOf("error" to message)))
    }
    
    fun errorResponse(statusCode: Int, errorResponse: ErrorResponse): APIGatewayProxyResponseEvent {
        return APIGatewayProxyResponseEvent()
            .withStatusCode(statusCode)
            .withHeaders(mapOf("Content-Type" to "application/json"))
            .withBody(objectMapper.writeValueAsString(errorResponse))
    }
}
