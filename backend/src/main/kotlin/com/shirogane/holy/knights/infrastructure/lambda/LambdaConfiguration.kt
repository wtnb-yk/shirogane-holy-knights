package com.shirogane.holy.knights.infrastructure.lambda

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.core.env.Environment

@Configuration
class LambdaConfiguration {
    
    /**
     * Spring Cloud Function用のプロファイル設定確認Bean
     * Lambda環境でプロファイルが正しく設定されているか確認
     */
    @Bean
    fun profileLogger(environment: Environment): String {
        val activeProfiles = environment.activeProfiles
        val springProfilesActive = System.getenv("SPRING_PROFILES_ACTIVE")
        
        println("=== Profile Configuration Debug ===")
        println("System.getenv(SPRING_PROFILES_ACTIVE): $springProfilesActive")
        println("Environment.activeProfiles: ${activeProfiles.joinToString()}")
        println("================================")
        
        return "Profile check completed"
    }
}