package com.shirogane.holy.knights.infrastructure.config

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.shirogane.holy.knights.adapter.gateway.ArchiveRepositoryImpl
import com.shirogane.holy.knights.application.port.`in`.ArchiveUseCasePort
import com.shirogane.holy.knights.application.usecase.ArchiveUseCaseImpl
import com.shirogane.holy.knights.domain.repository.ArchiveRepository
import com.shirogane.holy.knights.infrastructure.lambda.ApiGatewayFunction
import java.util.function.Function
import io.r2dbc.postgresql.PostgresqlConnectionConfiguration
import io.r2dbc.postgresql.PostgresqlConnectionFactory
import io.r2dbc.spi.ConnectionFactory
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
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
        val database = System.getenv("DATABASE_NAME") ?: "shirogane_db"
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
    fun archiveRepositoryImpl(template: R2dbcEntityTemplate): ArchiveRepository {
        return ArchiveRepositoryImpl(template)
    }
    
    @Bean 
    fun archiveUseCaseImpl(repository: ArchiveRepository): ArchiveUseCasePort {
        return ArchiveUseCaseImpl(repository)
    }
    
    @Bean
    fun apiGatewayFunction(useCase: ArchiveUseCasePort, mapper: ObjectMapper): Function<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
        return ApiGatewayFunction(useCase, mapper)
    }

}