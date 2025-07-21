package com.shirogane.holy.knights.infrastructure.lambda

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.HashMap

@Component
class ApiGatewayLambdaHandler : RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    
    private val logger = LoggerFactory.getLogger(ApiGatewayLambdaHandler::class.java)
    
    @Value("\${spring.webflux.cors.allowed-origins:http://localhost:3000}")
    private var allowedOrigins: String = "http://localhost:3000"
    
    @Value("\${spring.webflux.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private var allowedMethods: String = "GET,POST,PUT,DELETE,OPTIONS"
    
    @Value("\${spring.webflux.cors.allowed-headers:Content-Type,Authorization}")
    private var allowedHeaders: String = "Content-Type,Authorization,Content-Length,X-Requested-With,Accept"
    
    override fun handleRequest(request: APIGatewayProxyRequestEvent, context: Context): APIGatewayProxyResponseEvent {
        logger.info("リクエスト処理開始: ${request.path}")
        logger.info("HTTP Method: ${request.httpMethod}")
        
        // プリフライトリクエストの場合
        if (request.httpMethod == "OPTIONS") {
            return createCorsResponse(200)
        }
        
        // デフォルトの応答を準備
        val response = createCorsResponse(200)
        
        // シンプルなテキストを返す
        response.body = "{\"message\": \"Lambda handler called\"}"
        
        logger.info("レスポンス処理完了: ${response.statusCode}")
        return response
    }
    
    private fun createCorsResponse(statusCode: Int): APIGatewayProxyResponseEvent {
        val response = APIGatewayProxyResponseEvent()
        response.statusCode = statusCode
        
        // CORS対応のヘッダーを追加
        val headers = HashMap<String, String>()
        // allowedOriginsは複数指定可能だが、Lambdaでは1つだけ指定する
        // 複数ある場合は最初の値を使用
        val origin = allowedOrigins.split(",")[0]
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Methods"] = allowedMethods
        headers["Access-Control-Allow-Headers"] = allowedHeaders
        
        // オリジンに特定のドメインを指定している場合のみCredentialsを許可
        if (origin != "*") {
            headers["Access-Control-Allow-Credentials"] = "true"
        }
        
        response.headers = headers
        return response
    }
}