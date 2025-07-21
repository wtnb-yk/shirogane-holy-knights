package com.shirogane.holy.knights.infrastructure.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.messaging.Message
import java.util.function.Function

/**
 * Lambda関数の設定クラス
 *
 * Spring Cloud Functionを使用したLambda関数のエントリポイントを定義します。
 * "router"という名前の関数がメインのLambdaエントリポイントとして機能します。
 */
@Configuration
class LambdaConfig {

    /**
     * API Gatewayからのリクエストをルーティングする関数
     *
     * このBeanはSpring Cloud Functionによって自動的に検出され、
     * AWS Lambda上で実行される際のエントリポイントとして使用されます。
     *
     * @return 入力メッセージを処理し、出力メッセージを返す関数
     */
    @Bean
    fun router(): Function<Message<Any>, Message<Any>> {
        return Function { message ->
            // メッセージの処理はSpring MVCのコントローラーに委譲されます
            // ここではメッセージをそのまま返しますが、必要に応じてカスタム処理を追加できます
            message
        }
    }
}