package com.shirogane.holy.knights.infrastructure.config

import com.shirogane.holy.knights.adapter.gateway.VideoRepositoryImpl
import com.shirogane.holy.knights.application.port.`in`.VideoUseCasePort
import com.shirogane.holy.knights.application.usecase.VideoUseCaseImpl
import com.shirogane.holy.knights.domain.repository.VideoRepository
import io.r2dbc.postgresql.PostgresqlConnectionConfiguration
import io.r2dbc.postgresql.PostgresqlConnectionFactory
import io.r2dbc.spi.ConnectionFactory
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.data.r2dbc.dialect.PostgresDialect
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories
import org.springframework.r2dbc.core.DatabaseClient

@Configuration
@EnableR2dbcRepositories(basePackages = ["com.shirogane.holy.knights.adapter.gateway"])
class R2dbcConfig {
    
    private val logger = LoggerFactory.getLogger(R2dbcConfig::class.java)
    
    @Bean
    @Primary
    fun connectionFactory(): ConnectionFactory {
        val host = System.getenv("DATABASE_HOST") ?: "localhost"
        val port = System.getenv("DATABASE_PORT")?.toIntOrNull() ?: 5432
        val database = System.getenv("DATABASE_NAME") ?: "shirogane"
        val username = System.getenv("DATABASE_USERNAME") ?: "postgres"
        val password = System.getenv("DATABASE_PASSWORD") ?: "postgres"
        
        val configuration = PostgresqlConnectionConfiguration.builder()
            .host(host)
            .port(port)
            .database(database)
            .username(username)
            .password(password)
            .build()
        
        return PostgresqlConnectionFactory(configuration)
    }
    
    @Bean
    fun r2dbcEntityTemplate(connectionFactory: ConnectionFactory): R2dbcEntityTemplate {
        val databaseClient = DatabaseClient.builder()
            .connectionFactory(connectionFactory)
            .bindMarkers(PostgresDialect.INSTANCE.bindMarkersFactory)
            .build()
        return R2dbcEntityTemplate(databaseClient, PostgresDialect.INSTANCE)
    }
    
    @Bean
    fun videoRepositoryImpl(template: R2dbcEntityTemplate): VideoRepository {
        return VideoRepositoryImpl(template)
    }
    
    @Bean 
    fun videoUseCaseImpl(repository: VideoRepository): VideoUseCasePort {
        return VideoUseCaseImpl(repository)
    }
    

}
