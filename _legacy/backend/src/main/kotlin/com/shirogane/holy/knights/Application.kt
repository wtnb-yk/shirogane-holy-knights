package com.shirogane.holy.knights

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.WebApplicationType

@SpringBootApplication
class Application {
    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            val app = org.springframework.boot.SpringApplication(Application::class.java)
            app.webApplicationType = WebApplicationType.REACTIVE
            
            // Lambda環境でのプロファイル設定を強制的に適用
            val springProfilesActive = System.getenv("SPRING_PROFILES_ACTIVE")
            if (springProfilesActive != null) {
                System.setProperty("spring.profiles.active", springProfilesActive)
                app.setAdditionalProfiles(springProfilesActive)
                println("Lambda環境: プロファイル設定 = $springProfilesActive")
            }
            
            // AWS Lambda環境の検出
            val isLambda = System.getenv("AWS_LAMBDA_FUNCTION_NAME") != null ||
                          System.getenv("_LAMBDA_SERVER_PORT") != null
            if (isLambda && springProfilesActive == null) {
                System.setProperty("spring.profiles.active", "lambda")
                app.setAdditionalProfiles("lambda")
                println("Lambda環境検出: lambdaプロファイルを自動設定")
            }
            
            app.run(*args)
        }
    }
}
