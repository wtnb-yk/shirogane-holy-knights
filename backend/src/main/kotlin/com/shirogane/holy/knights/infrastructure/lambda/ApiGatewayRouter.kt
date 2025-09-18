package com.shirogane.holy.knights.infrastructure.lambda

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import com.shirogane.holy.knights.adapter.controller.ApiResponse
import com.shirogane.holy.knights.adapter.controller.HealthController
import com.shirogane.holy.knights.adapter.controller.NewsController
import com.shirogane.holy.knights.adapter.controller.VideoController
import com.shirogane.holy.knights.adapter.controller.SongController
import com.shirogane.holy.knights.adapter.controller.CalendarController
import com.shirogane.holy.knights.infrastructure.lambda.middleware.MiddlewareChain
import com.shirogane.holy.knights.infrastructure.lambda.middleware.ErrorHandlingMiddleware
import com.shirogane.holy.knights.infrastructure.lambda.middleware.LoggingMiddleware
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class ApiGatewayRouter(
    private val videoController: VideoController,
    private val newsController: NewsController,
    private val songController: SongController,
    private val calendarController: CalendarController,
    private val healthController: HealthController,
    private val responseBuilder: ApiGatewayResponseBuilder,
    private val middlewareChain: MiddlewareChain,
    private val errorHandlingMiddleware: ErrorHandlingMiddleware,
    private val loggingMiddleware: LoggingMiddleware
) {
    private val logger = LoggerFactory.getLogger(ApiGatewayRouter::class.java)
    
    data class RouteKey(val method: String, val path: String)
    
    private val routes: Map<RouteKey, suspend (APIGatewayProxyRequestEvent) -> ApiResponse> = mapOf(
        // 基本ヘルスチェック（従来の軽量チェック）
        RouteKey("GET", "/health") to { _ -> 
            healthController.checkHealth()
        },
        // 段階的ヘルスチェック
        RouteKey("GET", "/health/basic") to { _ ->
            healthController.checkBasicHealth()
        },
        RouteKey("GET", "/health/detailed") to { _ ->
            healthController.checkDetailedHealth()
        },
        RouteKey("GET", "/health/complete") to { _ ->
            healthController.checkCompleteHealth()
        },
        // デプロイメント完了判定
        RouteKey("GET", "/health/ready") to { _ ->
            healthController.checkDeploymentReadiness()
        },
        RouteKey("POST", "/videos") to { request ->
            videoController.searchVideos(request.body)
        },
        RouteKey("POST", "/streams") to { request ->
            videoController.searchStreams(request.body)
        },

        RouteKey("GET", "/stream-tags") to { _ ->
            videoController.getAllStreamTags()
        },
        RouteKey("GET", "/video-tags") to { _ ->
            videoController.getAllVideoTags()
        },
        RouteKey("POST", "/news") to { request ->
            newsController.searchNews(request.body)
        },
        RouteKey("GET", "/news/categories") to { _ ->
            newsController.getNewsCategories()
        },
        RouteKey("POST", "/stream-songs") to { request ->
            songController.searchStreamSongs(request.body)
        },
        RouteKey("GET", "/stream-songs/stats") to { _ ->
            songController.getStreamSongsStats()
        },
        RouteKey("POST", "/concert-songs") to { request ->
            songController.searchConcertSongs(request.body)
        },
        RouteKey("GET", "/concert-songs/stats") to { _ ->
            songController.getConcertSongsStats()
        },
        RouteKey("POST", "/calendar/events") to { request ->
            calendarController.searchEvents(request.body)
        },
        RouteKey("GET", "/calendar/event-types") to { _ ->
            calendarController.getEventTypes()
        },
    )
    
    suspend fun route(request: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent {
        val httpMethod = request.httpMethod ?: "UNKNOWN"
        val path = request.path ?: "/unknown"
        
        if (request.httpMethod == null || request.path == null) {
            logger.warn("Invalid request: httpMethod=${request.httpMethod}, path=${request.path}")
            return responseBuilder.badRequest("Invalid request: missing httpMethod or path")
        }
        
        val routeKey = RouteKey(httpMethod, path)
        val handler = routes[routeKey]

        if (handler == null) {
            logger.warn("Unknown path: $httpMethod $path")
            return responseBuilder.notFound()
        }
        
        val middlewares = listOf(loggingMiddleware, errorHandlingMiddleware)
        return middlewareChain.execute(request, middlewares, handler)
    }
    
}
