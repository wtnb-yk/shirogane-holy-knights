package com.shirogane.holy.knights.infrastructure.lambda

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import org.springframework.cloud.function.adapter.aws.SpringBootApiGatewayRequestHandler
import org.slf4j.LoggerFactory
import java.util.HashMap

/**
 * API GatewayとLambdaを統合するためのハンドラークラス
 *
 * AWS Lambda環境でSpring Boot APIを実行するための入口となるクラス。
 * API Gatewayからのリクエストを受け取り、Spring Cloudの関数として処理して結果を返します。
 */
class ApiGatewayLambdaHandler : SpringBootApiGatewayRequestHandler() {
    
    private val logger = LoggerFactory.getLogger(ApiGatewayLambdaHandler::class.java)
    
    /**
     * API Gatewayからのリクエストを処理するためのメソッド
     *
     * このメソッドは親クラスのメソッドをオーバーライドしています。
     * CORS対応を追加しています。
     *
     * @param request API Gatewayからのリクエスト
     * @return API Gatewayに返すレスポンス
     */
    override fun handleRequest(request: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent {
        logger.info("リクエスト処理開始: ${request.path}")
        
        val response = super.handleRequest(request)
        
        // CORS対応のヘッダーを追加
        val headers = response.headers ?: HashMap()
        headers["Access-Control-Allow-Origin"] = "*"
        headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
        headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization,Content-Length,X-Requested-With,Accept"
        headers["Access-Control-Allow-Credentials"] = "true"
        response.headers = headers
        
        logger.info("レスポンス処理完了: ${response.statusCode}")
        return response
    }
    
    /**
     * OPTIONSリクエスト用のハンドラ
     * 
     * プリフライトリクエストに対応するためのメソッド
     */
    override fun handleRequest(request: APIGatewayProxyRequestEvent, context: Context): APIGatewayProxyResponseEvent {
        if (request.httpMethod == "OPTIONS") {
            val response = APIGatewayProxyResponseEvent()
            val headers = HashMap<String, String>()
            headers["Access-Control-Allow-Origin"] = "*"
            headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
            headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization,Content-Length,X-Requested-With,Accept"
            headers["Access-Control-Allow-Credentials"] = "true"
            response.headers = headers
            response.statusCode = 200
            return response
        }
        
        return handleRequest(request)
    }
}