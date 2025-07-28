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
        logger.info("ConnectionFactory作成開始")
        
        val host = System.getenv("DATABASE_HOST") ?: "localhost"
        val port = System.getenv("DATABASE_PORT")?.toIntOrNull() ?: 5432
        val database = System.getenv("DATABASE_NAME") ?: "shirogane_db"
        val username = System.getenv("DATABASE_USERNAME") ?: "postgres"
        val password = System.getenv("DATABASE_PASSWORD") ?: "postgres"
        
        logger.info("データベース接続情報: $host:$port/$database")
        
        val configuration = PostgresqlConnectionConfiguration.builder()
            .host(host)
            .port(port)
            .database(database)
            .username(username)
            .password(password)
            .build()
        
        val connectionFactory = PostgresqlConnectionFactory(configuration)
        logger.info("ConnectionFactory作成完了")
        
        return connectionFactory
    }
    
    @Bean
    fun r2dbcEntityTemplate(connectionFactory: ConnectionFactory): R2dbcEntityTemplate {
        logger.info("R2dbcEntityTemplate作成開始（PostgresDialect明示指定）")
        val databaseClient = DatabaseClient.builder()
            .connectionFactory(connectionFactory)
            .bindMarkers(PostgresDialect.INSTANCE.bindMarkersFactory)
            .build()
        val template = R2dbcEntityTemplate(databaseClient, PostgresDialect.INSTANCE)
        logger.info("R2dbcEntityTemplate作成完了")
        return template
    }
    
    @Bean
    fun archiveRepositoryImpl(template: R2dbcEntityTemplate): ArchiveRepository {
        logger.info("ArchiveRepositoryImpl Bean 作成開始")
        val repository = ArchiveRepositoryImpl(template)
        logger.info("=== ArchiveRepositoryImpl Bean 作成完了 ===")
        return repository
    }
    
    @Bean 
    fun archiveUseCaseImpl(repository: ArchiveRepository): ArchiveUseCasePort {
        logger.info("ArchiveUseCaseImpl Bean 作成開始")
        val useCase = ArchiveUseCaseImpl(repository)
        logger.info("=== ArchiveUseCaseImpl Bean 作成完了 ===")
        return useCase
    }
    
    @Bean
    fun apiGatewayFunction(useCase: ArchiveUseCasePort, mapper: ObjectMapper): Function<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
        logger.info("ApiGatewayFunction Bean 作成開始")
        val function = ApiGatewayFunction(useCase, mapper)
        logger.info("=== ApiGatewayFunction Bean 作成完了 ===")
        return function
    }

    @Bean
    @ConditionalOnMissingBean
    fun objectMapper(): ObjectMapper {
        logger.info("ObjectMapper Bean 作成")
        return ObjectMapper().registerKotlinModule()
    }
}