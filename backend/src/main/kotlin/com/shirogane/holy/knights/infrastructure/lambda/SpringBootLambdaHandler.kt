package com.shirogane.holy.knights.infrastructure.lambda

import org.springframework.cloud.function.adapter.aws.FunctionInvoker

/**
 * Spring Boot統合Lambda ハンドラー
 * 
 * Spring Cloud Functionを使用してSpring BootアプリケーションをLambdaで実行します。
 */
class SpringBootLambdaHandler : FunctionInvoker()