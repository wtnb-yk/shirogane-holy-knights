package com.shirogane.holy.knights.infrastructure.lambda

import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.core.env.ConfigurableEnvironment

/**
 * Spring Cloud Function AWS Lambda環境でプロファイルを確実に設定するInitializer
 */
class SpringProfileInitializer : ApplicationContextInitializer<ConfigurableApplicationContext> {
    
    override fun initialize(applicationContext: ConfigurableApplicationContext) {
        val environment = applicationContext.environment
        val springProfilesActive = System.getenv("SPRING_PROFILES_ACTIVE")
        
        if (springProfilesActive != null && springProfilesActive.isNotBlank()) {
            println("SpringProfileInitializer: Setting active profile to '$springProfilesActive' from environment variable")
            environment.setActiveProfiles(springProfilesActive)
        }
        
        // AWS Lambda環境の検出
        val isLambda = System.getenv("AWS_LAMBDA_FUNCTION_NAME") != null ||
                       System.getenv("_LAMBDA_SERVER_PORT") != null
                       
        if (isLambda && environment.activeProfiles.isEmpty()) {
            println("SpringProfileInitializer: Lambda environment detected, setting 'lambda' profile")
            environment.setActiveProfiles("lambda")
        }
        
        println("SpringProfileInitializer: Active profiles = ${environment.activeProfiles.joinToString()}")
    }
}
