package com.shirogane.holy.knights.infrastructure.lambda

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.application.dto.ArchiveSearchParamsDto
import com.shirogane.holy.knights.application.port.`in`.ArchiveUseCasePort
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import java.util.function.Function

/**
 * AWS Lambda + API Gateway用のFunction実装
 */
class ApiGatewayFunction(
    private val archiveUseCase: ArchiveUseCasePort,
    private val objectMapper: ObjectMapper
) : Function<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private val logger = LoggerFactory.getLogger(ApiGatewayFunction::class.java)

    override fun apply(request: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent {
        logger.info("Lambda Function called: ${request.httpMethod} ${request.path}")
        
        return try {
            when {
                request.path == "/health" && request.httpMethod == "GET" -> handleHealth()
                request.path == "/archiveSearch" && request.httpMethod == "POST" -> handleArchiveSearch(request)
                else -> {
                    logger.warn("Unknown path: ${request.httpMethod} ${request.path}")
                    APIGatewayProxyResponseEvent()
                        .withStatusCode(404)
                        .withHeaders(mapOf("Content-Type" to "application/json"))
                        .withBody(objectMapper.writeValueAsString(mapOf("error" to "Not Found")))
                }
            }
        } catch (e: Exception) {
            logger.error("Lambda Function error", e)
            APIGatewayProxyResponseEvent()
                .withStatusCode(500)
                .withHeaders(mapOf("Content-Type" to "application/json"))
                .withBody(objectMapper.writeValueAsString(mapOf("error" to "Internal Server Error")))
        }
    }

    private fun handleHealth(): APIGatewayProxyResponseEvent {
        logger.info("Health check requested")
        val response = mapOf(
            "status" to "healthy",
            "service" to "shirogane-holy-knights-api"
        )
        
        return APIGatewayProxyResponseEvent()
            .withStatusCode(200)
            .withHeaders(mapOf("Content-Type" to "application/json"))
            .withBody(objectMapper.writeValueAsString(response))
    }

    private fun handleArchiveSearch(request: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent {
        logger.info("Archive search requested")
        
        val params = if (request.body != null) {
            objectMapper.readValue(request.body, ArchiveSearchParamsDto::class.java)
        } else {
            ArchiveSearchParamsDto() // デフォルト値
        }
        
        logger.info("Archive search params: $params")
        
        val result = runBlocking { archiveUseCase.searchArchives(params) }
        logger.info("Archive search returning ${result.items.size} items")
        
        return APIGatewayProxyResponseEvent()
            .withStatusCode(200)
            .withHeaders(mapOf("Content-Type" to "application/json"))
            .withBody(objectMapper.writeValueAsString(result))
    }
}