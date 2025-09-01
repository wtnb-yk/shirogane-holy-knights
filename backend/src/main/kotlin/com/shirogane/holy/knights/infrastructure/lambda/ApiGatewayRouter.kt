package com.shirogane.holy.knights.infrastructure.lambda

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import com.fasterxml.jackson.databind.ObjectMapper
import com.shirogane.holy.knights.adapter.controller.ApiResponse
import com.shirogane.holy.knights.adapter.controller.HealthController
import com.shirogane.holy.knights.adapter.controller.NewsController
import com.shirogane.holy.knights.adapter.controller.VideoController
import com.shirogane.holy.knights.adapter.controller.SongController
import com.shirogane.holy.knights.adapter.controller.error.ErrorResponse
import com.shirogane.holy.knights.application.dto.NewsSearchParamsDto
import com.shirogane.holy.knights.application.dto.StreamSearchParamsDto
import com.shirogane.holy.knights.application.dto.VideoSearchParamsDto
import com.shirogane.holy.knights.application.dto.StreamSongSearchParamsDto
import kotlinx.coroutines.runBlocking
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class ApiGatewayRouter(
    private val videoController: VideoController,
    private val newsController: NewsController,
    private val songController: SongController,
    private val healthController: HealthController,
    private val objectMapper: ObjectMapper,
    private val responseBuilder: ApiGatewayResponseBuilder
) {
    private val logger = LoggerFactory.getLogger(ApiGatewayRouter::class.java)
    
    data class RouteKey(val method: String, val path: String)
    
    private val routes: Map<RouteKey, suspend (APIGatewayProxyRequestEvent) -> ApiResponse> = mapOf(
        RouteKey("GET", "/health") to { _ -> 
            healthController.checkHealth()
        },
        RouteKey("POST", "/videos") to { request ->
            val params = parseBody(request.body, VideoSearchParamsDto::class.java) ?: VideoSearchParamsDto()
            videoController.searchVideos(params)
        },
        RouteKey("POST", "/streams") to { request ->
            val params = parseBody(request.body, StreamSearchParamsDto::class.java) ?: StreamSearchParamsDto()
            videoController.searchStreams(params)
        },
        RouteKey("GET", "/stream-tags") to { _ ->
            videoController.getAllStreamTags()
        },
        RouteKey("GET", "/video-tags") to { _ ->
            videoController.getAllVideoTags()
        },
        RouteKey("POST", "/news") to { request ->
            val params = parseBody(request.body, NewsSearchParamsDto::class.java) ?: NewsSearchParamsDto()
            newsController.searchNews(params)
        },
        RouteKey("GET", "/news/categories") to { _ ->
            newsController.getNewsCategories()
        },
        RouteKey("POST", "/stream-songs") to { request ->
            val params = parseBody(request.body, StreamSongSearchParamsDto::class.java) ?: StreamSongSearchParamsDto()
            songController.searchStreamSongs(params)
        },
        RouteKey("GET", "/stream-songs/stats") to { _ ->
            songController.getStreamSongsStats()
        },
    )
    
    fun route(request: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent {
        logger.info("Routing request: ${request.httpMethod} ${request.path}")
        
        val routeKey = RouteKey(request.httpMethod, request.path)
        val handler = routes[routeKey]
        
        return if (handler != null) {
            val result = runBlocking { handler(request) }
            
            when (result.body) {
                is ErrorResponse -> responseBuilder.errorResponse(result.statusCode, result.body)
                else -> responseBuilder.success(result.body)
            }
        } else {
            logger.warn("Unknown path: ${request.httpMethod} ${request.path}")
            responseBuilder.notFound()
        }
    }
    
    private fun <T> parseBody(body: String?, clazz: Class<T>): T? {
        return if (body != null) {
            try {
                objectMapper.readValue(body, clazz)
            } catch (e: Exception) {
                logger.error("Failed to parse request body", e)
                null
            }
        } else {
            null
        }
    }
}
